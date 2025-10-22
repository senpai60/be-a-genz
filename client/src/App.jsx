import React, { useState } from "react";
import LeftSection from "./components/layout/LeftSection";
import NavTop from "./components/layout/NavTop";
import UseAi from "./components/layout/UseAi";
import Auth from "./components/auth/Auth";

function App() {
  const navLinks = [
    { name: "use ai", component: <UseAi /> },
    { name: "random words", component: <div>Random Words Page</div> },
    { name: "category", component: <div>Category Page</div> },
    { name: "delhi", component: <div>Delhi Page</div> },
    { name: "mumbai", component: <div>Mumbai Page</div> },
    { name: "tips", component: <div>Tips Page</div> },
  ];

  const menuItems = [
  { label: "Profile", pageName: "profile", component: <div>Profile Page</div> },
  { label: "Settings", pageName: "settings", component: <div>Settings Page</div> },
  { label: "Logout", pageName: "logout", component: <div>Logged Out</div> },
  { label: "Login/Signup", pageName: "login", component: <Auth /> }, // 👈 FIXED: not "logout"
];


  const [currentPage, setCurrentPage] = useState("use ai");

  const navigateToLinkPage = (pageName) => {
    setCurrentPage(pageName);
  };

  const navigateToMenuPage = (pageName) => {
    setCurrentPage(pageName);
  };

  return (
    <main className="w-full h-screen bg-zinc-950 text-zinc-100">
      <LeftSection />
      <NavTop
        navLinks={navLinks.map(link => link.name)}
        currentPage={currentPage}
        navigateToLinkPage={navigateToLinkPage}
        navigateToMenuPage={navigateToMenuPage}
        menuItems={menuItems}
        
      />
      <section className="main fixed right-0 w-[80%] bottom-0 h-[90%] p-4 overflow-auto">
        {
          navLinks.find(link => link.name === currentPage)?.component ||
          menuItems.find(item => item.pageName === currentPage)?.component ||
          <div>Page not found</div>
        }
      </section>
    </main>
  );
}

export default App;
