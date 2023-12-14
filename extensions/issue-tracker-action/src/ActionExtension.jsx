import { useCallback, useState } from "react";
import {
  reactExtension,
  useApi,
  TextField,
  AdminAction,
  Button,
  TextArea,
  Box,
} from "@shopify/ui-extensions-react/admin";
// The target used here must match the target used in the extension's .toml file at ./shopify.extension.toml
const TARGET = "admin.product-details.action.render";

export default reactExtension(TARGET, () => <App />);

function App() {
  // Connect with the extension's APIs
  const { close } = useApi(TARGET);
  const [issue, setIssue] = useState({ title: "", description: "" });
  const { title, description, id } = issue;
  const isEditing = id !== undefined;

  const onSubmit = useCallback(async () => {
    console.log('submitting')
  }, []);

  return (
    // The UX is defined using components from the @shopify/ui-extensions-react/admin package
    <AdminAction
      title={isEditing ? "Edit your issue" : "Create an issue"}
      primaryAction={
        <Button onPress={onSubmit}>{isEditing ? "Save" : "Create"}</Button>
      }
      secondaryAction={<Button onPress={close}>Cancel</Button>}
    >
      <TextField
        value={title}
        onChange={(val) => setIssue((prev) => ({ ...prev, title: val }))}
        label="Title"
      />
      <Box paddingBlockStart="large">
        <TextArea
          value={description}
          onChange={(val) =>
            setIssue((prev) => ({ ...prev, description: val }))
          }
          label="Description"
        />
      </Box>
    </AdminAction>
  );
}
