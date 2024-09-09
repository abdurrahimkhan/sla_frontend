import React from 'react'

export default function Container(
  {
    children,
    definedClasses
  }
) {
  return (
    <div className={`${definedClasses ? definedClasses : 'w-11/12 py-10 pl-32'}`}>
      {children}
    </div>
  )
}
