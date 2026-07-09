import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  TableProperties,
  Map,
  BarChart3,
  Bell,
  FileDown,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    description: 'Analytics & insights',
  },
  {
    to: '/search',
    icon: Search,
    label: 'Lead Search',
    description: 'Discover new leads',
  },
  {
    to: '/leads',
    icon: TableProperties,
    label: 'Lead Table',
    description: 'Browse all companies',
  },
  {
    to: '/map',
    icon: Map,
    label: 'Company Map',
    description: 'Geographic view',
  },
  {
    to: '/enrichment',
    icon: BarChart3,
    label: 'Enrichment',
    description: 'Data completeness',
  },
  {
    to: '/feed',
    icon: Bell,
    label: 'New Leads',
    description: 'Recent additions',
  },
  {
    to: '/export',
    icon: FileDown,
    label: 'Export',
    description: 'CSV & PDF reports',
  },
];

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, closeMobileSidebar } = useTheme();
  const location = useLocation();

  const currentPage = NAV_ITEMS.find((item) =>
    location.pathname.startsWith(item.to)
  );

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full flex flex-col
          bg-slate-900 border-r border-slate-800
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shrink-0">
              <Zap size={18} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <span className="text-white font-bold text-lg leading-tight tracking-tight block truncate">
                  PhilLeads
                </span>
                <span className="text-slate-400 text-xs leading-none">
                  B2B Intelligence
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1" role="list">
            {NAV_ITEMS.map(({ to, icon: Icon, label, description }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `
                    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-150 ease-in-out cursor-pointer
                    ${sidebarCollapsed ? 'justify-center' : ''}
                    ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                    }
                  `}
                  aria-label={sidebarCollapsed ? label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-400 rounded-r-full" />
                      )}

                      <Icon
                        size={20}
                        className={`shrink-0 transition-colors ${
                          isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />

                      {!sidebarCollapsed && (
                        <div className="min-w-0 flex-1">
                          <span
                            className={`block text-sm font-semibold truncate ${
                              isActive ? 'text-blue-300' : 'text-slate-300'
                            }`}
                          >
                            {label}
                          </span>
                          <span className="block text-xs text-slate-500 group-hover:text-slate-400 truncate leading-tight mt-0.5">
                            {description}
                          </span>
                        </div>
                      )}

                      {/* Tooltip on collapsed state */}
                      {sidebarCollapsed && (
                        <div className="
                          pointer-events-none absolute left-full ml-3 z-50
                          bg-slate-800 border border-slate-700 text-white text-sm
                          px-3 py-1.5 rounded-lg shadow-xl
                          opacity-0 group-hover:opacity-100
                          translate-x-0 group-hover:translate-x-1
                          transition-all duration-150
                          whitespace-nowrap
                        ">
                          {label}
                          <div className="text-slate-400 text-xs mt-0.5">{description}</div>
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar collapse toggle (desktop only) */}
        <div className="hidden lg:flex items-center justify-end p-3 border-t border-slate-800 shrink-0">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-8 h-8 rounded-lg
              text-slate-500 hover:text-slate-200 hover:bg-slate-800
              transition-all duration-150"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Version tag */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-t border-slate-800 shrink-0">
            <p className="text-xs text-slate-500">PhilLeads v1.0 · PH B2B</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
