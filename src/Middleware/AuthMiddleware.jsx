import React, { useEffect, useState } from 'react';
import Login from '../pages/Login';
import FlexDiv from '../components/Common/FlexDiv';
import Loader from '../components/Common/Loader';

export default function MiddlewareProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('session');
    console.log("calling MW useeffect");
    if (session) {
      setIsLoggedIn(true);
      setLoading(false)
    } else {
      setLoading(false);
    }
  }, [])  

  if (loading) {
    return (
      <FlexDiv classes='w-full h-screen'>
          <Loader />
      </FlexDiv>
    )
  }


  if (!isLoggedIn) {
    console.log("calleding MW if");
    return <Login />
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}