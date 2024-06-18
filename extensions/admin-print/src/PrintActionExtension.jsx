import { useEffect, useState } from "react";
// [START build-admin-print-action.create-ui-one]
import {
  reactExtension,
  useApi,
  AdminPrintAction,
  BlockStack,
  Checkbox,
  Text,
} from "@shopify/ui-extensions-react/admin";
// [END build-admin-print-action.create-ui-one]

// [START build-admin-print-action.create-ui-two]
// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = "admin.order-details.print-action.render";

export default reactExtension(TARGET, () => <App />);
// [END build-admin-print-action.create-ui-two]

function App() {
  // The useApi hook provides access to several useful APIs like i18n and data.
  const {i18n, data} = useApi(TARGET);
  // [START build-admin-print-action.set-src] 
  const [src, setSrc] = useState(null);

  const [printInvoice, setPrintInvoice] = useState(true);
  const [printPackingSlip, setPrintPackingSlip] = useState(false);

  useEffect(() => {
    const printTypes = []
    if (printInvoice) {
      printTypes.push("Invoice");
    } ;
    if (printPackingSlip) {
      printTypes.push("Packing Slip");
    };

    const params = new URLSearchParams({
      printType: printTypes.join(','),
      orderId: data.selected[0].id
    });

    const fullSrc = `/print?${params.toString()}`;
    setSrc(fullSrc);
  }, [data.selected, printInvoice, printPackingSlip]);
  // [END build-admin-print-action.set-src] 

  // [START build-admin-print-action.create-ui-three]
  return (
    <AdminPrintAction src={src}>
      <BlockStack blockGap="base">
        <Text fontWeight="bold">{i18n.translate('documents')}</Text>
        <Checkbox name="Invoice" checked={printInvoice} onChange={(value)=>{setPrintInvoice(value)}}>
          Invoice
        </Checkbox>
        <Checkbox name="Packing Slips" checked={printPackingSlip} onChange={(value)=>{setPrintPackingSlip(value)}}>
          Packing Slips
        </Checkbox>
      </BlockStack>
    </AdminPrintAction>
  );
  // [END build-admin-print-action.create-ui-three]
}