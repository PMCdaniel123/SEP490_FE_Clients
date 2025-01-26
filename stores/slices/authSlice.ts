import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ValidatePayload } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  isPhoneValid: boolean;
  loginStep: "phone" | "email" | "password";
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isPhoneValid: false,
  loginStep: "phone", // Start with phone by default
};

export const validatePhone = createAsyncThunk<
  string,
  ValidatePayload,
  {
    rejectValue: string;
  }
>("auth/validatePhone", async ({ input }, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/validates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    if (!response.ok) {
      return rejectWithValue("Invalid phone number");
    }
    return input;
  } catch {
    return rejectWithValue("Validation failed. Please try again.");
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
    const response = await fetch("/api/validates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    if (!response.ok) {
      return rejectWithValue("Invalid email address");
    }
    return input;
  } catch {
    return rejectWithValue("Validation failed. Please try again.");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loginStep = "phone";
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loginStep = "phone";
    },
    setLoginStep(state, action: PayloadAction<"phone" | "email" | "password">) {
      state.loginStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(validatePhone.pending, (state) => {
      state.isPhoneValid = false;
    });
    builder.addCase(validatePhone.fulfilled, (state) => {
      state.isPhoneValid = true;
      state.loginStep = "password";
    });
    builder.addCase(validatePhone.rejected, (state) => {
      state.isPhoneValid = false;
    });
    builder.addCase(validateEmail.fulfilled, (state) => {
      state.loginStep = "password";
    });
    builder.addCase(validateEmail.rejected, (state) => {
      state.isPhoneValid = false;
    });
  },
});

export const { login, logout, setLoginStep } = authSlice.actions;
export default authSlice.reducer;
