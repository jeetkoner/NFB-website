import React, { useState, useEffect, useContext } from 'react';
import Herotext from './Herotext';
import '../styles/Userlogin.css';
import { assets } from '../assets/assets';
import Notificationlevel from './Notificationlevel';
import { UserContext } from '../context/user.context';
import { Link } from 'react-router-dom';

export default function UserLogin() {
   const [captureCode, setCaptureCode] = useState('');
   const [userEnteredCaptureCode, setUserEnteredCaptureCode] = useState('');
   const { setUsername, setPassword, handleLogin, isLoggedIn } = useContext(UserContext);

   useEffect(() => {
      setCaptureCode(generateCaptureCode());
   }, []);

   const handleInputChange = (setter) => (e) => setter(e.target.value);

   const handleCaptureCode = () => setCaptureCode(generateCaptureCode());

   const handleLoginClick = async () => {
      if (!verifyCaptureCode(userEnteredCaptureCode)) {
         setCaptureCode(generateCaptureCode());
         setUserEnteredCaptureCode('');
         return;
      }

      await handleLogin();
   };

   return (
      <>

         {
            !isLoggedIn ? (
               <>
                  <Notificationlevel
                     note="To be our team member sign up or contact with website admin"
                     link="/registeruser"
                     linkText="Create Account"
                  />
                  <div className="userlogin_form_container">
                     <Herotext text="Hi fox!" />
                     <div className="userlogin_form">
                        <div className="input_fild_box">
                           <label htmlFor="username">Enter Your Username</label>
                           <input
                              type="text"
                              name="username"
                              id="username"
                              autoComplete="off"
                              placeholder="Your username"
                              onChange={handleInputChange(setUsername)}
                              required
                           />
                        </div>
                        <div className="input_fild_box">
                           <label htmlFor="password">Enter Your Password</label>
                           <input
                              type="password"
                              name="password"
                              id="password"
                              autoComplete="off"
                              placeholder="Your Password"
                              onChange={handleInputChange(setPassword)}
                              required
                           />
                           <Link to={"/forgotpassword"} className='forgotpassword_btn'>Forgot Password</Link>

                        </div>
                        <div className="capture_code">
                           <p>{captureCode}</p>
                           <button onClick={handleCaptureCode}>
                              <img src={assets.reloadicon} alt="Reload Capture Code" />
                           </button>
                        </div>
                        <div className="input_fild_box">
                           <label htmlFor="userEnteredCaptureCode">Enter Capture Code</label>
                           <input
                              type="text"
                              name="userEnteredCaptureCode"
                              id="userEnteredCaptureCode"
                              placeholder="Capture code"
                              autoComplete="off"
                              onChange={handleInputChange(setUserEnteredCaptureCode)}
                              value={userEnteredCaptureCode}
                           />
                        </div>
                        <div className="loginsubmit_btns">
                           <button onClick={handleLoginClick} className="login_form_submit_btn login">
                              Login
                           </button>
                           <button className="login_form_submit_btn cancel">
                              Cancel
                           </button>
                        </div>
                     </div>
                  </div>
               </>
            ) : (
               <div className="duv">You are Logedin so dont try to access the login page, </div>
            )
         }

      </>
   );
}

// Capture Code Utility Functions

function generateCaptureCode(length = 6) {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const result = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
   try {
      localStorage.setItem("captureCode", result);
   } catch (e) {
      console.error('Failed to store the capture code in localStorage:', e);
   }
   return result;
}

function verifyCaptureCode(inputCode) {
   let storedCode;
   try {
      storedCode = localStorage.getItem("captureCode");
      localStorage.removeItem("captureCode");
   } catch (e) {
      console.error('Failed to manage the capture code in localStorage:', e);
   }
   return inputCode === storedCode;
}

export { generateCaptureCode, verifyCaptureCode };
