import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

/**
 * Layout — the application shell.
 *
 * Structure:
 *   ┌──────────┬──────────────────────────────┐
 *   │ Sidebar  │  Header                       │
 *   │          ├──────────────────────────────┤
 *   │          │  Main content (children)      │
 *   └──────────┴──────────────────────────────┘
 *
 * The sidebar width drives the left margin of the main area.
 * On mobile (<lg), sidebar is a drawer overlay — the main area always uses full width.
 */
const Layout = ({ children }) => {
  const { sidebarCollapsed } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />

      {/* Main area shifts right by sidebar width on desktop */}
      {/* Use inline style for margin — dynamic Tailwind class strings are not statically detectable */}
      <div
        className="flex flex-col min-h-screen transition-[margin-left] duration-300 ease-in-out max-lg:!ml-0"
        style={{ marginLeft: `${sidebarCollapsed ? 72 : 256}px` }}
      >
        <Header />

        <main
          id="main-content"
          className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto"
        >
          {children}
        </main>

        <footer className="px-6 py-3 border-t border-slate-200 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-600 transition-colors duration-200">
          PhilLeads · Philippine B2B Intelligence Platform · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default Layout;
