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

function generateId (allIssues) {
  return !allIssues?.length ? 0 : allIssues[allIssues.length - 1].id + 1;
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

// The target used here must match the target used in the extension's .toml file at ./shopify.extension.toml
const TARGET = "admin.product-details.action.render";

export default reactExtension(TARGET, () => <App />);

function App() {
  // [START connect-action-block.intent-one]
  const { close, data, intents } = useApi(TARGET);
  const issueId = intents?.launchUrl
    ? new URL(intents?.launchUrl)?.searchParams?.get("issueId")
    : null;
  const [loading, setLoading] = useState(issueId ? true : false);
  // [END connect-action-block.intent-one]
  const [issue, setIssue] = useState({ title: "", description: "" });
  const [allIssues, setAllIssues] = useState([]);
  const [formErrors, setFormErrors] = useState(null);
  const { title, description, id } = issue;
  const isEditing = id !== undefined;

  useEffect(() => {
    getIssues(data.selected[0].id).then((issues) => {
      setLoading(false);
      setAllIssues(issues || []);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(async () => {
    const {isValid, errors} = validateForm(issue);
    setFormErrors(errors);

    if (isValid) {
      const newIssues = [...allIssues];
      // [START connect-action-block.intent-two]
      if (isEditing) {
        // Find the index of the issue that you're editing
        const editingIssueIndex = newIssues.findIndex(
          (listIssue) => listIssue.id == issue.id
        );
        // Overwrite that issue's title and description with the new ones
        newIssues[editingIssueIndex] = {
          ...issue,
          title,
          description,
        };
      } else {
        // Add a new issue at the end of the list
        newIssues.push({
          id: generateId(),
          title,
          description,
          completed: false,
        });
      }
      // Commit changes to the database
      await updateIssues(data.selected[0].id, newIssues);
      // Close the modal using the 'close' API
      close();
      // [END connect-action-block.intent-two]
    }
  }, [issue, allIssues, isEditing, data.selected, close, title, description]);

  useEffect(() => {
    if (issueId) {
      // If opened from the block extension, you find the issue that's being edited
      const editingIssue = allIssues.find(({ id }) => `${id}` === issueId);
      if (editingIssue) {
        // Set the issue's ID in the state
        setIssue(editingIssue);
      }
    }
  }, [issueId, allIssues]);

  if (loading) {
    return <></>;
  }

  return (
    <AdminAction
      title={isEditing ? "Edit your issue" : "Create an issue"}
      primaryAction={
        <Button onPress={onSubmit}>{isEditing ? "Save" : "Create"}</Button>
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
}
