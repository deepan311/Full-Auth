import React,{useEffect} from 'react'

import{useParams,Navigate} from 'react-router-dom';
import { useCookies } from "react-cookie";
import { useDispatch } from 'react-redux';
import { fetchUser,fetchImage, googleLogin } from '../redux/userSlice';



function GoogleCall() {

    const { token } = useParams();

    const dispatch =useDispatch()

  const [cookie, setcookie] = useCookies();
  useEffect(() => {
    setcookie("token", token,{sameSite:'none',secure:true,path:'/'})

    dispatch(googleLogin(token))

    // if (cookie.token) {
    //   dispatch(fetchUser(cookie.token));
    //   dispatch(fetchImage(cookie.token));

    // //  fetchimg(cookie.token)
    // }
  }, []);

    return(
        <Navigate to='/' />
    )
}

export default GoogleCall