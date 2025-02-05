import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/AuthService";
import { jwtDecode } from "jwt-decode";
import * as jwt_decode from "jwt-decode";
import { useToast } from "../hooks/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  JWToken: string;
  userId: string;
  username: string;
  role: string;
  points: number;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface JwtPayload extends jwt_decode.JwtPayload {
  userId: string;
  username: string;
  role: string;
  points: number;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    AuthService.isAuthenticated()
  );
  const [JWToken, setJWToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsAuthenticated(true);
      setJWToken(token);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService.login(username, password);
      const { token } = response;

      const decoded = jwtDecode<JwtPayload>(token);

      setIsAuthenticated(true);
      setJWToken(token);
      setUserId(decoded.userId);
      setUsername(decoded.username);
      setRole(decoded.role);
      setPoints(decoded.points);

      localStorage.setItem("userToken", token);
      localStorage.setItem("userId", decoded.userId);
      localStorage.setItem("username", decoded.username);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("points", decoded.points.toString());

      navigate("/map");

      toast({
        title: "Success!",
        description: "User logged in successfully.",
      });
    } catch (error) {
      if (error instanceof Error && "message" in error) {
        toast({
          title: "Error!",
          description: error.message || "An unknown error occurred.",
        });
      } else {
        toast({
          title: "Error!",
          description: "An unknown error occurred.",
        });
      }
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const { token } = await AuthService.register(username, email, password);

      const decoded = jwtDecode<JwtPayload>(token);

      setIsAuthenticated(true);
      setJWToken(token);
      setUserId(decoded.userId);
      setUsername(decoded.username);
      setRole(decoded.role);
      setPoints(decoded.points);

      localStorage.setItem("userToken", token);
      localStorage.setItem("userId", decoded.userId);
      localStorage.setItem("username", decoded.username);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("points", decoded.points.toString());

      navigate("/feed");

      toast({
        title: "Sucess!",
        description: "User registered successfully.",
      });
    } catch (error) {
      if (error instanceof Error && "message" in error) {
        toast({
          title: "Error!",
          description: error.message || "An unknown error occurred.",
        });
      } else {
        toast({
          title: "Error!",
          description: "An unknown error occurred.",
        });
      }
    }
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setJWToken("");
    setUserId("");
    setUsername("");
    setRole("");
    setPoints(0);
    navigate("/");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("points");
    location.reload();

    toast({
      title: "Sucess!",
      description: "User logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        JWToken,
        userId,
        username,
        role,
        points,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
