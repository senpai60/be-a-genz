import { FaUser, FaBars } from "react-icons/fa";
import NavigationLink from "../ui/NavigationLink";
import { useState } from "react";
import UserContextMenu from "../ui/UserContextMenu";

function NavTop({
  navLinks,
  currentPage,
  navigateToLinkPage,
  navigateToMenuPage,
  menuItems,
}) {
  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGlobalSearchValue = (updatedValue) => {
    setGlobalSearchValue(updatedValue);
  };

  return (
    <nav className="w-full md:w-[75%] lg:w-[80%] h-16 md:h-20 bg-zinc-950 fixed z-50 right-0 top-0 px-4 md:px-6 flex justify-between items-center border-b border-b-zinc-800">
      {/* LEFT SIDE - NAV LINKS */}
      <div className="flex items-center gap-4">
        {/* Hamburger for small screens */}
        <button
          className="md:hidden text-zinc-300 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>

        {/* Nav links for md+ screens */}
        <div className="hidden md:flex items-center gap-4 text-base md:text-lg capitalize">
          {navLinks.map((linkText, linkIndex) => (
            <NavigationLink
              key={linkText}
              linkIndex={linkIndex}
              handleLinkSelection={() => navigateToLinkPage(linkText)}
              selectionStyles={
                linkText === currentPage ? "text-green-400" : ""
              }
            >
              {linkText}
            </NavigationLink>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - SEARCH + USER */}
      <div className="flex items-center gap-3 md:gap-4">
        <input
          onChange={(e) => handleGlobalSearchValue(e.target.value)}
          placeholder="Search word..."
          value={globalSearchValue}
          className="outline outline-zinc-600 w-36 sm:w-52 md:w-64 lg:w-80 rounded px-2 py-1 text-sm md:text-base placeholder:text-zinc-600 bg-zinc-900"
          type="search"
          name="search-global"
        />
        {globalSearchValue && (
          <button className="bg-zinc-900 text-sm md:text-base px-2 py-1 rounded hover:bg-zinc-800 transition">
            Search
          </button>
        )}
        <UserContextMenu
          menuItems={menuItems}
          navigateToMenuPage={navigateToMenuPage}
          currentPage={currentPage}
          icon={
            <FaUser className="text-xl md:text-2xl text-zinc-300 hover:text-green-400 transition" />
          }
        />
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-zinc-950 border-t border-zinc-800 flex flex-col items-start p-4 gap-3 md:hidden">
          {navLinks.map((linkText, linkIndex) => (
            <button
              key={linkText}
              onClick={() => {
                navigateToLinkPage(linkText);
                setMenuOpen(false);
              }}
              className={`text-lg capitalize ${
                linkText === currentPage ? "text-green-400" : "text-zinc-300"
              }`}
            >
              {linkText}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

export default NavTop;
