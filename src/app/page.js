"use client";

import { useState, useEffect } from "react";
import { DarkThemeToggle } from "flowbite-react";
import { FloatingLabel, Button, Toast } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loginFailedMessage, setLoginFailedMessage] = useState("");
  const router = useRouter();

  useEffect(()=>{
    const data = localStorage.getItem("DelightLoginDetails");
      if (data !== null) {
        const value = JSON.parse(data);
        if (value.alreadyLoggedIn) {
          const currentDatetime = new Date();
          const lastLoginDatetime = new Date(value.lastLoginTime);
          const timeDifference = currentDatetime - lastLoginDatetime;
          const minutesDifference = Math.floor(timeDifference / (1000 * 60));
          if (minutesDifference < 1440) {
            router.push(`/${value.userName}`);
          }
        }
      }
  }, []);

  const submitLoginDetails = async () => {
    if (!isProcessing) {
      try {
        setIsProcessing(true);
        if (userName.trim() == "") throw "Please Enter Username.";
        if (password == "") throw "Please Enter Passoword.";

        const req = {
          userName: userName.trim(),
          password: password,
        };

        const responseJson = await fetch('https://backend-online.onrender.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req),
        })
        const response = await responseJson.json();

        if (!response.isError) {
          localStorage.setItem(
            "DelightLoginDetails",
            JSON.stringify({
              alreadyLoggedIn: true,
              userName: userName.trim(),
              password: password,
              lastLoginTime: new Date(),
            })
          );
          router.push(`/${userName}`);
        } else {
          throw response.ErrorMessege;
        }
      } catch (error) {
        setLoginFailedMessage(error.toString());
        setIsProcessing(false);
        setShowToast(true);
      }
    }
  };

  return (
    <>
      <div className="h-full">
        <div className="flex flex-row-reverse px-3 py-3">
          <DarkThemeToggle />
        </div>
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h1
              className="mt-10 text-center font-gluten font-bold"
              style={{ fontSize: 65 }}
            >
              <span style={{ color: "#dc2626" }}>D</span>
              <span style={{ color: "#f97316" }}>e</span>
              <span style={{ color: "#84cc16" }}>l</span>
              <span style={{ color: "#14b8a6" }}>i</span>
              <span style={{ color: "#8b5cf6" }}>g</span>
              <span style={{ color: "#f43f5e" }}>h</span>
              <span style={{ color: "red" }}>t</span>
              &nbsp;
              <span className="text-gray-600 dark:text-white">Ball</span>
            </h1>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="max-w-sm mx-auto">
              <div className="mb-5">
                <FloatingLabel
                  onChange={(e) => setUserName(e.target.value)}
                  variant="outlined"
                  label="Your Username"
                  value={userName}
                />
              </div>

              <div className="mb-10">
                <FloatingLabel
                value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  label="Your Password"
                />
              </div>
              <Button
                isProcessing={isProcessing}
                onClick={() => submitLoginDetails()}
                color="blue"
                pill
                className="w-full"
              >
                {isProcessing ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </div>
        </div>
        {showToast && (
          <div style={{ position: "absolute", top: 60 }} className="w-full">
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiX className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">
                {loginFailedMessage}
              </div>
              <Toast.Toggle onDismiss={() => setShowToast(false)} />
            </Toast>
          </div>
        )}
      </div>
    </>
  );
}
