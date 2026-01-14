import { useAuthStore } from '../../store/auth-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { AuthForm } from './AuthForm';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode } = useAuthStore();

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {authMode === 'signUp' ? 'Create Account' : 'Welcome Back'}
          </DialogTitle>
          <DialogDescription>
            {authMode === 'signUp'
              ? 'Create an account to save and manage your documents.'
              : 'Sign in to access your saved documents.'}
          </DialogDescription>
        </DialogHeader>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}
