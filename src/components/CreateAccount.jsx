"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import EyeIcon from "./icons/EyeIcon";
import EyeOffIcon from "./icons/EyeOffIcon";
import Spinner from "./ui/Spinner"; // Import Spinner component
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils"; // Adjust the path as needed
import { registerApi } from "@/utils/apiCall";
import { useRouter } from "next/navigation";

export function CreateAccount() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [route, setRoute] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = (password) => {
    setPasswordErrors({
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|`~]/.test(password),
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!route || !password) {
      showErrorToast("All fields are required.");
      return;
    }

    if (
      !passwordErrors.hasUppercase ||
      !passwordErrors.hasLowercase ||
      !passwordErrors.hasNumber ||
      !passwordErrors.hasSpecialChar
    ) {
      showErrorToast("Password requirements not met.");
      return;
    }
    setLoading(true);

    // Call success toast function and submit form logic
    try {
      const res = await registerApi({ route, password });
      localStorage.setItem("noteToken", res?.data?.token);
      console.log(res?.data?.token, "cehckToken");
      setLoading(false);
      showSuccessToast("Account created!");
      router.push(`/${route}`);
    } catch (error) {
      setLoading(false);
      showErrorToast(error?.response?.data?.message);
    }
  };

  const indicatorClass = (isValid) =>
    `w-3 h-3 rounded-full mr-2 ${isValid ? "bg-green-600" : "bg-red-600"}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="p-8 rounded-lg shadow-lg bg-white text-black">
        <h2 className="text-xl font-semibold mb-4 text-center">
          This account does not exist. Create a new account.
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Enter your route"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            />
          </div>
          <div className="relative mb-4">
            <Input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isPasswordVisible ? (
                <EyeOffIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              )}
              <span className="sr-only">Toggle password visibility</span>
            </button>
          </div>
          <div className="text-sm mb-4">
            <div className="flex items-center mb-1">
              <span className={indicatorClass(passwordErrors.hasUppercase)} />
              <span
                className={`ml-2 ${
                  passwordErrors.hasUppercase
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                Must contain at least one uppercase letter
              </span>
            </div>
            <div className="flex items-center mb-1">
              <span className={indicatorClass(passwordErrors.hasLowercase)} />
              <span
                className={`ml-2 ${
                  passwordErrors.hasLowercase
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                Must contain at least one lowercase letter
              </span>
            </div>
            <div className="flex items-center mb-1">
              <span className={indicatorClass(passwordErrors.hasNumber)} />
              <span
                className={`ml-2 ${
                  passwordErrors.hasNumber ? "text-green-600" : "text-red-600"
                }`}>
                Must contain at least one number
              </span>
            </div>
            <div className="flex items-center mb-1">
              <span className={indicatorClass(passwordErrors.hasSpecialChar)} />
              <span
                className={`ml-2 ${
                  passwordErrors.hasSpecialChar
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                Must contain at least one special character
              </span>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full py-2 bg-slate-800 text-white flex items-center justify-center"
            disabled={loading}>
            {loading ? <Spinner className="text-white" /> : "Create"}
          </Button>
        </form>
      </div>
    </div>
  );
}
