// [START conditional-action-extension.module]
import { getProductVariants } from "../utils";

// [START conditional-action-extension.target]
const TARGET = "admin.product-details.action.should-render";
// [END conditional-action-extension.target]

export default shopify.extension(TARGET, ({ data }) => {
  // [START conditional-action-extension.display]
  const shouldDisplay = getProductVariants(data).then(
    (variants) => variants.length > 1
  );

  return { display: shouldDisplay };
  // [END conditional-action-extension.display]
});
// [END conditional-action-extension.module]
