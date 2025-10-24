import React, { useState, useEffect } from "react";
import LeftSection from "./components/layout/LeftSection";
import NavTop from "./components/layout/NavTop";
import UseAi from "./components/layout/UseAi";
import Auth from "./components/auth/Auth";
import RandomWordsPage from "./components/random words/RandomWordsPage";
import Loader from "./components/ui/Loader"; // <-- 1. Import Loader
import ProfilePage from "./components/profile/ProfilePage"; // <-- 2. Import ProfilePage
import { useAuth } from "./context/AuthContext"; // <-- 3. Import useAuth
import { useToast } from "./components/ui/Toast"; // <-- 4. Import useToast
import CommentGenerator from "./components/CommentGen/CommentGenerator";

function App() {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const navLinks = [
    { name: "use ai", component: <UseAi /> },
    { name: "random words", component: <RandomWordsPage /> },
    { name: "comment generator", component: <CommentGenerator/> },
    { name: "delhi", component: <div>Delhi Page</div> },
    { name: "mumbai", component: <div>Mumbai Page</div> },
    { name: "tips", component: <div>Tips Page</div> },
  ];

  const navigateToLinkPage = (pageName) => setCurrentPage(pageName);
  const navigateToMenuPage = (pageName) => setCurrentPage(pageName);

  // 5. This function now handles the actual logout
  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logged out successfully");
    } catch (err) {
      showToast("Logout failed", "error");
    }
    // Navigate back to the main page after logout
    navigateToLinkPage("use ai");
  };

  const menuItems = [
    // 6. Replaced the div with the new ProfilePage component
    {
      label: "Profile",
      pageName: "profile",
      component: <ProfilePage />,
    },
    {
      label: "Settings",
      pageName: "settings",
      component: <div>Settings Page</div>,
    },
    // 7. Replaced the div with a Loader for visual feedback during logout
    { label: "Logout", pageName: "logout", component: <Loader /> },
    {
      label: "Login/Signup",
      pageName: "login",
      component: <Auth onLoginSuccess={() => navigateToLinkPage("use ai")} />,
    },
  ];

  const [currentPage, setCurrentPage] = useState("use ai");

  // 8. This new useEffect triggers the logout when the page changes to "logout"
  useEffect(() => {
    if (currentPage === "logout") {
      handleLogout();
    }
  }, [currentPage]);

  return (
    <main className="w-full h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* LEFT SIDEBAR (hidden on small screens) */}
      <div className="hidden md:block md:w-[25%] lg:w-[20%] h-full border-r border-zinc-800">
        <LeftSection />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col h-full">
        {/* TOP NAVBAR */}
        <div className="w-full h-[10%]">
          <NavTop
            navLinks={navLinks.map((link) => link.name)}
            currentPage={currentPage}
            navigateToLinkPage={navigateToLinkPage}
            navigateToMenuPage={navigateToMenuPage}
            menuItems={menuItems}
          />
        </div>

        {/* MAIN CONTENT */}
        <section
          className="
            main 
            flex-1 
            overflow-auto 
            p-3 md:p-5 
            bg-zinc-950 
            border-t border-zinc-800 
            w-full
          "
        >
          {navLinks.find((link) => link.name === currentPage)?.component ||
            menuItems.find((item) => item.pageName === currentPage)
              ?.component || <div>Page not found</div>}
        </section>
      </div>
    </main>
  );
}

export default App;
