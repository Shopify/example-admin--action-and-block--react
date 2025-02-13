// [START conditional-action-extension.module]
import { getProductVariants } from "../utils";

// [START conditional-action-extension.target]
const TARGET = "admin.product-details.action.should-render";
// [END conditional-action-extension.target]

// [START conditional-action-extension.register]
export default shopify.extend(TARGET, async ({ data }) => {
// [END conditional-action-extension.register]
  // [START conditional-action-extension.display]
  const variants = await getProductVariants(data);
  const shouldDisplay = variants.length > 1

  return { display: shouldDisplay };
  // [END conditional-action-extension.display]
});
// [END conditional-action-extension.module]
