import React, { useEffect } from "react";
import { Children } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser,fetchImage } from "../redux/userSlice";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const HomeProtected = ({ children }) => {
  const dispatch = useDispatch();
  const [cookie, setcookie, removecookie] = useCookies();

  const state = useSelector((store) => store.user);



 
  // console.log(url)
  // return url
  


  useEffect(() => {
    if (cookie.token) {
      dispatch(fetchUser(cookie.token));
      dispatch(fetchImage(cookie.token));

    //  fetchimg(cookie.token)
    }
  }, []);

  if (cookie.token) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default HomeProtected;
