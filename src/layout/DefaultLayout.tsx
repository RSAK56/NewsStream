import Filters from "../components/Filters";
import Header from "../components/Header";
import { useNewsStore } from "../store/useNewsStore";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useNewsStore((state) => state.isDarkMode);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-gray-700" : "bg-gray-100"
      }`}
    >
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <Filters />
          </aside>
          <div className="lg:col-span-3">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
