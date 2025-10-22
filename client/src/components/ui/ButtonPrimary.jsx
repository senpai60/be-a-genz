import React from 'react';

function ButtonPrimary({ handleClick,selectionStyle, children }) {
  return (
    <button 
      onClick={handleClick}
      className={`px-4 py-2 outline outline-zinc-300 rounded hover:bg-zinc-900 transition-colors ${selectionStyle?selectionStyle:""}`}
    >
      {children}
    </button>
  );
}

export default ButtonPrimary;
