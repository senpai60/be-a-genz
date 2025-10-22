import React from 'react'

function SavedWordButton({children}) {
  return (
    <button className='mt-2 block cursor-pointer font-light capitalize bg-zinc-900 text-zinc-100 p-5'>
        {children}
    </button>
  )
}

export default SavedWordButton