import React,{useEffect,useState} from 'react'
import SucMsg from './SucMsg'
import ErrorMsg from './ErrorMsg'
import { useParams } from 'react-router-dom'
import axios from 'axios'
function VerifyEmail() {
  const [msg, setmsg] = useState({load:true});
  const {token} = useParams()

  const verifyApi = async (token)=>{
    setmsg({load:true})
    axios.get(`${process.env.REACT_APP_API_URL}/verify-email/`+token).then(res=>{
      setmsg({...msg,status:true,data:res.data,load:false})
    }).catch(err=>{
      setmsg({...msg,status:false,data:err.response.data,load:false})
    })

  }

  const resend=()=>{

    alert('update soon')

  }

  useEffect(() => {
    verifyApi(token)
  }, []);

  if(msg.load){
    return(<>Loading.....</>)
  }
  
  if(msg.status && !msg.load){
    const {result} = msg.data
return(    <SucMsg
  email={result.email}
  msg1="Your Mail VerifyEmail Successfully"
  msg2="Continue to Join Us"
  head='Verified Successfully'
  btnName='Continue'
  route='/'
/>)
  }
  if(!msg.status && !msg.load){
    return(
      <ErrorMsg
      email={msg.data.msg}
      msg1='somthing worng resend the link'
 
      head='This link invalid or expired'
      btnName='Re send link'
      btnfun={resend}
    />
    )
  }
}

export default VerifyEmail