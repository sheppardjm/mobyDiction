import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useDocumentsStore } from '../../store/documents-store';
import { useEditorStore } from '../../store/editor-store';
import { useGrammarStore } from '../../store/grammar-store';
import { Button } from '../ui/button';
import type { Doc } from '../../../convex/_generated/dataModel';

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString(undefined, { weekday: 'long' });
  } else {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
}

interface DocumentItemProps {
  document: Doc<'documents'>;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function DocumentItem({ document, isActive, onSelect, onDelete }: DocumentItemProps) {
  return (
    <div
      className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
        isActive
          ? 'bg-primary/10 border border-primary/20'
          : 'hover:bg-accent/50 border border-transparent'
      }`}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{document.title}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(document.updatedAt)}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-destructive/10 hover:text-destructive transition-all"
        title="Delete document"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  );
}

export function DocumentList() {
  const documents = useQuery(api.documents.list);
  const deleteDocument = useMutation(api.documents.remove);
  const {
    currentDocumentId,
    setCurrentDocumentId,
    setCurrentDocumentTitle,
    isDocumentListOpen,
    closeDocumentList,
    clearDocument,
  } = useDocumentsStore();
  const setTextExternal = useEditorStore((s) => s.setTextExternal);
  const clearIssues = useGrammarStore((s) => s.clearIssues);

  const handleSelectDocument = (doc: Doc<'documents'>) => {
    setCurrentDocumentId(doc._id);
    setCurrentDocumentTitle(doc.title);
    setTextExternal(doc.content);
    clearIssues();
    closeDocumentList();
  };

  const handleDeleteDocument = async (docId: typeof currentDocumentId) => {
    if (!docId) return;
    if (currentDocumentId === docId) {
      clearDocument();
      setTextExternal('');
      clearIssues();
    }
    await deleteDocument({ documentId: docId });
  };

  const handleNewDocument = () => {
    clearDocument();
    setTextExternal('');
    clearIssues();
    closeDocumentList();
  };

  if (!isDocumentListOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
        onClick={closeDocumentList}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border/60 shadow-xl z-50 flex flex-col animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          <h2 className="text-lg font-display font-semibold">My Documents</h2>
          <button
            onClick={closeDocumentList}
            className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 border-b border-border/40">
          <Button onClick={handleNewDocument} variant="outline" className="w-full gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Document
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {documents === undefined ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-6 w-6 text-muted-foreground" viewBox="0 0 24 24">
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
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <p className="text-sm">No documents yet</p>
              <p className="text-xs mt-1">Create one to get started</p>
            </div>
          ) : (
            documents.map((doc) => (
              <DocumentItem
                key={doc._id}
                document={doc}
                isActive={currentDocumentId === doc._id}
                onSelect={() => handleSelectDocument(doc)}
                onDelete={() => handleDeleteDocument(doc._id)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
