import { useCallback, useEffect, useState } from "react";
// [START build-admin-action.create-ui.one]
import {
  reactExtension,
  useApi,
  TextField,
  AdminAction,
  Button,
  TextArea,
  Box,
} from "@shopify/ui-extensions-react/admin";
// [END build-admin-action.create-ui.one]
import { getIssues, updateIssues } from "./utils";

async function getProductInfo(id) {
  // Get the currently selected or displayed product from the 'data' API
  const productData = await getIssues(id);
  if (productData?.data?.product?.metafield?.value) {
    return JSON.parse(productData.data.product.metafield.value);
  }
};

function generateId (allIssues) {
  if (!allIssues.length) {
    return 0;
  }
  return allIssues[allIssues.length - 1].id + 1;
};

function validateForm ({title, description}) {
  return {
    isValid: Boolean(title) && Boolean(description),
    errors: {
      title: !title,
      description: !description,
    },
  };
};

// [START build-admin-action.create-ui.two]
// The target used here must match the target used in the extension's .toml file at ./shopify.extension.toml
const TARGET = "admin.product-details.action.render";

export default reactExtension(TARGET, () => <App />);
// [END build-admin-action.create-ui.two]
function App() {
  //connect with the extension's APIs
  const { close, data } = useApi(TARGET);
  const [issue, setIssue] = useState({ title: "", description: "" });
  const [allIssues, setAllIssues] = useState([]);
  const [formErrors, setFormErrors] = useState(null);
  const { title, description } = issue;
  useEffect(() => {
    getProductInfo(data.selected[0].id).then(setAllIssues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(async () => {
    const {isValid, errors} = validateForm(issue);
    setFormErrors(errors);

    if (isValid) {
      // Commit changes to the database
      await updateIssues(data.selected[0].id, [
        ...allIssues,
        {
          id: generateId(),
          completed: false,
          ...issue,
        }
      ]);
      // Close the modal using the 'close' API
      close();
    }
  }, [issue, data.selected, allIssues, close]);
  // [START build-admin-action.create-ui.three]
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
        maxLength={50}
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
          maxLength={300}
        />
      </Box>
    </AdminAction>
  );
  // [END build-admin-action.create-ui.three]
}
