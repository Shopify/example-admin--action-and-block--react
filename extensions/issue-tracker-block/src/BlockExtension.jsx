import {
  AdminBlock,
  Box,
  Button,
  Divider,
  Icon,
  InlineStack,
  Text,
  reactExtension,
  useApi,
} from "@shopify/ui-extensions-react/admin";
import { useEffect, useMemo, useState } from "react";
import { getIssues } from "./utils";

// The target used here must match the target used in the extension's .toml file at ./shopify.extension.toml
const TARGET = "admin.product-details.block.render";

export default reactExtension(TARGET, () => <App />);

const PAGE_SIZE = 5;

function App() {
  const { data, i18n } = useApi(TARGET);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const productId = data.selected[0].id;
  const issuesCount = issues.length;
  const totalPages = issuesCount / PAGE_SIZE;

  useEffect(() => {
    (async function getProductInfo() {
      // Load the product's metafield of type issues
      const productData = await getIssues(productId);

      setLoading(false);
      if (productData?.data?.product?.metafield?.value) {
        const parsedIssues = JSON.parse(
          productData.data.product.metafield.value
        );
        setIssues(parsedIssues);
      }
    })();
  }, []);

  const paginatedIssues = useMemo(() => {
    if (issuesCount <= PAGE_SIZE) {
      // It's not necessary to paginate if there are fewer issues than the page size
      return issues;
    }

    // Slice the array after the last item of the previous page
    return [...issues].slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );
  }, [issues, currentPage]);

  if (loading) {
    return <></>;
  }

  const summary = `${issuesCount} ${issuesCount === 1 ? "issue" : "issues"}`

  return (
    <AdminBlock
      // Translate the block title with the i18n API, which uses the strings in the locale files
      title={i18n.translate("name")}
      // It's best UX practice to set an empty summary when there's no data
      summary={summary}
    >
      {issues.length ? (
        <>
          {paginatedIssues.map(
            ({ id, title, description, completed }, index) => {
              return (
                <>
                  {index > 0 && <Divider />}
                  <Box key={id} padding="base small">
                    <InlineStack
                      blockAlignment="center"
                      inlineSize="100%"
                      gap="large"
                    >
                      <Box inlineSize="78%">
                        <Box inlineSize="100%">
                          <Text fontWeight="bold">{title}</Text>
                        </Box>

                        <Box inlineSize="100%">
                          <Text>{truncate(description, 35)}</Text>
                        </Box>
                      </Box>
                      <Box inlineSize="22%">
                        {completed ? "completed" : "todo"}
                      </Box>
                    </InlineStack>
                  </Box>
                </>
              );
            }
          )}
          <InlineStack
            paddingBlockStart="large"
            blockAlignment="center"
            inlineAlignment="center"
          >
            <Button
              onPress={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronLeftMinor" />
            </Button>
            <InlineStack
              inlineSize={25}
              blockAlignment="center"
              inlineAlignment="center"
            >
              <Text>{currentPage}</Text>
            </InlineStack>
            <Button
              onPress={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages}
            >
              <Icon name="ChevronRightMinor" />
            </Button>
          </InlineStack>
        </>
      ) : (
        <>
          <Box paddingBlockEnd="large">
            <Text fontWeight="bold">No issues for this product</Text>
          </Box>
        </>
      )}
    </AdminBlock>
  );
}

/* A function to truncate long strings */
function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "…" : str;
}
