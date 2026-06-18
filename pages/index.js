import Head from "next/head";

const marketplaces = ["Amazon", "Flipkart", "Meesho", "Myntra", "Shopify"];
const kpis = [
  ["Total Orders", "48,260", "+18.4%"],
  ["Delivered Orders", "42,910", "+12.1%"],
  ["Returned Orders", "2,184", "4.5%"],
  ["Cancelled Orders", "1,026", "2.1%"],
  ["Gross Revenue", "₹8.42Cr", "+22.8%"],
  ["Net Revenue", "₹6.91Cr", "+19.2%"],
  ["Marketplace Fees", "₹54.2L", "6.4%"],
  ["GST Liability", "₹38.7L", "Due"],
  ["Net Profit", "₹1.18Cr", "17.1%"],
];
const modules = [
  ["CSV Upload Center", "Drag-and-drop Amazon orders, Flipkart settlements, Meesho payments, Shopify transactions and more into Firebase Storage."],
  ["Reconciliation Engine", "Matches order ID, SKU, settlement and refund amounts, then flags matched, partial and mismatch records."],
  ["GST Workspace", "Calculates output GST, input GST, taxable sales, refund adjustments and CA-ready GSTR-1/GSTR-3B summaries."],
  ["Profit Intelligence", "Allocates fees, shipping, ads, product cost and GST per order to calculate profit, loss and margin %."],
  ["Settlement Tracker", "Compares expected versus received settlements and highlights missing or delayed payouts."],
  ["AI Insights", "Surfaces high-return SKUs, low-margin products, GST risks and settlement mismatch alerts in plain English."],
];
const roles = ["Super Admin", "Admin", "Accountant", "Seller"];

function MiniChart({ type = "bar" }) {
  const bars = [42, 64, 51, 78, 69, 92, 84, 105, 96, 118, 111, 132];
  return (
    <div className="chart" aria-label={`${type} chart`}>
      {bars.map((bar, index) => (
        <span key={index} style={{ height: `${bar}px` }} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>ChiragTax AI | Marketplace GST & Profit Reconciliation</title>
        <meta name="description" content="Production-grade SaaS for reconciling marketplace orders, payments, returns, GST and profit for Indian ecommerce sellers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="hero-shell">
          <nav className="nav">
            <div className="brand"><span>CT</span> ChiragTax AI</div>
            <div className="nav-links"><a>Dashboard</a><a>Reconcile</a><a>GST</a><a>Pricing</a></div>
            <button className="primary small">Launch App</button>
          </nav>
          <div className="hero-grid">
            <div>
              <p className="eyebrow">Enterprise SaaS for Indian marketplace sellers</p>
              <h1>Automated reconciliation, GST and profit intelligence for every seller payout.</h1>
              <p className="hero-copy">Connect Amazon, Flipkart, Meesho, Myntra and Shopify reports to produce CA-ready sales registers, settlement variance reports, GST summaries and margin alerts.</p>
              <div className="actions"><button className="primary">Start free</button><button className="secondary">View CA report</button></div>
              <div className="marketplaces">{marketplaces.map((m) => <span key={m}>{m}</span>)}</div>
            </div>
            <div className="dashboard-card glass">
              <div className="card-head"><strong>Revenue vs Profit</strong><span>FY 2026</span></div>
              <MiniChart />
              <div className="insight">SKU SUPARSH-WALLET generated ₹25,000 sales but only 8% margin.</div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head"><p className="eyebrow">Dashboard overview</p><h2>Live KPIs that finance teams can trust</h2></div>
          <div className="kpi-grid">{kpis.map(([label, value, delta]) => <article className="kpi" key={label}><p>{label}</p><strong>{value}</strong><span>{delta}</span></article>)}</div>
        </section>

        <section className="section split">
          <div className="panel">
            <p className="eyebrow">Upload center</p><h2>Drag, drop and normalize reports</h2>
            <div className="upload-box"><div>⬆</div><strong>Drop marketplace CSV / Excel files</strong><p>Orders, payments, refunds, returns and settlements are stored in Firebase Storage and parsed into Firestore collections.</p></div>
          </div>
          <div className="panel">
            <p className="eyebrow">Reconciliation status</p><h2>Exception-first operations</h2>
            {[['Matched',78],['Partially matched',14],['Mismatch',8]].map(([s,v]) => <div className="progress" key={s}><span>{s}</span><b>{v}%</b><i style={{width:`${v}%`}} /></div>)}
          </div>
        </section>

        <section className="section">
          <div className="module-grid">{modules.map(([title, body]) => <article className="module" key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
        </section>

        <section className="section split">
          <div className="panel light"><p className="eyebrow">Admin & subscriptions</p><h2>Role based control with Razorpay plans</h2><p>Manage users, marketplace connections, reports and Free, Basic, Pro or Enterprise subscriptions with Firebase Authentication custom claims.</p><div className="roles">{roles.map(r => <span key={r}>{r}</span>)}</div></div>
          <div className="panel light"><p className="eyebrow">Exports</p><h2>CA-ready output</h2><p>Generate Excel, CSV and PDF exports for Profit & Loss, GST Report, Sales Register, Settlement Report and consolidated CA Report.</p><button className="primary">Generate CA Pack</button></div>
        </section>
      </main>
    </>
  );
}
