import React, { useEffect, useState } from 'react';
import Login from '../pages/Login';
import FlexDiv from '../components/Common/FlexDiv';
import Loader from '../components/Common/Loader';



export default function MiddlewareProvider({ children }) {
  const session = localStorage.getItem('session');
  const isLoggedIn = session;
  console.log(isLoggedIn);

  if (!isLoggedIn) {
    return <Login />
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}