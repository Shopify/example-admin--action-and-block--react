import {authenticate} from '../shopify.server';

export async function loader({request}) {
  const url = new URL(request.url);
  const query = url.searchParams;
  const docs = query.get("printType").split(',');
  const orderId = query.get('orderId');
  const id = orderId.split('/')[-1];
  const orderDetails = await admin.graphql(
    `query {
      order(id: "${orderId}") {
        id
        totalPriceSet {
          shopMoney {
            amount
          }
        }
      }
    }`
  );
  const json = await orderDetails.json();
  const price = json.data.order.totalPriceSet.shopMoney.amount;
  const pages = docs.map((x) => {
    return pageTemplate.replace("TITLE", x).replace('ORDER_ID', id).replace('ORDER_TOTAL', price)
  });
  const singlePage = pages.join(pageBreak);
  const printed = printTemplate.replace("BODY", singlePage);

  const {cors} = await authenticate.admin(request);
  return cors(new Response(printed, {
    status: 200,
    headers: {
      "Content-type": "text/html",
    },
  }))
}

const pageBreak = `<div class="page-break"></div>`
const pageTemplate = `<main>
<div>
  <div class="columns">
    <h1>TITLE</h1>
    <div>
      <p style="text-align: right; margin: 0;">
        Order #ORDER_ID<br>
        June 13, 2024
      </p>
    </div>
  </div>
  <div class="columns" style="margin-top: 1.5em;">
    <div class="address">
      <strong>From</strong><br>
      T-shirts and more<br>
      <p>123 Broadway<br>
        Denver CO, 80220<br>
        United States</p>
      (720)423-1234<br>
    </div>
  </div>
  <hr>
  <p>Order total: ORDER_TOTAL</p>
  <p style="margin-bottom: 0;">If you have any questions, please send an email to <u>customer@example.com</u></p>
</div>
</main>
`

const printTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body,html {
      font-size: 16px;
      line-height: normal;
      background: none;
      margin: 0;
      padding: 0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    body {
      font-size: 0.688rem;
      color: #000;
    }
    main {
      padding: 3rem 2rem;
      height: 100vh;
    }
    h1 {
      font-size: 1.25rem;
      margin: 0;
    }
    h2,h3 {
      font-size: 0.75rem;
      font-weight: bold;
    }
    h2,h3,p {
      margin: 1rem 0 0.5rem 0;
    }
    .address p {
      margin: 0;
    }
    b,strong {
      font-weight: bold;
    }
    .columns {
      display: grid;
      grid-auto-columns: minmax(0, 1fr);
      grid-auto-flow: column;
      word-break: break-word;
    }
    hr {
      clear: both;
      overflow: hidden;
      margin: 1.5em 0;
      border-top: 1px solid #000;
      border-bottom: none;
    }
    .header-row+.row {
      margin-top: 0px;
    }
    .header-row {
      display: none !important;
    }
    table,td,th {
      width: auto;
      border-spacing: 0;
      border-collapse: collapse;
      font-size: 1em;
    }
    td,th {
      border-bottom: none;
    }
    table.table-tabular,.table-tabular {
      border: 1px solid #e3e3e3;
      margin: 0 0 0 0;
      width: 100%;
      border-spacing: 0;
      border-collapse: collapse;
    }
    table.table-tabular th,
    table.table-tabular td,
    .table-tabular th,
    .table-tabular td {
      padding: 0.5em;
    }
    table.table-tabular th,.table-tabular th {
      text-align: left;
      border-bottom: 1px solid #e3e3e3;
    }
    table.table-tabular td,.table-tabular td {
      border-bottom: 1px solid #e3e3e3;
    }
    table.table-tabular tfoot td,.table-tabular tfoot td {
      border-bottom-width: 0px;
      border-top: 1px solid black;
      padding-top: 1em;
    }
    .row {
      margin: 0;
    }
    @media not print {
      .page-break {
        width: 100vw;
        height: 40px;
        background-color: lightgray;
      }
    }
    @media print {
      .page-break {
        page-break-after: always;
      }
    }
  </style>
  <title>My order printer</title>
</head>
<body>
BODY
</body>
</html>
`
