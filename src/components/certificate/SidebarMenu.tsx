import { MenuItem } from "./types/certificateTypes"

interface SidebarMenuProps {
  menuItems: MenuItem[]
  activePage: string | null
  expandedMenus: { [key: string]: boolean }
  toggleMenu: (id: string) => void
  setActivePage: (id: string) => void
}

export default function SidebarMenu({ menuItems, activePage, expandedMenus, toggleMenu, setActivePage }: SidebarMenuProps) {
  return (
    <div className="text-white w-28 flex flex-col py-6 gap-4 px-2 h-full">
      <div className="text-2xl font-bold text-center">🌟</div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() =>
                item.subItems ? toggleMenu(item.id) : setActivePage(item.id)
              }
              className={`${item.id === 'verification' ? 'px-3 py-2 left-0 hover:bg-gray-700' : 'w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-700'} ${activePage === item.id ? 'bg-gray-700 text-yellow-300' : ''}`}>
              <span className="flex items-center gap-2 text-sm">
                <span className="text-xl">{item.icon}</span> {item.label}
              </span>
            </button>
            {item.subItems && expandedMenus[item.id] && (
              <div className="ml-6 mt-1 flex flex-col gap-1">
                {item.subItems.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActivePage(sub.id)}
                    className={`text-sm text-left px-2 py-1 rounded hover:bg-gray-700 ${activePage === sub.id ? 'bg-gray-700 text-yellow-300' : 'text-white'}`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}