import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const {t}: { t: TFunction } = useTranslation();


    return (
    <div className="py-8 px-4 md:px-8">
      {isSignUp ? <Register /> : <Login />}
      <button
        type="button"
        onClick={() => setIsSignUp((prev) => !prev)}
        className="text-blue-600 hover:underline mt-4 block mx-auto"
      >
        {isSignUp
          ? t("auth.loginText")
          : t("auth.registerText")}
      </button>
    </div>
  );
}
