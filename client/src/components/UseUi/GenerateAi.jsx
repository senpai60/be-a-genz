import React from 'react'

function GenerateAi({ children, handleGeneration, inputSentenceValue }) {
  return (
    <button 
      onClick={() => handleGeneration(inputSentenceValue)}
      className="
        w-full 
        py-2 sm:py-3 
        bg-teal-950 
        outline outline-zinc-300 
        rounded 
        mt-4 
        cursor-pointer 
        text-sm sm:text-base md:text-lg 
        hover:bg-teal-900 
        transition-all 
        active:scale-[0.97]
      "
    >
      {children}
    </button>
  )
}

export default GenerateAi
