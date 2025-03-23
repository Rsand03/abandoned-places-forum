import React, { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Card, CardHeader, CardTitle } from "../../../ui/card";
import {useTranslation} from "react-i18next";
import {TFunction} from "i18next";

export default function Login() {
  const { login } = useAuth();
  const {t}: { t: TFunction } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("auth.login.title")}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">{t("auth.login.username")}</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">{t("auth.login.password")}</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-300 hover:bg-blue-700"
          >
            {t("auth.login.submit")}
          </Button>
          <Button
              className="w-full text-md bg-green-600 hover:bg-green-700"
              onClick={() => login("user", "user")}
          >
            {t("auth.login.loginAsTestUser")}
          </Button>
          {error && <p className="mt-2 text-red-600">{error}</p>}
        </form>
      </Card>
    </div>
  );
}
