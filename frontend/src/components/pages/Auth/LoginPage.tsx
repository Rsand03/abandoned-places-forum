import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="py-8 px-4 md:px-8">
      {isSignUp ? <Register /> : <Login />}
      <button
        type="button"
        onClick={() => setIsSignUp((prev) => !prev)}
        className="text-blue-600 hover:underline mt-4 block mx-auto"
      >
        {isSignUp
          ? "Already have an account? Log in"
          : "Don't have an account? Register"}
      </button>
    </div>
  );
}
