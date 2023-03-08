import React, { useState } from "react";
import axios from "axios";

import { BiLoaderAlt } from "react-icons/bi";
import authImg from "../../asset/auth.png";

import SucMsg from "../SucMsg";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { Formik, Form, Field, ErrorMessage } from "formik";

const ForgotPage = () => {
  const [load, setload] = useState(false);
  const [msg, setmsg] = useState({ status: false });

  const myStyle = {
    boxShadow: "0px 0px 9px 0px rgba(230,34,34,1)",
  };

  const initialValue = {
    email: "",
  };

  const validate = (e) => {
    const error = {};

    if (e.email.length < 1) {
      error.email = "Email Required";
    }
    return error;
  };

  const sendLink = (e) => {
    setload(true);
    axios
      .post(`${process.env.API_URL}/forgot-password`, { email: e.email })
      .then((res) => {
        setload(false);
        setmsg({ status: res.data.status, data: res.data, email: e.email });
      })
      .catch((err) => {
        setload(false);

        setmsg({
          status: err.response.data.status,
          error: err.response.data.msg,
        });
      });
  };

  console.log(msg);

  return (
    <>
      <Formik
        initialValues={initialValue}
        validate={validate}
        onSubmit={sendLink}
      >
        {({ errors, handleBlur, touched }) => (
          <div className="grid grid-cols-1 h-full md:grid-cols-2 bg-gradient-to-b from-blue-400 to-slate-800 ">
            <div className="w-full h-screen mt-10">
              <div className="grid place-items-center">
                <img src={authImg} alt="" className="w-[60vh]" />
                <h3 className="text-white text-[10vh] font-semibold">
                  Auth App
                </h3>
              </div>
            </div>
            {/* ================================================================= */}

            <div className="bg-white rounded-[40px] md:rounded-b-[0px]  -order-1 md:order-1">
              {msg.status ? (
                <SucMsg
                  email={msg.email}
                  msg1={msg.data.msg}
                  head="Link Sent your mail"
                  btnName="Go back Login"
                  route="/login"
                />
              ) : (
                <div className="my-28 bg--300 w-5/6 md:w-4/6 mx-auto gird place-items-center">
                  <h3 className="text-2xl font-semibold text-left mb-2">
                    Forgot Password
                  </h3>

                  <Form>
                    <div className="my-4">
                      <Field
                        name="email"
                        style={errors.email && touched.email && myStyle}
                        className=" w-full py-2 bg-gray-200 rounded px-3 outline-none"
                        placeholder="Email"
                        type="text"
                        onBlur={handleBlur}
                      />
                      <h2 className="text-red-700 text-left text-xs my-2">
                        {errors.email && touched.email && errors.email}
                      </h2>
                    </div>

                    {load && (
                      <div className="flex justify-center w-full">
                        <BiLoaderAlt className="text-2xl animate-spin" />
                      </div>
                    )}

                   {!load && <h2 className="text-red-700 text-center text-xl my-2">
                      {!msg.status && msg.error}
                    </h2> }

                    <button
                      type="submit"
                      className=" my-4  font-semibold bg-gradient-to-r from-blue-400 to-slate-500 w-full  h-11 text-white rounded-full "
                    >
                      Send Link
                    </button>
                  </Form>
                </div>
              )}
            </div>
          </div>
        )}
      </Formik>
    </>
  );
};

export default ForgotPage;
