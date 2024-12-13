import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/pages/Auth/ProtectedRoute";
import Dashboard from "./components/pages/Dashboard/DashboardPage";
import LoginPage from "./components/pages/Auth/LoginPage";
import NavMenu from "./components/shared/NavMenu";
import FeedPage from "./components/pages/Feed/FeedPage";
import ProfilePage from "./components/pages/Profile/ProfilePage";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import emitter from "./emitter/eventEmitter";
import Footer from "./components/shared/Footer";
import MapPage from "./components/pages/Map/MapPage.tsx";

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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Router>
        <AuthProvider>
          <NavMenu />
          {loading && <LoadingSpinner />}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <FeedPage />
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
          </Routes>
        </AuthProvider>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
