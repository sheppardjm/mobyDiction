import { useState } from 'react';
import { useMutation } from 'convex/react';
import { useConvexAuth } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useDocumentsStore } from '../../store/documents-store';
import { useEditorStore } from '../../store/editor-store';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function SaveDocumentButton() {
  const { isAuthenticated } = useConvexAuth();
  const text = useEditorStore((s) => s.text);
  const {
    currentDocumentId,
    currentDocumentTitle,
    setCurrentDocumentId,
    setCurrentDocumentTitle,
    isSaving,
    setIsSaving,
    setLastSaved,
  } = useDocumentsStore();

  const createDocument = useMutation(api.documents.create);
  const updateDocument = useMutation(api.documents.update);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  if (!isAuthenticated) return null;

  const handleSaveClick = () => {
    if (currentDocumentId) {
      // Update existing document
      handleSave(currentDocumentTitle);
    } else {
      // New document - show title dialog
      setTitleInput(currentDocumentTitle === 'Untitled' ? '' : currentDocumentTitle);
      setIsDialogOpen(true);
    }
  };

  const handleSave = async (title: string) => {
    setIsSaving(true);
    try {
      if (currentDocumentId) {
        await updateDocument({
          documentId: currentDocumentId,
          content: text,
          title,
        });
      } else {
        const newId = await createDocument({
          title: title || 'Untitled',
          content: text,
        });
        setCurrentDocumentId(newId);
        setCurrentDocumentTitle(title || 'Untitled');
      }
      setLastSaved(new Date());
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(titleInput.trim() || 'Untitled');
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSaveClick}
        disabled={isSaving || !text.trim()}
        className="gap-2"
      >
        {isSaving ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
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
        )}
        <span className="hidden lg:inline">{currentDocumentId ? 'Save' : 'Save As'}</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Document</DialogTitle>
            <DialogDescription>
              Give your document a name to save it.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDialogSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Enter a title..."
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
