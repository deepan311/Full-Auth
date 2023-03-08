import React, { useEffect, useState } from "react";
import Profile from "../asset/profile.png";
import { MdAddAPhoto, MdVerified } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage, logout } from "../redux/userSlice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";

const Home = () => {
  const [time, settime] = useState(120);
  const [timer, settimer] = useState(null);
  const [reload, setreload] = useState(false);
  const [msg, setmsg] = useState({ data: null, status: false, color: null });

  const [tempImg, settempImg] = useState("");
  const [err, seterr] = useState("");

  const state = useSelector((state) => state.user);
  
  const dispatch = useDispatch();
  const [cookie, setcookie, removecookie] = useCookies();
  const navigate = useNavigate();

  const [interload, setinterload] = useState(false);

  const [Image, setImage] = useState(Profile);

  //  let image = state.userdata ? (`../../../image/${state.userdata.profileImg}`) : Profile

  const submit = (e) => {
    e.preventDefault();
    removecookie("token", { secure: true, sameSite: "none" });
    dispatch(logout());
    navigate("/login");
  };

  const resendverify = (email) => {
    setreload(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/resend-verify-email/${email}`)
      .then((res) => {
        setreload(false);
        setmsg({ status: true, data: res.data.msg, color: "text-green-400" });
        settimer(
          setInterval(() => {
            settime((time) => time - 1);
          }, 1000)
        );
      })
      .catch((err) => {
        setmsg({
          status: true,
          data: err.response.data.msg,
          color: "text-red-400",
        });

        setreload(false);
      });
  };

  useEffect(() => {
    if (time <= 1) {
      settimer(clearInterval(timer));
      settime(120);
    }
  }, [timer, time]);

  if (state.loading || !state.userdata) {
    return (
      <div className="flex justify-center w-full">
        <BiLoaderAlt className="text-2xl animate-spin" />
      </div>
    );
  }

  const timeformat = (sec) => {
    const minute = Math.floor(sec / 60);
    const seconds = sec % 60;

    const formin = minute.toString().padStart(2, "0");
    const forsec = seconds.toString().padStart(2, "0");
    return `${formin}: ${forsec}`;
  };

  if (msg.status) {
    setTimeout(() => {
      setmsg({ status: false, data: null, color: null });
    }, 11000);
  }

  const fileUpload = async (e) => {
    const file = e.target.files[0];
    const formdata = new FormData();
    formdata.append(state.userdata.email, file);
    setinterload(true)
    await axios
      .put(`${process.env.REACT_APP_API_URL}/update-profile`, formdata, {
        headers: { token: cookie.token },
      })
      .then(async(res) => {
        await dispatch(fetchImage(cookie.token))
       setinterload(false)

      })
      .catch((err) => {
       setmsg({ data: err.response.data.msg, status: true, color: "text-red-400" });

       setinterload(false)

      });
  };

  // const convertBaseUrl = async (file) => {
  //   return new Promise((resolve, reject) => {
  //     const fileRead = new FileReader();
  //     fileRead.readAsDataURL(file);
  //     fileRead.onload = () => {
  //       resolve(fileRead.result);
  //     };
  //     fileRead.onerror = (err) => {
  //       return reject(err);
  //     };
  //   });
  // };

  return (
    <div className="w-full flex-col justify-center  h-screen bg-orange-50 py-14 relative">
      {msg.status && (
        <div className="absolute top-0 w-full bg-gray-700 text-center ">
          <h3 className={`${msg.status && msg.color} text-xs font-bold py-3`}>
            {msg.data}
          </h3>
        </div>
      )}

      {interload && (
        <div className="absolute bg-black/50 z-10 h-full top-0 flex justify-center items-center w-full">
          <BiLoaderAlt className="text-3xl text-white animate-spin " />
          <h2 className="text-white">Loading</h2>
        </div>
      )}

      <h5 className="text-2xl font-bold my-5">
        Welcome {state.userdata.fullName}
      </h5>

      <form action="" onSubmit={submit}>
        <div className=" w-36 h-36 m-auto rounded-full relative overflow-hidden group">
          <img
            src={state.profilesrc}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            onChange={fileUpload}
            onClick={() => {
              document.querySelector("#fromId").click();
            }}
            type="file"
            className="absolute bottom-0 bg-black/50 w-full left-0 py-3 cursor-pointer    hidden group-hover:block  h-14"
          >
            <input
              name="file"
              type="file"
              hidden
              id="fromId"
              className="absolute w-full h-full bg-gray-500 left-0"
            />
            <MdAddAPhoto className="w-full text-white text-xl" />
          </div>
        </div>
        {err && <h1>{err}</h1>}

        <h3 className="font-bold font-mono text-xl my-2">{state.fullname}</h3>
        <div className="flex items-center place-content-center">
          <h3 className="text-md font-mono">{state.userdata.email}</h3>{" "}
          {state.userdata.emailVerified ? (
            <MdVerified className="text-green-500 mx-3" />
          ) : (
            <>
              <ImCancelCircle className="text-red-500 mx-3" />{" "}
              <h3 className="text-xs font-bold text-black mx-2">
                Check your Inbox
              </h3>
              <br />
              {reload ? (
                <BiLoaderAlt className="text-xl animate-spin" />
              ) : (
                <button
                  disabled={timer != null}
                  className={`${
                    timer === null || timer === undefined
                      ? "text-blue-800"
                      : "text-gray-500"
                  } text-xs `}
                  type="button"
                  onClick={() => {
                    resendverify(state.userdata.email);
                  }}
                >
                  Resend Email
                </button>
              )}
              <h2 className="text-xs text-black mx-4">
                {timer != null && timeformat(time)}
              </h2>
            </>
          )}
        </div>
        <button
          type="submit"
          className="px-7 text-white my-4 py-2 text-xl bg-gradient-to-tr from-blue-400 to-slate-700  rounded"
        >
          Signout
        </button>
      </form>
    </div>
  );
};

export default Home;
