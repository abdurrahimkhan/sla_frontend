import React, { useEffect } from 'react'

export default function Error() {

  useEffect(()=>{
    console.log(window.location.pathname);
  }, [])


  return (
    <div className="text-3xl font-bold dark:text-light-text">
      404 Not Found
    </div>
  )
}
