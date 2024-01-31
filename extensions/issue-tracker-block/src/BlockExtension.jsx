import { useEffect, useMemo, useState } from "react";
// [START build-admin-block.create-ui-one]
import {
  AdminBlock,
  Box,
  Button,
  Divider,
  Form,
  Icon,
  InlineStack,
  Select,
  Text,
  reactExtension,
  useApi,
} from "@shopify/ui-extensions-react/admin";
// [END build-admin-block.create-ui-one]
import { getIssues, updateIssues } from "./utils";

// [START build-admin-block.create-ui-two]
// The target used here must match the target used in the extension's .toml file at ./shopify.extension.toml
const TARGET = "admin.product-details.block.render";
export default reactExtension(TARGET, () => <App />);
// [END build-admin-block.create-ui-two]

const PAGE_SIZE = 3;

function App() {
  const { data, i18n } = useApi(TARGET);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState([]);
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
        setInitialValues(
          parsedIssues.map(({ completed }) => Boolean(completed))
        );
        setIssues(parsedIssues);
      }
    })();
  }, []);

  // [START build-admin-block.add-change-and-delete-handlers]
  const handleChange = async (id, value) => {
    // Update the local state of the extension to reflect changes
    setIssues((currentIssues) => {
      // Create a copy of the array so that you don't mistakenly mutate the state
      const newIssues = [...currentIssues];
      // Find the index of the issue that you're interested in
      const editingIssueIndex = newIssues.findIndex(
        (listIssue) => listIssue.id == id
      );
      // Overwrite that item with the new value
      newIssues[editingIssueIndex] = {
        // Spread the previous item to retain the values that you're not changing
        ...newIssues[editingIssueIndex],
        // Update the completed value
        completed: value === "completed" ? true : false,
      };
      return newIssues;
    });
  };

  const handleDelete = async (id) => {
    // Create a new array of issues, leaving out the one that you're deleting
    const newIssues = issues.filter((issue) => issue.id !== id);
    // Save to the local state
    setIssues(newIssues);
    // Commit changes to the database
    await updateIssues(productId, newIssues);
  };
  // [END build-admin-block.add-change-and-delete-handlers]

  const onSubmit = async () => {
    // Commit changes to the database
    await updateIssues(productId, issues);
  };

  const onReset = () => {};

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
  // [START build-admin-block.create-ui-three]
  return (
    <AdminBlock
      // Translate the block title with the i18n API, which uses the strings in the locale files
      title={i18n.translate("name")}
    >
      <Form id={`issues-form`} onSubmit={onSubmit} onReset={onReset}>
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
                        <Box inlineSize="53%">
                          <Box inlineSize="100%">
                            <Text fontWeight="bold" textOverflow="ellipsis">{title}</Text>
                          </Box>

                          <Box inlineSize="100%">
                            <Text textOverflow="ellipsis">{description}</Text>
                          </Box>
                        </Box>
                        <Box inlineSize="22%">
                          <Select
                            label="Status"
                            name="status"
                            defaultValue={
                              initialValues[index] ? "completed" : "todo"
                            }
                            value={completed ? "completed" : "todo"}
                            onChange={(value) => handleChange(id, value)}
                            options={[
                              { label: "Todo", value: "todo" },
                              {
                                label: "Completed",
                                value: "completed",
                              },
                            ]}
                          />
                        </Box>
                        <Box inlineSize="25%">
                          <InlineStack inlineSize="100%" inlineAlignment="end">
                            <Button
                              onPress={() => handleDelete(id)}
                              variant="tertiary"
                            >
                              <Icon name="DeleteMinor" />
                            </Button>
                          </InlineStack>
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
      </Form>
    </AdminBlock>
  );
  // [END build-admin-block.create-ui-three]
}
