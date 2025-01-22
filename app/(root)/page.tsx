"use client";

import { SignInButton } from "@/components/signin-form/signin-button";
import { useRouter } from "next/navigation";

function HomePage() {
  const router = useRouter();

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <div>
        <button onClick={() => router.push(`/sign-up?role=customer`)}>
          Đăng ký
        </button>
      </div>
      <div>
        <button onClick={() => router.push(`/sign-up?role=owner`)}>
          Đăng ký doanh nghiệp
        </button>
      </div>
      <div className="m-4">
        <SignInButton className="w-3/5" />
      </div>
    </div>
  );
}

export default HomePage;
