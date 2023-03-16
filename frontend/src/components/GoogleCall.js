import React,{useEffect} from 'react'

import{useParams,Navigate} from 'react-router-dom';
import { useCookies } from "react-cookie";



function GoogleCall() {

    const { token } = useParams();

  const [cookie, setcookie] = useCookies();
  useEffect(() => {
    setcookie('token',token)
  }, []);

    return(
        <Navigate to='/' />
    )
}

export default GoogleCall