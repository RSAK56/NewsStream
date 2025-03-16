import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useUserStore } from "../../store/useUserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NotepadTextDashed } from "lucide-react";
import { useNewsStore } from "@/store/useNewsStore";

export const SignInModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useUserStore();
  const [error, setError] = useState("");
  const isDarkMode = useNewsStore((state) => state.isDarkMode);

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
      <div
        className={`fixed inset-0 backdrop-blur-sm ${
          isDarkMode ? "bg-black/70" : "bg-black/30"
        }`}
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={`w-full max-w-md transform overflow-hidden rounded-2xl p-8 text-left align-middle shadow-xl transition-all border
            ${
              isDarkMode
                ? "bg-gray-900 border-slate-800 shadow-purple-900/20"
                : "bg-white border-gray-200"
            }`}
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <NotepadTextDashed
              className={`sm:h-8 sm:w-8 ${
                isDarkMode ? "text-purple-400" : "text-purple-500"
              }`}
            />
            <Dialog.Title
              as="h3"
              className={`text-2xl font-semibold leading-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              NewsStream
            </Dialog.Title>
          </div>

          {error && (
            <Alert
              variant={
                error.includes("confirmation link") ? "default" : "destructive"
              }
              className={`mb-6 ${isDarkMode ? "border-slate-800" : ""}`}
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={isDarkMode ? "text-gray-200" : "text-gray-700"}
              >
                Email address
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`${
                  isDarkMode
                    ? "bg-slate-950/50 border-slate-800 placeholder:text-slate-400"
                    : "bg-white border-gray-300 placeholder:text-gray-400"
                }`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className={isDarkMode ? "text-gray-200" : "text-gray-700"}
              >
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`${
                  isDarkMode
                    ? "bg-slate-950/50 border-slate-800 placeholder:text-slate-400"
                    : "bg-white border-gray-300 placeholder:text-gray-400"
                }`}
                required
              />
            </div>

            <Button
              type="submit"
              className={`w-full ${
                isDarkMode
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setIsSignUp(!isSignUp)}
              className={`text-sm ${
                isDarkMode
                  ? "border-slate-800 bg-slate-950/50 hover:bg-slate-900/50"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Need an account? Sign up"}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SignInModal;
