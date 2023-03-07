import React from "react";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";


const ErrorMsg = ({ email, head, msg1, msg2, btnName, route,btnfun }) => {
  const navigate = useNavigate();
  return (
    <div className="my-10 flex-col justify-center">
      <h4 className="text-xl font-bold my-2">{head}</h4>
      <ImCancelCircle className="text-[20vh] w-full text-red-500 animate-shakeX" />
      <br />
      <h3 className="text-xs my-2">{msg1}</h3>
      <h3 className="text-xs my-2"> {msg2}</h3>
      <h4 className="text-xl my-2 font-mono font-semibold">{email}</h4>
      <button
        onClick={() => {
          btnfun && btnfun()
          navigate(route);
        }}
        className=" text-white bg-gradient-to-tr from-blue-500/60 to-slate-700/60 px-2 py-1 rounded text-md"
      >
        {" "}
        {btnName}
      </button>
    </div>
  );
};

export default ErrorMsg;
