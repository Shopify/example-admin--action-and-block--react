import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // The authenticate.admin method returns a CORS method to automatically wrap responses so that extensions, which are hosted on extensions.shopifycdn.com, can access this route.
  const { cors } = await authenticate.admin(request);

  const productIssues = [
    { title: "Too big", description: "The product was too big." },
    { title: "Too small", description: "The product was too small." },
    {
      title: "Just right",
      description:
        "The product was just right, but the customer is still unhappy.",
    },
  ];

  // Get the product Id from the request
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  var splitStr = productId.split("/");
  var idNumber = parseInt(splitStr[splitStr.length - 1], 10);

  // Our proprietary machine learning algorithm automatically determines the best product issue :).
  const issue = productIssues[idNumber % productIssues.length];

  // Wrap the response in the CORS method so that the extension can access it
  return cors(json({ productIssue: issue }));
};
