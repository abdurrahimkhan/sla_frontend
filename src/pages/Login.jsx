"use client";
import { FormEvent, useEffect, useState } from 'react'
import FlexDiv from '../components/Common/FlexDiv';
import Loader from '../components/Common/Loader';
import { PORTAL_NAME } from '../constants/constants';
import useAuth from '../Auth/useAuth'
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, status, signIn } = useAuth();
  const navigate = useNavigate();



  const handleUsernameChange = (e) => {
    setEmail(e.target.value);
  }

  useEffect(() => {

    if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status])


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Successful login, trigger NextAuth.js signIn
      const res = await signIn(email, password);
      console.log('login response');
      console.log(res);

      if (res?.status === 200) {
        console.log("done login, sending to home page");
        navigate(`/dashboard#Home`);
      }

      if (res?.status === 401) {

        alert(res.error)
        setLoading(false);
      }


    } catch (error) {
      console.log(error);
      alert("Invalid Credentials. Please try again.")
      setLoading(false);
    }

  }

  if (loading) {
    return (
      <FlexDiv classes='w-screen h-screen'>
        <Loader />
      </FlexDiv>
    )
  }


  return (
    <main>

      <div className="hold-transition login-page">
        <div className="login-box ">
          <div className="login-logo flex flex-col gap-y-4 items-center">
            <img width={312} height={160} src="/images/stclogologin.png" alt="STC Logo" style={{ opacity: ".8" }} />
            <a className='font-bold' href="/">{PORTAL_NAME}</a>
          </div>
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Sign in using your STC Email to start your session</p>


              <div className="input-group mb-3">
                <input onChange={handleUsernameChange} className="form-control " type="text" id="username" name="username" required
                  placeholder="Username" />

              </div>
              <div className="input-group mb-3">
                <input onChange={handlePasswordChange} className="form-control" type="password" id="password" name="password" placeholder="Password" required />


              </div>

              <div className="d-flex justify-content-center" >
                <button onClick={onFormSubmit} type="button" className="btn btn-primary w-full btn-block bg-purple border-0">Sign In</button>
              </div>

            </div>
          </div>
        </div>
        <strong>Copyright &copy; 2020 <a href="https://stc.com.sa">STC</a></strong> Manage Services Transport Back Office Team
      </div>
    </main>
  )
}
