import React, { useState } from "react";
import LeftSection from "./components/layout/LeftSection";
import NavTop from "./components/layout/NavTop";
import UseAi from "./components/layout/UseAi";
import Auth from "./components/auth/Auth";
import RandomWordsPage from "./components/random words/RandomWordsPage";

function App() {
  const navLinks = [
    { name: "use ai", component: <UseAi /> },
    { name: "random words", component: <RandomWordsPage /> },
    { name: "category", component: <div>Category Page</div> },
    { name: "delhi", component: <div>Delhi Page</div> },
    { name: "mumbai", component: <div>Mumbai Page</div> },
    { name: "tips", component: <div>Tips Page</div> },
  ];

  const menuItems = [
    { label: "Profile", pageName: "profile", component: <div>Profile Page</div> },
    { label: "Settings", pageName: "settings", component: <div>Settings Page</div> },
    { label: "Logout", pageName: "logout", component: <div>Logged Out</div> },
    { label: "Login/Signup", pageName: "login", component: <Auth onLoginSuccess={() => navigateToLinkPage("use ai")} /> },
  ];

  const [currentPage, setCurrentPage] = useState("use ai");

  const navigateToLinkPage = (pageName) => setCurrentPage(pageName);
  const navigateToMenuPage = (pageName) => setCurrentPage(pageName);

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
            menuItems.find((item) => item.pageName === currentPage)?.component || (
              <div>Page not found</div>
            )}
        </section>
      </div>
    </main>
  );
}

export default App;
