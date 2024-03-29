import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initial = {
  loading: false,
  auth: false,
  token: null,
  userdata: null,
  error: null,
  signUp: null,
  profilesrc: null,
};

export const signUp = createAsyncThunk(
  "user/signup",
  async ({ fullName, email, password, cpassword }) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/signup`,
        {
          fullName,
          email,
          password,
          cpassword,
        }
      );
      return result.data;
    } catch (error) {
      throw new Error(error.response.data.msg);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    try {
      console.log("inside login slice " + process.env.REACT_APP_API_URL);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          email,
          password,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.msg);
    }
  }
);




export const fetchUser = createAsyncThunk("user/fetchUser", async (token) => {
  try {
    const result = await axios.get(`${process.env.REACT_APP_API_URL}`, {
      headers: { token },
    });

    return result.data.result;
  } catch (error) {
    throw new Error(error.response.data.msg);
  }
});

export const fetchImage = createAsyncThunk("user/fetchImage", async (token) => {
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_API_URL}/profile-img`,
      {
        responseType: "blob",
        headers: { token },
      }
    );
    const url = URL.createObjectURL(result.data);
    return url;
  } catch (error) {
    throw new Error(error.response.data);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: initial,
  reducers: {
    logout: (state) => {
      state.auth = false;
      state.token = null;
      state.userdata = [];
      state.error = null;
      state.profilesrc = null;
    },
    googleLogin:(state,action)=>{
      state.token =action.payload ;
      state.auth =true;
    }
  },

  extraReducers: (builder) => {
    // ====================SIGNUP========================

    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.signUp = action.payload;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // ====================LOGIN========================

    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.auth = true;
      state.token = action.payload.result;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // ==================FETCHUSER========================

    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userdata = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.auth = false;
      state.error = action.error.message;
    });

    // ====================GOOGLE-LOGIN========================

    // builder.addCase(googleLogin.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(googleLogin.fulfilled, (state, action) => {
    //   state.loading = false;
    //   console.log(action.payload)
    //   window.location.replace(action.payload);
    // });
    // builder.addCase(googleLogin.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // });

    // ==================FETCHUSER========================

    // THIS ADDCASE NOT WORKING FOR PRODUCTION
    // BECAUSE WE WON'T CONNECT ANY IMAGE FETCHING FROM CLOUD PROVIDER LIKE (aws-sdk)

    builder.addCase(fetchImage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchImage.fulfilled, (state, action) => {
      state.loading = false;
      state.profilesrc = action.payload;
    });
    builder.addCase(fetchImage.rejected, (state, action) => {
      state.loading = false;
      state.auth = false;
      state.error = action.error.message;
    });
  },
});

export default userSlice.reducer;
export const { logout,googleLogin } = userSlice.actions;
