import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ValidatePayload } from "@/types";
import { toast } from "react-toastify";
import { BASE_URL } from "@/constants/environments";
import Cookies from "js-cookie";

interface Customer {
  id: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  roleId: string | null;
  avatar: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  customer: Customer | null;
  user: string | null;
  isPhoneValid: boolean;
  loginStep: "phone" | "email" | "password";
}

const initialState: AuthState = {
  isAuthenticated: false,
  customer: null,
  user: null,
  isPhoneValid: false,
  loginStep: "phone",
};

export const validatePhone = createAsyncThunk<
  string,
  ValidatePayload,
  {
    rejectValue: string;
  }
>("auth/validatePhone", async ({ input }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/users/checkuserphone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: input }),
    });
    if (!response.ok) {
      toast.error("Số điện thoại không hợp lệ!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
      return rejectWithValue("Số điện thoại không hợp lệ!");
    }
    const result = await response.text();
    if (result.toLowerCase().includes("không tìm thấy")) {
      toast.error(result, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
      return rejectWithValue(result);
    }
    localStorage.setItem("auth", input);
    return JSON.parse(result);
  } catch {
    return rejectWithValue("Lỗi truy cập");
  }
});

export const validateEmail = createAsyncThunk<
  string,
  ValidatePayload,
  {
    rejectValue: string;
  }
>("auth/validateEmail", async ({ input }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/users/checkuseremail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input }),
    });
    if (!response.ok) {
      toast.error("Email không hợp lệ!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
      return rejectWithValue("Email không hợp lệ!");
    }
    const result = await response.text();
    if (result.toLowerCase().includes("không tìm thấy")) {
      toast.error(result, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        theme: "light",
      });
      return rejectWithValue(result);
    }
    localStorage.setItem("auth", input);
    return JSON.parse(result);
  } catch {
    return rejectWithValue("Lỗi truy cập");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<Customer>) {
      state.isAuthenticated = true;
      state.customer = action.payload;
      state.user = action.payload.fullName;
      state.loginStep = "phone";
      localStorage.removeItem("auth");
    },
    logout(state) {
      state.isAuthenticated = false;
      state.customer = null;
      state.user = null;
      state.loginStep = "phone";
      Cookies.remove("token");
      Cookies.remove("google_token");
    },
    setLoginStep(state, action: PayloadAction<"phone" | "email" | "password">) {
      state.loginStep = action.payload;
    },
    resetLoginStep(state) {
      state.loginStep = "phone";
      localStorage.removeItem("auth");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(validatePhone.pending, (state) => {
      state.isPhoneValid = false;
    });
    builder.addCase(validatePhone.fulfilled, (state, action) => {
      state.isPhoneValid = true;
      state.user = action.payload;
      state.loginStep = "password";
    });
    builder.addCase(validatePhone.rejected, (state) => {
      state.isPhoneValid = false;
    });
    builder.addCase(validateEmail.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loginStep = "password";
    });
    builder.addCase(validateEmail.rejected, (state) => {
      state.isPhoneValid = false;
    });
  },
});

export const { login, logout, setLoginStep, resetLoginStep } =
  authSlice.actions;
export default authSlice.reducer;
