import { useState } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useDocumentStore } from "../../store/document-store";
import { useEditorStore } from "../../store/editor-store";
import { Button } from "../ui/button";
import { SaveDocumentDialog } from "./SaveDocumentDialog";

export function DocumentActions() {
  const { isAuthenticated } = useConvexAuth();
  const text = useEditorStore((state) => state.text);
  const {
    currentDocumentId,
    currentDocumentTitle,
    isDirty,
    toggleDocumentsPanel,
    setCurrentDocument,
    setDirty,
  } = useDocumentStore();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const createDocument = useMutation(api.documents.create);
  const updateDocument = useMutation(api.documents.update);

  const handleSave = async (title: string) => {
    if (!isAuthenticated) return;

    try {
      if (currentDocumentId) {
        await updateDocument({
          id: currentDocumentId,
          title,
          content: text,
        });
        setCurrentDocument(currentDocumentId, title);
      } else {
        const id = await createDocument({
          title,
          content: text,
        });
        setCurrentDocument(id, title);
      }
      setDirty(false);
    } catch (error) {
      console.error("Failed to save document:", error);
    }
  };

  const handleQuickSave = async () => {
    if (!isAuthenticated || !currentDocumentId) return;

    try {
      await updateDocument({
        id: currentDocumentId,
        content: text,
      });
      setDirty(false);
    } catch (error) {
      console.error("Failed to save document:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDocumentsPanel}
          className="gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <span className="hidden lg:inline">Documents</span>
        </Button>

        {currentDocumentId ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleQuickSave}
            disabled={!isDirty}
            className="gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
            <span className="hidden lg:inline">
              {isDirty ? "Save" : "Saved"}
            </span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSaveDialogOpen(true)}
            className="gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
            <span className="hidden lg:inline">Save As</span>
          </Button>
        )}
      </div>

      <SaveDocumentDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSave}
        defaultTitle={currentDocumentTitle}
        isUpdate={!!currentDocumentId}
      />
    </>
  );
}
