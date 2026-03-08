import { createClient } from "@/utils/supabase/server";
import DashboardUI from "@/components/dashboard/DashboardUI";
import SetupPopup from "@/components/dashboard/SetupPopup";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: relations } = await supabase
    .from("tenant_users")
    .select("tenant_id")
    .eq("user_id", user.id);

  const tenantId =
    relations && relations.length > 0 ? relations[0].tenant_id : null;

  const { data: tenant } = tenantId
    ? await supabase.from("tenants").select("*").eq("id", tenantId).single()
    : { data: null };

  const { count: totalProducts } = tenantId
    ? await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .is("deleted_at", null)
    : { count: 0 };

  const { data: stockData } = tenantId
    ? await supabase
        .from("products")
        .select("stock")
        .eq("tenant_id", tenantId)
        .is("deleted_at", null)
    : { data: [] };

  const totalStock = stockData?.reduce((sum, item) => sum + item.stock, 0) || 0;

  const { data: transactions } = tenantId
    ? await supabase
        .from("inventory_transactions")
        .select(
          "id, type, quantity, created_at, product_name, historical_price",
        )
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(5)
    : { data: [] };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const { data: recentTransactions } = tenantId
    ? await supabase
        .from("inventory_transactions")
        .select("quantity, created_at, historical_price, type, product_name")
        .eq("tenant_id", tenantId)
        .in("type", ["OUT", "sales"])
        .gte("created_at", sevenDaysAgo.toISOString())
    : { data: [] };

  const revenueMap: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - i);
    revenueMap[d.toLocaleDateString("en-CA")] = 0;
  }

  let revenueToday = 0;
  let revenueYesterday = 0;
  let transactionCountToday = 0;

  const productSales: Record<
    string,
    { name: string; qty: number; revenue: number }
  > = {};

  recentTransactions?.forEach((trx) => {
    const trxDate = new Date(trx.created_at);
    const dateKey = trxDate.toLocaleDateString("en-CA");

    const subtotal =
      (Number(trx.historical_price) || 0) * (Number(trx.quantity) || 0);

    if (revenueMap[dateKey] !== undefined) {
      revenueMap[dateKey] += subtotal;
    }

    const yesterdayDate = new Date(todayStart);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    if (trxDate >= todayStart) {
      revenueToday += subtotal;
      transactionCountToday++;
    } else if (trxDate >= yesterdayDate && trxDate < todayStart) {
      revenueYesterday += subtotal;
    }

    if (!productSales[trx.product_name]) {
      productSales[trx.product_name] = {
        name: trx.product_name,
        qty: 0,
        revenue: 0,
      };
    }

    productSales[trx.product_name].qty += Number(trx.quantity);
    productSales[trx.product_name].revenue += subtotal;
  });

  const chartData = Object.entries(revenueMap)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  let growthPercentage = 0;

  if (revenueYesterday > 0)
    growthPercentage =
      ((revenueToday - revenueYesterday) / revenueYesterday) * 100;

  const { data: lowStock } = tenantId
    ? await supabase
        .from("products")
        .select("id, name, stock")
        .eq("tenant_id", tenantId)
        .is("deleted_at", null)
        .lte("stock", 5)
    : { data: [] };

  return (
    <>
      <DashboardUI
        tenant={tenant}
        user={user}
        totalProducts={totalProducts || 0}
        totalStock={totalStock}
        transactions={transactions || []}
        totalTransactions={transactionCountToday}
        revenueToday={revenueToday}
        chartData={chartData}
        lowStock={lowStock || []}
        growthPercentage={growthPercentage}
        topProducts={topProducts}
      />
      <SetupPopup tenant={tenant} role={""} />
    </>
  );
}
