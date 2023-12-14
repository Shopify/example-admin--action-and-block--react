import { useCallback, useEffect, useState } from "react";
import {
  reactExtension,
  useApi,
  TextField,
  AdminAction,
  Button,
  TextArea,
  Box,
} from "@shopify/ui-extensions-react/admin";
import { getIssues, updateIssues } from "./utils";

// The target used here must match the target used in the extension's .toml file at ./shopify.extension.toml
const TARGET = "admin.product-details.action.render";

export default reactExtension(TARGET, () => <App />);

function App() {
  // Connect with the extension's APIs
  const { close, data } = useApi(TARGET);
  const [issue, setIssue] = useState({ title: "", description: "" });
  const [allIssues, setAllIssues] = useState([]);
  const [formErrors, setFormErrors] = useState(null);
  const { title, description } = issue;

  useEffect(() => {
    (async function getProductInfo() {
      // Get the currently selected or displayed product from the 'data' API
      const productData = await getIssues(data.selected[0].id);
      if (productData?.data?.product?.metafield?.value) {
        setAllIssues(JSON.parse(productData.data.product.metafield.value));
      }
    })();
  }, []);

  const generateId = () => {
    if (!allIssues.length) {
      return 0;
    }
    return allIssues[allIssues.length - 1].id + 1;
  };

  const validateForm = () => {
    setFormErrors({
      title: !title,
      description: !description,
    });
    return Boolean(title) && Boolean(description);
  };

  const onSubmit = useCallback(async () => {
    if (validateForm()) {
      // Commit changes to the database
      await updateIssues(data.selected[0].id, [
        ...allIssues,
        {
          id: generateId(),
          title,
          description,
          completed: false,
        }
      ]);
      // Close the modal using the 'close' API
      close();
    }
  }, [issue, setIssue, allIssues, title, description]);

  return (
    <AdminAction
      title="Create an issue"
      primaryAction={
        <Button onPress={onSubmit}>Create</Button>
      }
      secondaryAction={<Button onPress={close}>Cancel</Button>}
    >
      <TextField
        value={title}
        error={formErrors?.title ? "Please enter a title" : undefined}
        onChange={(val) => setIssue((prev) => ({ ...prev, title: val }))}
        label="Title"
      />
      <Box paddingBlockStart="large">
        <TextArea
          value={description}
          error={
            formErrors?.description ? "Please enter a description" : undefined
          }
          onChange={(val) =>
            setIssue((prev) => ({ ...prev, description: val }))
          }
          label="Description"
        />
      </Box>
    </AdminAction>
  );
}
