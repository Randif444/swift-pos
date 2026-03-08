'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../utils/supabase/server';

export async function processCheckout(
  cart: any[],
  paymentMethod: string,
  cashAmount: number,
  changeAmount: number
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User tidak ditemukan');
  const tenantId = user.app_metadata?.tenant_id;
  if (!tenantId) throw new Error('Data toko tidak ditemukan');

  
  const productIds = cart.map(item => item.id);
  const { data: dbProducts } = await supabase
    .from('products')
    .select('id, price, name')
    .in('id', productIds);

  if (!dbProducts) throw new Error('Produk tidak valid');


  let serverTotal = 0;
  const verifiedCart = cart.map(item => {
    const dbItem = dbProducts.find(p => p.id === item.id);
    if (!dbItem) throw new Error(`Produk ${item.name} sudah tidak ada`);
    
    serverTotal += dbItem.price * item.qty;
   
    return { ...item, price: dbItem.price }; 
  });

  if (paymentMethod === 'cash' && cashAmount < serverTotal) {
    throw new Error('Uang pembayaran kurang, Kang!');
  }

  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select('id, created_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (recentTransactions && recentTransactions.length > 0) {
    const lastTxTime = new Date(recentTransactions[0].created_at).getTime();
    const now = Date.now();
    if (now - lastTxTime < 3000) {
      throw new Error('Transaksi terlalu cepat. Harap tunggu sebentar, Kang.');
    }
  }

  const receiptNumber = `RCPT-${Date.now()}`;

 
  const { error: rpcError } = await supabase.rpc('process_pos_checkout', {
    p_tenant_id: tenantId,
    p_cart: verifiedCart, 
    p_payment_method: paymentMethod,
    p_cash_amount: cashAmount,
    p_change_amount: paymentMethod === 'cash' ? (cashAmount - serverTotal) : 0,
    p_receipt_number: receiptNumber
  });

  if (rpcError) throw new Error('Gagal memproses transaksi. Pastikan stok mencukupi.');

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/transactions');
  revalidatePath('/dashboard/pos');

  return { success: true, receiptNumber };
}