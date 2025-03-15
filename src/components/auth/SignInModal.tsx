import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "../ui/button";
import { useUserStore } from "../../store/useUserStore";

export const SignInModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { signIn, signUp } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        await signUp(email, password);
        setError(
          "Please check your email for a confirmation link to complete your registration.",
        );
        setEmail("");
        setPassword("");
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(
        error instanceof Error ? error.message : "Authentication failed",
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Dialog.Title>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</Button>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Need an account? Sign up"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
