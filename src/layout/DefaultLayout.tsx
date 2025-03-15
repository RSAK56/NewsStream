import { useState } from "react";
import Filters from "../components/Filters";
import Header from "../components/Header";
import { useNewsStore } from "../store/useNewsStore";
import { SignInModal } from "../components/auth/SignInModal";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useNewsStore((state) => state.isDarkMode);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-700" : "bg-gray-100"
      }`}
    >
      <Header onSignInClick={() => setIsSignInOpen(true)} />
      <main className="container mx-auto px-4 py-8 flex-1 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <Filters />
          </aside>
          <div className="lg:col-span-3">{children}</div>
        </div>
      </main>
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </div>
  );
};

export default DefaultLayout;
