import React, { useState ,useEffect} from "react";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { BiLoaderAlt } from "react-icons/bi";
import authImg from "../asset/auth.png";
import SucMsg from "./SucMsg";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { logout, signUp } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [viewPass, setviewPass] = useState(true);
  const navigate = useNavigate()
  const state = useSelector((state) => state.user);
  const dispatch = useDispatch()

  useEffect(() => {
      
    dispatch(logout())
  }, []);

  const myStyle = {
    boxShadow: "0px 0px 9px 0px rgba(230,34,34,1)",
  };

  const initialValue = {
    fullName: "",
    email: "",
    password: "",
    cpassword: "",
  };


  const validate = (e) => {
    const error = {};

 

    function validateEmail(email) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    function validatePassword(password) {
      // Minimum 8 characters and at least 1 number and 1 special character
      const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{8,}$/;
      return re.test(password);
    }

    if (e.fullName.length < 1) {
      error.fullName = "Fullname Required";
    }

    if (e.email.length < 1) {
      error.email = "Email Required";
    }

    if (!validatePassword(e.password)) {
      error.password =
        "Password Should have 1 number and 1 special character Minimum 8 character Example :Password@1";
    }
    if (e.password.length < 1) {
      error.password = "Password Required";
    }

    if (!validateEmail(e.email)) {
      error.email = "Email Enter Properly";
    }

    if (e.password !== e.cpassword) {
      error.cpassword = "Password Not Match";
    }

    if (e.cpassword.length < 1) {
      error.cpassword = "Conform Password Required";
    }
    return error;
  };

  const register = async(o)=>{
    const {fullName,email,password,cpassword} = o
  await dispatch(signUp({fullName,email,password,cpassword}))
  //  navigate('/login',{state:result})
  }
  


  return (
    <>
      <Formik
        initialValues={initialValue}
        validate={validate}
        onSubmit={register}
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
             { 
              state.signUp ===null ?  <div className="my-12 bg--300 w-5/6 md:w-4/6 mx-auto gird place-items-center">
              <h3 className="text-2xl font-semibold text-left mb-2">
                Create Account
              </h3>

              <Form  >
                <div className="my-5">
                  <Field disabled={state.loading ? true :false}
                    name="fullName"
                    style={errors.fullName && touched.fullName && myStyle}
                    className=" w-full py-2 bg-gray-200 rounded px-3 outline-none"
                    placeholder="Fullname"
                    type="text"
                    onBlur={handleBlur}
                  />
                  <h2 className="text-red-700 text-left text-xs my-2">
                    {errors.fullName && touched.fullName && errors.fullName}
                  </h2>
                </div>
                <div className="my-4">
                  <Field disabled={state.loading ? true :false}
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
                <div className="my-4">
                  <Field disabled={state.loading ? true :false}
                    name="password"
                    style={errors.password && touched.password && myStyle}
                    className=" w-full py-2 bg-gray-200 rounded px-3 outline-none"
                    placeholder="Password"
                    type="password"
                    onBlur={handleBlur}
                  />
                  <h2 className="text-red-700 text-left text-xs my-2">
                    {errors.password && touched.password && errors.password}
                  </h2>
                </div>
                <div className="relative my-4">
                  <Field disabled={state.loading ? true :false}
                    name="cpassword"
                    style={errors.cpassword && touched.cpassword && myStyle}
                    className=" w-full  py-2 bg-gray-200 rounded px-3 outline-none relative"
                    placeholder="Confom Password"
                    type={viewPass ? "password" : "text"}
                    onBlur={handleBlur}
                  />
                  <h2 className="text-red-700 text-left text-xs my-2">
                    {errors.cpassword &&
                      touched.cpassword &&
                      errors.cpassword}
                  </h2>

                  {viewPass ? (
                    <AiFillEyeInvisible
                      onClick={() => setviewPass(!viewPass)}
                      className="absolute top-3 text-xl right-3 "
                    />
                  ) : (
                    <AiFillEye
                      onClick={() => setviewPass(!viewPass)}
                      className="absolute top-3 text-xl right-3 "
                    />
                  )}
                </div>

                {state.loading && (
                  <div className="flex justify-center w-full">
                    <BiLoaderAlt className="text-2xl animate-spin" />
                  </div>
                )}
                <h2 className="text-red-700 text-center text-xl my-2">
                  {state.error}
                </h2>

                <button disabled={state.loading ? true :false}
                  type="submit"
                  className=" my-4  font-semibold bg-gradient-to-r from-blue-400 to-slate-500 w-full  h-11 text-white rounded-full "
                >
                  Create Account
                </button>

                <h3 className="font-semibold">or</h3>

                <div className="grid lg:grid-cols-2 place-items-center">
                  <div className=" cursor-pointer hover:bg-black/20 hover:border-0 h-11 flex items-center my-2 border border-black rounded-full lg:w-auto w-full justify-center lg:justify-evenly px-4 py-2" onClick={()=>{alert('Update Soon')}} >
                    <FcGoogle className="ml-2" />
                    <span className="text-xs font-semibold mx-3">
                      Signup Google
                    </span>
                  </div>
                  <div className=" cursor-pointer hover:bg-black/20 hover:border-0 h-11 flex items-center my-2 border border-black rounded-full lg:w-auto w-full justify-center lg:justify-evenly px-4 py-2" onClick={()=>{alert('Update Soon')}}>
                    <BsFacebook className="ml-2" />
                    <span className="text-xs font-semibold mx-3">
                      Signup facebook
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-5 items-center my-4">
                  <hr className=" col-span-1 bg-gray-600 " />
                  <h3 className="col-span-3 text-xs cursor-pointer">
                    Aldready have an account{" "}
                    <span onClick={()=>{
                        navigate("/login");

                    }} className="text-blue-300 underline">Login</span>
                  </h3>
                  <hr className="col-span-1   bg-black" />
                </div>
              </Form>
            </div>: <SucMsg email={state.signUp.result}
              head=   'Link Sent Successfully'
              msg1={state.signUp.msg}
              btnName={"continue to login"}
              route={"/login"}
            /> 

             }
              {/* <SucMsg email={'deepan123@gmail.com'} /> */}
            </div>
          </div>
        )}
      </Formik>
    </>
  );
};

export default SignUp;
