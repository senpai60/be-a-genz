import React from 'react'

// 1. Accept 'disabled' prop
function GenerateAi({ children, handleGeneration, inputSentenceValue, disabled }) {
  return (
    <button 
      onClick={() => handleGeneration(inputSentenceValue)}
      // 2. Apply 'disabled' prop to the button
      disabled={disabled}
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
        // 3. Add styling for the disabled state
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {children}
    </button>
  )
}

export default GenerateAi