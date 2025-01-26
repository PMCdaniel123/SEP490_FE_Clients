import { ValidatePayload } from "@/types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  isEmailOrPhoneValid: boolean;
  loginStep: "emailOrPhone" | "password";
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isEmailOrPhoneValid: false,
  loginStep: "emailOrPhone",
};

export const validateEmailOrPhone = createAsyncThunk<
  string,
  ValidatePayload,
  {
    rejectValue: string;
  }
>("auth/validateEmailOrPhone", async ({ input }) => {
  console.log("POST nè");
  const response = await fetch("/api/validates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  if (!response.ok) throw new Error("Invalid email or phone number");
  return input;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loginStep = "emailOrPhone";
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loginStep = "emailOrPhone";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(validateEmailOrPhone.fulfilled, (state) => {
      state.isEmailOrPhoneValid = true;
      state.loginStep = "password";
    });
    builder.addCase(validateEmailOrPhone.rejected, (state) => {
      state.isEmailOrPhoneValid = false;
    });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
