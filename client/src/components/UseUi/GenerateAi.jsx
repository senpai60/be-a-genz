import React from 'react'

function GenerateAi({children,handleGeneration,inputSentenceValue}) {
  return (
    <button 
    onClick={()=>handleGeneration(inputSentenceValue)}
    className='w-full py-2 bg-teal-950 outline outline-zinc-300 rounded mt-4 cursor-pointer'>{children}</button>
  )
}

export default GenerateAi