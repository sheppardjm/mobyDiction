import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SaveDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string) => void;
  defaultTitle?: string;
  isUpdate?: boolean;
}

export function SaveDocumentDialog({
  open,
  onOpenChange,
  onSave,
  defaultTitle = "",
  isUpdate = false,
}: SaveDocumentDialogProps) {
  const [title, setTitle] = useState(defaultTitle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
      setTitle("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Update Document" : "Save Document"}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? "Update the title for your document"
              : "Give your document a title to save it"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="My Document"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{isUpdate ? "Update" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
