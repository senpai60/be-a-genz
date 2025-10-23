import { FaUser } from "react-icons/fa";

import NavigationLink from "../ui/NavigationLink";
import { useState } from "react";
import UserContextMenu from "../ui/UserContextMenu";

function NavTop({
  navLinks,
  currentPage,
  navigateToLinkPage,
  navigateToMenuPage,
  menuItems
}) {
  const [globalSearchValue, setGlobalSearchValue] = useState("");

  const handleGlobalSearchValue = (updatedValue) => {
    setGlobalSearchValue(updatedValue);
  };
  return (
    <nav className="w-[80%] h-20 fixed z-50 right-0 top-0 p-4 flex justify-between items-center border-b border-b-zinc-800">
      <div className="nav-links flex items-center gap-4 text-[1.2rem] capitalize">
        {navLinks.map((linkText, linkIndex) => (
          <NavigationLink
            key={linkText}
            linkIndex={linkIndex}
            handleLinkSelection={() => navigateToLinkPage(linkText)}
            selectionStyles={linkText === currentPage ? "text-green-400" : ""}

          >
            {linkText}
          </NavigationLink>
        ))}
      </div>
      <div className="right flex items-center gap-4">
        <input
          onChange={(e) => {
            handleGlobalSearchValue(e.target.value);
          }}
          placeholder="Search any word to get genz version"
          value={globalSearchValue}
          className="outline outline-zinc-600 w-80 rounded p-1 placeholder:text-zinc-600"
          type="search"
          name="search-global"
          id=""
        />
        <button
          className={`bg-zinc-900 p-2 rounded transition-all ${
            globalSearchValue === "" ? "hidden" : ""
          }`}
        >
          Search
        </button>
        <UserContextMenu
          menuItems={menuItems}
          navigateToMenuPage={navigateToMenuPage}
          currentPage={currentPage}
          icon={<FaUser className="text-2xl text-zinc-300 hover:text-green-400" />}
        />
      </div>
    </nav>
  );
}

export default NavTop;
