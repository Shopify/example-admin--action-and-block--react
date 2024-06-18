import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  // [START build-admin-print-action.print-src-four-a]
  const { cors, admin } = await authenticate.admin(request);
  // [END build-admin-print-action.print-src-four-a]
  const url = new URL(request.url);
  const query = url.searchParams;
  const docs = query.get("printType").split(",");
  const orderId = query.get("orderId");
  const orderDetails = await admin
    .graphql(
      `query getOrder($orderId: ID!) {
      order(id: $orderId) {
        name,
        createdAt,
        totalPriceSet {
          shopMoney {
            amount
          }
        }
      }
    }`,
      {
        variables: {
          orderId: orderId,
        },
      }
    )
    .json();

  const order = orderDetails.data.order;
  const pages = docs.map((x) => orderPage(x, order));
  const print = printHTML(pages);
  // [START build-admin-print-action.print-src-four-b]
  return cors(
    new Response(print, {
      status: 200,
      headers: {
        "Content-type": "text/html",
      },
    })
  );
  // [END build-admin-print-action.print-src-four-b]
}

function orderPage(docType, order) {
  const price = order.totalPriceSet.shopMoney.amount;
  const name = order.name;
  const createdAt = order.createdAt.split("T")[0];
  // [START build-admin-print-action.email-obfuscation]
  const email = "<!--email_off-->customerhelp@example.com<!--/email_off-->"
  // [END build-admin-print-action.email-obfuscation]
  const orderTemplate = `<main>
      <div>
        <div class="columns">
          <h1>${docType}</h1>
          <div>
            <p style="text-align: right; margin: 0;">
              Order ${name}<br>
              ${createdAt}
            </p>
          </div>
        </div>
        <div class="columns" style="margin-top: 1.5em;">
          <div class="address">
            <strong>From</strong><br>
            Top Quality Copper Ingots<br>
            <p>123 Broadway<br>
              Denver CO, 80220<br>
              United States</p>
            (123) 456-7891<br>
          </div>
        </div>
        <hr>
        <p>Order total: ${price}</p>
        <p style="margin-bottom: 0;">If you have any questions, please send an email to ${email}</p>
      </div>
    </main>`;
  return orderTemplate;
}

// [START build-admin-print-action.print-src-three]
const title = `<title>My order printer</title>`;
// [END build-admin-print-action.print-src-three]

function printHTML(pages) {
  // [START build-admin-print-action.print-src-two]
  const pageBreak = `<div class="page-break"></div>`;
  const pageBreakStyles = `
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
      }`;
  // [END build-admin-print-action.print-src-two]

  const joinedPages = pages.join(pageBreak);
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
        font-size: 2.5rem;
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
      ${pageBreakStyles}
    </style>
    ${title}
  </head>
  <body>
    ${joinedPages}
  </body>
  </html>
  `;
  return printTemplate;
}
