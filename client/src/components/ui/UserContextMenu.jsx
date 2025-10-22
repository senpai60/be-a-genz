import { useState, useRef, useEffect } from "react";
import useAuthCheck from "../../utils/useAuthCheck";

function UserContextMenu({ menuItems = [], navigateToMenuPage, currentPage, icon }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const isLoggedIn = useAuthCheck();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (item) => {
    if (item.pageName === "logout") {
      console.log("Handle logout here");
    } else {
      navigateToMenuPage(item.pageName);
    }
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <div onClick={() => setShowMenu((prev) => !prev)} className="cursor-pointer">
        {icon || <span>👤</span>}
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-zinc-900 text-zinc-100 shadow-lg border border-zinc-700 rounded-md z-50"
        >
          <ul>
            {isLoggedIn
              ? // 🔹 If logged in → show all items except the last one (Login)
                menuItems.slice(0, menuItems.length - 1).map((item, idx) => (
                  <li
                    key={idx}
                    className={`px-4 py-2 hover:bg-zinc-800 cursor-pointer transition-colors ${
                      currentPage === item.pageName ? "bg-zinc-800 text-green-400" : ""
                    }`}
                    onClick={() => handleMenuClick(item)}
                  >
                    {item.label}
                  </li>
                ))
              : // 🔹 If NOT logged in → show ONLY the last item (Login)
                (() => {
                  const loginItem = menuItems[menuItems.length - 1];
                  return (
                    <li
                      key="login"
                      className={`px-4 py-2 hover:bg-zinc-800 cursor-pointer transition-colors ${
                        currentPage === loginItem.pageName ? "bg-zinc-800 text-green-400" : ""
                      }`}
                      onClick={() => handleMenuClick(loginItem)}
                    >
                      {loginItem.label}
                    </li>
                  );
                })()}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserContextMenu;
