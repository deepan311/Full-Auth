import React from "react";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SucMsg = ({ email, head, msg1, msg2, btnName, route }) => {
  const navigate = useNavigate();
  return (
    <div className="my-10 flex-col justify-center">
      <h4 className="text-xl font-bold my-2">{head}</h4>
      <MdVerified className="text-[20vh] w-full text-green-500 animate-shakeX" />
      <br />
      <h3 className="text-xs my-2">{msg1}</h3>
      <h3 className="text-xs my-2"> {msg2}</h3>
      <h4 className="text-xl font-mono my-2 font-semibold">{email}</h4>
      <button
        onClick={() => {
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

export default SucMsg;
