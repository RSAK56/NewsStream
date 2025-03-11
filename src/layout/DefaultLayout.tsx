import Filters from "../components/Filters";
import Header from "../components/Header";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
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
