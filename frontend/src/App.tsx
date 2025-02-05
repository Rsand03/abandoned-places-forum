import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/pages/Auth/ProtectedRoute";
import LoginPage from "./components/pages/Auth/LoginPage";
import NavMenu from "./components/shared/NavMenu";
import FeedPage from "./components/pages/Feed/FeedPage";
import ProfilePage from "./components/pages/Profile/ProfilePage";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import emitter from "./emitter/eventEmitter";
import Footer from "./components/shared/Footer";
import MapPage from "./components/pages/Map/MapPage.tsx";
import OpenedPost from "./components/pages/Feed/components/post/OpenedPost.tsx";
import { ToastProvider } from "./components/ui/toast.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import UsersPage from "./components/pages/Users/UsersPage.tsx";

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    emitter.on("startLoading", startLoading);
    emitter.on("stopLoading", stopLoading);

    return () => {
      emitter.off("startLoading", startLoading);
      emitter.off("stopLoading", stopLoading);
    };
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Router>
          <AuthProvider>
            <NavMenu />
            {loading && <LoadingSpinner />}
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <FeedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:postId"
                element={
                  <ProtectedRoute>
                    <OpenedPost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
          <Toaster />
          <Footer />
        </Router>
      </div>
    </ToastProvider>
  );
};

export default App;
