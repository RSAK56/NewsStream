import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NotepadTextDashed } from "lucide-react";
import { useNewsStore } from "@/store/useNewsStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useUserStore } from "@/store/useUserStore";

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

  const { signIn, signUp, setUser } = useUserStore();

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
        const response = await signIn(email, password);
        if (response.user) {
          setUser(response.user);
          onClose();
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(
        error instanceof Error ? error.message : "Authentication failed",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${
          isDarkMode ? "bg-gray-800" : "white"
        } sm:max-w-md [&>button]:text-gray-400 [&>button]:cursor-pointer ${
          isDarkMode
            ? "[&>button]:hover:text-white"
            : "[&>button]:hover:text-gray-600"
        }`}
      >
        <DialogHeader className="flex flex-row justify-center items-center gap-2">
          <NotepadTextDashed
            className={`h-8 w-8 ${
              isDarkMode ? "text-purple-400" : "text-purple-500"
            }`}
          />
          <DialogTitle
            className={`${
              isDarkMode ? "text-white" : "text-gray-800"
            } text-2xl`}
          >
            NewsStream
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert
            variant={
              error.includes("confirmation link") ? "default" : "destructive"
            }
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              className={isDarkMode ? "text-white" : "text-gray-800"}
              htmlFor="email"
            >
              Email address
            </Label>
            <Input
              className={isDarkMode ? "text-white" : "text-gray-800"}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              className={isDarkMode ? "text-white" : "text-gray-800"}
              htmlFor="password"
            >
              Password
            </Label>
            <Input
              className={isDarkMode ? "text-white" : "text-gray-800"}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white bg-purple-400 cursor-pointer"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm cursor-pointer"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
