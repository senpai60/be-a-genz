import React, { useState } from 'react';
import LeftSection from './components/layout/LeftSection';
import NavTop from './components/layout/NavTop';
import UseAi from './components/layout/UseAi';

function App() {
  const navLinks = [
    { name: "use ai", component: <UseAi /> },
    { name: "random words", component: <div>Random Words Page</div> },
    { name: "category", component: <div>Category Page</div> },
    { name: "delhi", component: <div>Delhi Page</div> },
    { name: "mumbai", component: <div>Mumbai Page</div> },
    { name: "tips", component: <div>Tips Page</div> },
  ];

  const [currentPage, setCurrentPage] = useState('use ai');

  const navigateToLinkPage = (currentPageName) => {
    setCurrentPage(currentPageName);
  };

  return (
    <main className='w-full h-screen bg-zinc-950 text-zinc-100'>
      <LeftSection />
      <NavTop 
        navLinks={navLinks.map(link => link.name)} 
        currentPage={currentPage}
        navigateToLinkPage={navigateToLinkPage} 
      />
      <section className="main fixed right-0 w-[80%] bottom-0 h-[90%]">
        {navLinks.find(link => link.name === currentPage)?.component}
      </section>
    </main>
  );
}

export default App;
