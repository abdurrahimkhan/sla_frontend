import React from 'react'

export default function NavTab(
  {text, active, handleClick}
) {
  return (
    <div onClick={handleClick} className={`w-full flex justify-center cursor-pointer py-3 ${active && 'border-b-[3px] border-stc-purple'}`}>
      <span className={`${active? 'text-stc-purple': 'text-gray-400'}`}  >
        {text}
      </span>
    </div>
  )
}
