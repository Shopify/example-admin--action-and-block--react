// [START conditional-action-extension.module]
import { shouldRender } from "@shopify/ui-extensions/admin";
import { getProductVariants } from "./utils";

const TARGET = "admin.product-details.action.render";

export default shouldRender(TARGET, ({ data }) => {
  const hasMultipleVariants = getProductVariants(data).then(
    (variants) => variants.length > 1
  );

  return { display: hasMultipleVariants };
});
// [END conditional-action-extension.module]
