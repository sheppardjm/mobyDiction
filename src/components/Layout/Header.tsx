import { useConvexAuth } from 'convex/react';
import { useGrammarStore } from '../../store/grammar-store';
import { useDocumentImport } from '../../hooks/useDocumentImport';
import { useAuthStore } from '../../store/auth-store';
import { useDocumentsStore } from '../../store/documents-store';
import { Button } from '../ui/button';
import { UserMenu } from '../Auth';
import { SaveDocumentButton } from '../Documents';
import { useRef, useMemo } from 'react';

export function Header() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const isChecking = useGrammarStore((state) => state.isChecking);
  const issues = useGrammarStore((state) => state.issues);
  const activeIssues = useMemo(() => issues.filter((issue) => issue.status === 'pending'), [issues]);
  const { importFile, importFromClipboard, exportText } = useDocumentImport();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const { toggleDocumentList, lastSaved } = useDocumentsStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importFile(file).catch((error) => {
        alert(error.message);
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handlePaste = () => {
    importFromClipboard().catch((error) => {
      alert(error.message);
    });
  };

  const handleCopy = () => {
    exportText().then(() => {
      alert('Text copied to clipboard!');
    }).catch((error) => {
      alert(error.message);
    });
  };

  return (
    <header className="relative border-b border-border/50 bg-gradient-to-r from-background via-background to-background/95">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="flex items-center justify-between px-8 py-5">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          {/* Decorative mark */}
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-primary/5 border border-primary/10">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground">
              Grammar Checker
            </h1>
            <p className="text-sm text-muted-foreground font-body mt-0.5">
              <span className="opacity-60">Powered by</span>{' '}
              <span className="font-medium">LanguageTool</span>
              <span className="mx-1.5 opacity-40">&</span>
              <span className="italic font-display">The Copy Editor's Handbook</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          {isChecking && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-gentle" />
              <span className="text-sm text-primary font-medium">Analyzing...</span>
            </div>
          )}

          {!isChecking && activeIssues.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-sm text-destructive font-medium">
                {activeIssues.length} {activeIssues.length === 1 ? 'issue' : 'issues'}
              </span>
            </div>
          )}

          {!isChecking && activeIssues.length === 0 && issues.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20">
              <svg className="w-4 h-4 text-[hsl(var(--success))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-[hsl(var(--success))] font-medium">All clear</span>
            </div>
          )}

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent" />

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleImportClick} className="gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="hidden lg:inline">Import</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={handlePaste} className="gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              <span className="hidden lg:inline">Paste</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
              </svg>
              <span className="hidden lg:inline">Copy</span>
            </Button>
          </div>

          {/* Divider before auth */}
          <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent" />

          {/* Document & Auth Controls */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <Button variant="ghost" size="sm" onClick={toggleDocumentList} className="gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="hidden lg:inline">Documents</span>
                </Button>
                <SaveDocumentButton />
                {lastSaved && (
                  <span className="text-xs text-muted-foreground hidden xl:inline">
                    Saved {lastSaved.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </span>
                )}
              </>
            )}

            {!isAuthLoading && !isAuthenticated && (
              <>
                <Button variant="ghost" size="sm" onClick={() => openAuthModal('signIn')}>
                  Sign In
                </Button>
                <Button variant="default" size="sm" onClick={() => openAuthModal('signUp')}>
                  Sign Up
                </Button>
              </>
            )}

            {isAuthenticated && <UserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
}
