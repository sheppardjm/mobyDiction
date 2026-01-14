import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface DocumentsPanelProps {
  currentDocumentId: Id<"documents"> | null;
  onSelectDocument: (id: Id<"documents">) => void;
  onNewDocument: () => void;
}

export function DocumentsPanel({
  currentDocumentId,
  onSelectDocument,
  onNewDocument,
}: DocumentsPanelProps) {
  const { isAuthenticated } = useConvexAuth();
  const documents = useQuery(api.documents.list);
  const removeDocument = useMutation(api.documents.remove);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Id<"documents"> | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Sign in to save and manage documents
      </div>
    );
  }

  if (!documents) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Loading documents...
      </div>
    );
  }

  const handleDelete = async () => {
    if (documentToDelete) {
      await removeDocument({ id: documentToDelete });
      if (currentDocumentId === documentToDelete) {
        onNewDocument();
      }
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <Button onClick={onNewDocument} className="w-full gap-2" size="sm">
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Document
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {documents.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No documents yet. Create one to get started.
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentDocumentId === doc._id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => onSelectDocument(doc._id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(doc.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDocumentToDelete(doc._id);
                    setDeleteDialogOpen(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all"
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
