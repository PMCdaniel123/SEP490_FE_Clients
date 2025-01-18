"use client";

import { useDispatch, useSelector } from "react-redux";
import { login } from "@/stores/slices/authSlice";
import { RootState } from "@/stores";

export default function SignInPage() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = () => {
    dispatch(login("exampleUser"));
  };

  return (
    <div>
      <h1>Sign In</h1>
      {isAuthenticated ? (
        <p>Welcome, {user}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
