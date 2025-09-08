import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="min-h-screen">
        <TopBar />
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          <div className="flex gap-6">
            <Sidebar />

            <main className="flex-1">
              <div className="mx-auto max-w-5xl space-y-6">{children}</div>
            </main>

          </div>
        </div>
      </div>
  );
}