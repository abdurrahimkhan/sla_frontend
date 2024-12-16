import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from 'axios';
import { BASE_URL } from '../constants/constants';

const useAuth = () => {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching session from local storage or an API
    const storedSession = Cookies.get('session');
    if (storedSession) {
      setSession(JSON.parse(storedSession));
      setStatus('authenticated');
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  const signIn = async (email, password) => {
    console.log(email);
    console.log(password);
    const res = await axios.post(`${BASE_URL}/auth/login`, { "email": email })
    const userData = res.data;

    if (userData.status == 200 && userData.message == 'success') {
      const privileges = await axios.get(`${BASE_URL}/user-permissions/get-permissions-by-user-id?userID=${userData.data.user.id}`, {
        headers: {
          'Authorization': `Bearer ${userData.data.access_token}`, // Example header
          'Content-Type': 'application/json',     // Another example
        }
      });

      const sessionData = { user: userData.data.user, Authorization: `${userData.data.access_token}`, privileges: privileges.data };

      Cookies.set("session", JSON.stringify(sessionData), {
        expires: 1/24,
        secure: true,
        sameStie: "strict"
      })
      console.log(sessionData);

      setSession(sessionData);
      setStatus('authenticated');
      return { status: 200 };
    } else {
      return { status: 401, error: userData.message };
    }

  };

  const signOut = () => {
    Cookies.remove("session", { secure: true, sameSite: "strict" });
    setSession(null);
    setStatus('unauthenticated');
    console.log("done logging out");
    navigate('/');
  };

  return { session, status, signIn, signOut };
};

export default useAuth;
