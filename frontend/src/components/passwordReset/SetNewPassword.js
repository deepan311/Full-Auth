import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Formik, Form, Field } from "formik";
import { useParams } from "react-router-dom";
import axios from "axios";
import SucMsg from "../SucMsg";

const SetNewPassword = () => {
  const [viewPass, setviewPass] = useState(true);
  const [load, setload] = useState(false);
  const [msg, setmsg] = useState({ status: false });

  const { token } = useParams();

  const myStyle = {
    boxShadow: "0px 0px 9px 0px rgba(230,34,34,1)",
  };

  const initialValue = {
    password: "",
    cpassword: "",
  };

  const validate = (e) => {
    const error = {};

    function PasswordMatch(password, cpassword) {
      if (password !== cpassword) {
        return false;
      } else {
        return true;
      }
    }

    function validatePassword(password) {
      // Minimum 8 characters and at least 1 number and 1 special character
      const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?!.*\s).{8,}$/;
      return re.test(password);
    }

    if (!PasswordMatch(e.password, e.cpassword)) {
      error.cpassword = "Password not match";
    }

    if (e.password.length < 1) {
      error.password = "Password Required";
    }

    if (!validatePassword(e.cpassword)) {
      error.cpassword =
        "Password Should have 1 number and 1 special character Minimum 8 character Example :Password@1";
    }

    if (e.cpassword.length < 1) {
      error.cpassword = "Conform-Password Required";
    }

    return error;
  };

  const updatePassword = async (e) => {
    const apiUpdate = async (token, newPassword) => {
      setload(true);
      axios
        .put(`${process.env.REACT_APP_API_URL}/reset-password`, {
          token,
          newPassword,
        })
        .then((res) => {
          setload(false);
          setmsg({ status: res.data.status, data: res.data });
        })
        .catch((err) => {
          setload(false);

          setmsg({
            status: err.response.data.status,
            error: err.response.data.msg,
          });
        });
    };
     await apiUpdate(token, e.cpassword);
  };

  console.log(msg)

  return (
    <>
      <Formik
        initialValues={initialValue}
        validate={validate}
        onSubmit={updatePassword}
      >
        {({ errors, handleBlur, touched }) => (
          <div className="bg-white rounded-[40px] md:rounded-b-[0px]  -order-1 md:order-1">
            {msg.status ? (
              <SucMsg
                email={msg.email}
                msg1={msg.data.msg}
                head="Password Updated Successfully"
                btnName="Go back Login"
                route="/login"
              />
            ) : (
              <div className="my-28 bg--300 w-5/6 lg:w-2/4  md:w-4/6 mx-auto gird place-items-center">
                <h3 className="text-2xl font-semibold text-left mb-2">
                  Reset Password
                </h3>

                <Form>
                  <div className="my-4">
                    <Field
                      name="password"
                      style={errors.password && touched.password && myStyle}
                      className=" w-full font-mono py-2 bg-gray-200 rounded px-3 outline-none"
                      placeholder="Password"
                      type="password"
                      onBlur={handleBlur}
                    />
                    <h2 className="text-red-700 text-left text-xs my-2">
                      {errors.password && touched.password && errors.password}
                    </h2>
                  </div>

                  <div className="relative my-4">
                    <Field
                      name="cpassword"
                      style={errors.cpassword && touched.cpassword && myStyle}
                      className=" w-full font-mono py-2 bg-gray-200 rounded px-3 outline-none relative"
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

                  {load && <div className="flex justify-center w-full">
                    <BiLoaderAlt className="text-2xl animate-spin" />
                  </div>}

                  {!load && <h2 className="text-red-700 text-center text-xl my-2">
                      {!msg.status && msg.error}
                    </h2> }

                  <button
                    type="submit"
                    className=" my-4  font-semibold bg-gradient-to-r from-blue-400 to-slate-500 w-full  h-11 text-white rounded-full "
                  >
                    Reset Password
                  </button>
                </Form>
              </div>
            )}
          </div>
        )}
      </Formik>
    </>
  );
};

export default SetNewPassword;
