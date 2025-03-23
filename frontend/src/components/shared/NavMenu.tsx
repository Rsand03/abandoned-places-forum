import {Link} from "react-router-dom";
import {Button} from "../ui/button";
import {useEffect, useState} from "react";
import {useAuth} from "../../contexts/AuthContext";
import {useTranslation} from "react-i18next";
import type { TFunction } from "i18next";
import i18n from "i18next";

export default function NavMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const currentLanguage = i18n.language;
  const { t }: { t: TFunction } = useTranslation();

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const menuElement = document.getElementById("mobile-menu");
      if (menuElement && !menuElement.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="w-full h-20 bg-blue-600 rounded-b-sm flex items-center justify-center px-6 z-10">
      <div className="flex flex-row items-center justify-center w-full max-w-[1440px]">
        <Link to={"/map"} className="font-bold text-2xl text-white">
          Urbex
        </Link>

        <div className="text-sm ml-auto overflow-hidden whitespace-nowrap top-5 bg-white p-2 rounded-sm font-sans">
          {t("navMenu.testEnvironment")}
        </div>
        <div className="ml-auto">
          {!isAuthenticated && (

              <div className="text-white flex space-x-4">
                <button
                    onClick={() => i18n.changeLanguage("en")}
                    className={`${
                        currentLanguage === "en" ? "font-bold" : ""
                    } hover:text-blue-100`}
                >
                  ENG
                </button>
                <button
                    onClick={() => i18n.changeLanguage("et")}
                    className={`${
                        currentLanguage === "et" ? "font-bold" : ""
                    } hover:text-blue-100`}
                >
                  EST
                </button>
              </div>
          )}
        </div>
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            {isMobileMenuOpen ? (
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                  ></path>
                </svg>
            ) : (
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                  ></path>
                </svg>
            )}
          </button>
        </div>

        <div
            className={`fixed inset-0 z-40 flex items-start justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
                isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={closeMobileMenu}
        >
          <div
              id="mobile-menu"
              className={`fixed top-0 left-0 w-full z-50 bg-blue-600 justify-center items-center gap-y-6 shadow-lg transform transition-transform duration-300 ease-in-out rounded-b-md ${
                  isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
              } p-4 flex flex-col gap-2`}
              onClick={(e) => e.stopPropagation()}
          >
            {isAuthenticated && (
                <>
                  <Link to={"/"} className="font-bold text-2xl text-white">
                    Urbex
                  </Link>
                  <Link
                      to={"map"}
                      onClick={toggleMobileMenu}
                      className="text-slate-50 hover:text-slate-100"
                  >
                    {t("navMenu.map")}
                  </Link>
                  <Link
                      to={"feed"}
                      onClick={toggleMobileMenu}
                      className="text-slate-50 hover:text-slate-100"
                  >
                    {t("navMenu.feed")}
                  </Link>
                  <Link
                      to={"profile"}
                      onClick={toggleMobileMenu}
                      className="text-slate-50 hover:text-slate-100"
                  >
                    {t("navMenu.profile")}
                  </Link>
                  <Link
                      to={"users"}
                      onClick={toggleMobileMenu}
                      className="text-slate-50 hover:text-slate-100"
                  >
                    {t("navMenu.users")}
                  </Link>
                  <div className="text-white flex space-x-4">
                    <button
                        onClick={() => i18n.changeLanguage("en")}
                        className={`${
                            currentLanguage === "en" ? "font-bold" : ""
                        } hover:text-blue-100`}
                    >
                      ENG
                    </button>
                    <button
                        onClick={() => i18n.changeLanguage("et")}
                        className={`${
                            currentLanguage === "et" ? "font-bold" : ""
                        } hover:text-blue-100`}
                    >
                      EST
                    </button>
                  </div>
                  <Button
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 w-fit"
                  >
                    {t("navMenu.logout")}
                  </Button>
                </>
            )}
          </div>
        </div>

        <div className="hidden lg:flex gap-x-6 h-fit items-center">
          {isAuthenticated && (
              <>
                <Link to={"map"} className="text-blue-50 hover:text-blue-100">
                  {t("navMenu.map")}
                </Link>
                <Link to={"feed"} className="text-blue-50 hover:text-blue-100">
                  {t("navMenu.feed")}
                </Link>
                <Link to={"profile"} className="text-blue-50 hover:text-blue-100">
                  {t("navMenu.profile")}
                </Link>
                <Link to={"users"} className="text-blue-50 hover:text-blue-100">
                  {t("navMenu.users")}
                </Link>
                <Button
                    onClick={handleLogout}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                >
                  {t("navMenu.logout")}
                </Button>
                <div className="text-white flex space-x-4 ml-2">
                  <button
                      onClick={() => i18n.changeLanguage("en")}
                      className={`${
                          currentLanguage === "en" ? "font-bold" : ""
                      } hover:text-blue-100`}
                  >
                    ENG
                  </button>
                  <button
                      onClick={() => i18n.changeLanguage("et")}
                      className={`${
                          currentLanguage === "et" ? "font-bold" : ""
                      } hover:text-blue-100`}
                  >
                    EST
                  </button>
                </div>
              </>
          )}
        </div>
      </div>
    </div>
  );
}
