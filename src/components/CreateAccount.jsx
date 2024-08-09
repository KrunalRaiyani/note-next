import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import EyeIcon from "./icons/EyeIcon";
import EyeOffIcon from "./icons/EyeOffIcon";

export function CreateAccount() {
  const [password, setPassword] = useState("");
  const [route, setRoute] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password:", password);
    console.log("Route:", route);
  };

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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {isPasswordVisible ? (
                <EyeOffIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-500" />
              )}
              <span className="sr-only">Toggle password visibility</span>
            </button>
          </div>
          <Button type="submit" className="w-full py-2 bg-slate-800 text-white">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}
