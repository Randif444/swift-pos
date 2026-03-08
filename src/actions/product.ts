'use server';

import { createClient } from '../utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User tidak ditemukan');

  const tenantId = user.app_metadata?.tenant_id;
  if (!tenantId) throw new Error('Tenant tidak ditemukan');

  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const imageFile = formData.get('image') as File;

  let imageUrl = '';

  if (imageFile && imageFile.size > 0) {
    const fileName = `${tenantId}/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile);

    if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
      
    imageUrl = publicUrl;
  }


  const { data: newProduct, error } = await supabase.from('products').insert({
    tenant_id: tenantId,
    name,
    price,
    stock,
    image_url: imageUrl
  }).select().single();

  if (error) throw new Error(error.message);

 
  if (stock > 0) {
    await supabase.from('inventory_transactions').insert({
      tenant_id: tenantId,
      product_id: newProduct.id,
      product_name: name,
      type: 'IN',
      quantity: stock,
      historical_price: price,
      receipt_number: `INIT-${Date.now()}`,
      payment_method: 'system'
    });
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/products');
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user?.app_metadata?.tenant_id;
  
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const imageFile = formData.get('image') as File;

 
  const { data: oldProduct } = await supabase
    .from('products')
    .select('stock, name')
    .eq('id', id)
    .single();

  let updateData: any = { name, price, stock };

  if (imageFile && imageFile.size > 0) {
    const fileName = `${tenantId}/${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile);

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      updateData.image_url = publicUrl;
    }
  }

  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id);

  if (error) throw new Error(error.message);


  if (oldProduct && oldProduct.stock !== stock) {
    const diff = stock - oldProduct.stock;
    await supabase.from('inventory_transactions').insert({
      tenant_id: tenantId,
      product_id: id,
      product_name: name,
      type: diff > 0 ? 'IN' : 'ADJUST',
      quantity: Math.abs(diff),
      historical_price: price,
      receipt_number: `ADJ-${Date.now()}`,
      payment_method: 'system'
    });
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/products');
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/products');
}

export async function restockProduct(id: string, additionalStock: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const tenantId = user?.app_metadata?.tenant_id;

  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock, name, price')
    .eq('id', id)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const newStock = (product.stock || 0) + additionalStock;


  const { error: updateError } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', id);

  if (updateError) throw new Error(updateError.message);

 
  const { error: logError } = await supabase.from('inventory_transactions').insert({
    tenant_id: tenantId,
    product_id: id,
    product_name: product.name,
    type: 'IN',
    quantity: additionalStock,
    historical_price: product.price,
    receipt_number: `RESTOCK-${Date.now()}`,
    payment_method: 'system'
  });

  if (logError) console.error("Gagal mencatat log restock:", logError);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/products');
}