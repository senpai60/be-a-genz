import React from 'react';

function NavigationLink({ children, handleLinkSelection, selectionStyles }) {
  return (
    <a
      className={`${selectionStyles ? selectionStyles : "text-zinc-300"} transition-all hover:text-green-400 cursor-pointer`}
      onClick={handleLinkSelection}
    >
      {children}
    </a>
  );
}

export default NavigationLink;
