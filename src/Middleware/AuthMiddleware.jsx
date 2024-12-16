import React, { useEffect, useState } from 'react';
import Login from '../pages/Login';
import FlexDiv from '../components/Common/FlexDiv';
import Loader from '../components/Common/Loader';
import Cookie from "js-cookie";


export default function MiddlewareProvider({ children }) {
  const session = Cookie.get("session");
  console.log(session);

  if (!session) {
    return <Login />
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}