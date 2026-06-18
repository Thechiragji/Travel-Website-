export const MARKETPLACES = ["amazon", "flipkart", "meesho", "myntra", "shopify"];

export function reconcileRecords({ orders = [], payments = [], refunds = [], settlements = [] }) {
  const paymentMap = new Map(payments.map((payment) => [payment.orderId, payment]));
  const refundMap = new Map(refunds.map((refund) => [refund.orderId, refund]));
  const settlementMap = new Map(settlements.map((settlement) => [settlement.orderId, settlement]));

  const rows = orders.map((order) => {
    const payment = paymentMap.get(order.orderId);
    const refund = refundMap.get(order.orderId);
    const settlement = settlementMap.get(order.orderId);
    const expectedSettlement = Number(order.netAmount || order.salesAmount || 0) - Number(refund?.amount || 0);
    const receivedSettlement = Number(settlement?.amount || payment?.amount || 0);
    const difference = roundMoney(receivedSettlement - expectedSettlement);
    const status = Math.abs(difference) <= 1 ? "matched" : payment || settlement ? "partially_matched" : "mismatch";

    return { orderId: order.orderId, sku: order.sku, expectedSettlement, receivedSettlement, refundAmount: Number(refund?.amount || 0), difference, status };
  });

  return {
    rows,
    summary: rows.reduce((summary, row) => ({ ...summary, [row.status]: (summary[row.status] || 0) + 1 }), { matched: 0, partially_matched: 0, mismatch: 0 }),
  };
}

export function calculateGst({ sales = [], purchases = [], refunds = [] }, rate = 0.18) {
  const taxableSales = sum(sales, "taxableValue");
  const outputGst = roundMoney(taxableSales * rate);
  const inputGst = roundMoney(sum(purchases, "gstAmount"));
  const refundAdjustments = roundMoney(sum(refunds, "gstAmount"));
  const netGstLiability = roundMoney(Math.max(outputGst - inputGst - refundAdjustments, 0));
  return { taxableSales, outputGst, inputGst, refundAdjustments, netGstLiability, gstr1Summary: { taxableSales, outputGst }, gstr3bSummary: { outwardTaxableSupplies: taxableSales, eligibleItc: inputGst, taxPayable: netGstLiability } };
}

export function calculateProfit(order) {
  const revenue = Number(order.salesAmount || 0);
  const costs = ["marketplaceFees", "shippingCharges", "advertisingCost", "productCost", "gst"].reduce((total, key) => total + Number(order[key] || 0), 0);
  const profit = roundMoney(revenue - costs);
  const marginPercent = revenue ? roundMoney((profit / revenue) * 100) : 0;
  return { ...order, profit, loss: profit < 0 ? Math.abs(profit) : 0, marginPercent };
}

export function generateAiInsights({ products = [], reconciliations = [], returns = [] }) {
  const insights = [];
  products.forEach((product) => {
    if (product.marginPercent < 10) insights.push({ type: "low_profit", severity: "high", message: `SKU ${product.sku} generated ₹${product.salesAmount} sales but only ${product.marginPercent}% margin.` });
    if (product.unitsSold > 50) insights.push({ type: "best_seller", severity: "info", message: `${product.sku} is a best selling product with ${product.unitsSold} units sold.` });
  });
  reconciliations.filter((row) => row.status === "mismatch").forEach((row) => insights.push({ type: "settlement_mismatch", severity: "high", message: `Order ${row.orderId} has settlement difference of ₹${Math.abs(row.difference)}.` }));
  returns.filter((row) => row.returnRate > 0.12).forEach((row) => insights.push({ type: "high_return", severity: "medium", message: `${row.sku} has high return rate of ${roundMoney(row.returnRate * 100)}%.` }));
  return insights;
}

function sum(rows, key) { return roundMoney(rows.reduce((total, row) => total + Number(row[key] || 0), 0)); }
function roundMoney(value) { return Math.round((Number(value) + Number.EPSILON) * 100) / 100; }
