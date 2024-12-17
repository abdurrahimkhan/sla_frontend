"use client";
import { FormEvent, useEffect, useState } from 'react'
import FlexDiv from '../components/Common/FlexDiv';
import Loader from '../components/Common/Loader';
import { PORTAL_NAME } from '../constants/constants';
import useAuth from '../auth/useAuth'
import { useNavigate } from 'react-router-dom';
import Cookie from "js-cookie";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { status, signIn } = useAuth();
  const navigate = useNavigate();
  const session = Cookie.get("session");

  useEffect(() => {
    // Redirect if not on the login page
    if (session || status === "authenticated") {
      navigate("/dashboard");
    }
  }, [session, status, navigate]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn(email, password);

      if (res?.status === 200) {
        setLoading(false);
        navigate("/dashboard");
      } else if (res?.status === 401) {
        alert(res.error || "Invalid credentials. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
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
            <img width={312} height={160} src="/sla/images/stclogologin.png" alt="STC Logo" style={{ opacity: ".8" }} />
            <a className='font-bold' href="/">{PORTAL_NAME}</a>
          </div>
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Sign in using your STC Email to start your session</p>


              <div className="input-group mb-3">
                <input onChange={handleInputChange(setEmail)} className="form-control " type="text" id="username" name="username" required
                  placeholder="Username" />

              </div>
              <div className="input-group mb-3">
                <input onChange={handleInputChange(setPassword)} className="form-control" type="password" id="password" name="password" placeholder="Password" required />


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
