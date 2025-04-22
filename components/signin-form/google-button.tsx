import { useState } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { BASE_URL, CLIENT_KEY } from "@/constants/environments";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores";
import Cookies from "js-cookie";
import { login } from "@/stores/slices/authSlice";

function GoogleButton({ onClose }: { onClose?: () => void }) {
  const [idToken, setIdToken] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential; // This is the idToken
    if (token) {
      setIdToken(token);

      // Send the idToken to your API
      try {
        const response = await fetch(`${BASE_URL}/auth/user/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: token,
          }),
        });

        if (!response.ok) {
          toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại.", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            theme: "light",
          });
          return;
        }

        const result = await response.json();
        const avatarUrl = result.user.name
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
              result.user.name
            )}&format=png`
          : "/WorkHive.svg";
        const customerData = {
          id: result.user.id,
          fullName: result.user.name,
          email: result.user.email,
          phone: result.user.Phone,
          roleId: result.user.RoleId,
          avatar: avatarUrl,
        };
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
        dispatch(login(customerData));

        Cookies.set("google_token", token, { expires: 3 });
        onClose?.();
      } catch {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          theme: "light",
        });
      }
    }
  };

  const handleError = () => {
    console.log("Google Login Failed");
    toast.error("Đăng nhập Google thất bại!", {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      theme: "light",
    });
  };

  console.log(idToken);

  return (
    <div className="text-center w-full">
      <GoogleOAuthProvider clientId={CLIENT_KEY || ""}>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </GoogleOAuthProvider>
    </div>
  );
}

export default GoogleButton;
