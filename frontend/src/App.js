import React, { useEffect, useState } from "react";
import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Home from "./components/Home";
import ForgotPage from "./components/passwordReset/ForgotPage";
import SetNewPassword from "./components/passwordReset/SetNewPassword";
import VerifyEmail from "./components/VerifyEmail";
import ErrorMsg from "./components/ErrorMsg";
import { useCookies } from "react-cookie";

import { Routes, Route, Link } from "react-router-dom";
import HomeProtected from "./components/HomeProtected";
import LoginProtected from "./components/LoginProtected";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/userSlice";
function App() {
  const [cookie, setcookie, removecookie] = useCookies();
  const [auth, setauth] = useState(false);
  const state = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const tokenverify = async (token) => {
    const result = await axios
      .get(`${process.env.REACT_APP_API_URL}/${token}`)
      .then((res) => true)
      .catch((err) => {
        removecookie("token");
        dispatch(logout());
        return false;
      });
  };


  useEffect(() => {
    if (cookie.token) {
      tokenverify(cookie.token);
    }

  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <HomeProtected>
              <Home></Home>
            </HomeProtected>
          }
        />
        <Route
          path="/login"
          element={
            <LoginProtected>
              <Login />{" "}
            </LoginProtected>
          }
        />
        <Route
          path="/signup"
          element={
            <LoginProtected>
              <SignUp />
            </LoginProtected>
          }
        />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/reset-password/:token?" element={<SetNewPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route
          path="*"
          element={
            <>
            
              {" "}
              <ErrorMsg
                msg1="404 no page found"
                head="Page Not found"
                btnName="Click to go Home Page"
                route="/"
              />
            </>
          }
        />
      </Routes>

    </div>
  );
}

export default App;
