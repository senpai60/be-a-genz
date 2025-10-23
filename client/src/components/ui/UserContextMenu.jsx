import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../utils/authApi";

function UserContextMenu({
  menuItems = [],
  navigateToMenuPage,
  currentPage,
  icon,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = async (item) => {
  if (item.pageName === "logout") {
    try {
      // Call backend to clear cookie
      await authApi.post("/logout");

      // Update frontend auth state
      logout();

      // Optionally navigate to a safe page
      navigateToMenuPage("login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  } else {
    navigateToMenuPage(item.pageName);
  }
  setShowMenu(false);
};


 

  return (
    <div className="relative z-10">
      <div
        onClick={() => setShowMenu((prev) => !prev)}
        className="cursor-pointer"
      >
        {icon || <span>👤</span>}
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-zinc-900 text-zinc-100 shadow-lg border border-zinc-700 rounded-md z-50"
        >
          <ul>
            {isLoggedIn
              ? // 🟢 Show all except login
                menuItems
                  .filter((item) => item.pageName !== "login")
                  .map((item, idx) => (
                    <li
                      key={idx}
                      className={`px-4 py-2 hover:bg-zinc-800 cursor-pointer transition-colors ${
                        currentPage === item.pageName
                          ? "bg-zinc-800 text-green-400"
                          : ""
                      }`}
                      onClick={() => handleMenuClick(item)}
                    >
                      {item.label}
                    </li>
                  ))
              : // 🔴 Only show login item if it exists
                (() => {
                  const loginItem = menuItems.find(
                    (item) => item.pageName === "login"
                  );
                  if (!loginItem)
                    return (
                      <li className="px-4 py-2 text-zinc-400">
                        No login option
                      </li>
                    );
                  return (
                    <li
                      key="login"
                      className={`px-4 py-2 hover:bg-zinc-800 cursor-pointer transition-colors ${
                        currentPage === loginItem.pageName
                          ? "bg-zinc-800 text-green-400"
                          : ""
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
