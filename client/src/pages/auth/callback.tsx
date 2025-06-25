// pages/auth/callback.tsx

import { useRouter } from "next/router";
import { useEffect } from "react";

const AuthCallback = () => {
  const router = useRouter();

   useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const name = url.searchParams.get("name");
    const email = url.searchParams.get("email");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, email }));
      router.push("/"); // redirect to homepage or dashboard
    }
  }, []);

  return <p>Signing you in...</p>;
};

export default AuthCallback;
