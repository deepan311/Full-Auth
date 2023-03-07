import React ,{useEffect}from "react";
import { Children } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/userSlice";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";


const LoginProtected = ({children}) => {
  const dispatch = useDispatch();
  const [cookie, setcookie, removecookie] = useCookies();

  const state = useSelector((store) => store.user);

  useEffect(() => {
    
  }, []);

  if(!cookie.token ){
    return children
  }else{
    return <Navigate to='/' />
  }

};

export default LoginProtected;
