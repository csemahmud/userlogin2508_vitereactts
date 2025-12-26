// src/components/scenes/navbar/index.tsx
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Logo from "@/assets/Logo.png";
import Link from "./Link";
import { SelectedPage } from "@/shared/types/enums/SelectedPage.type";
import useMediaQuery from "@/components/hooks/useMediaQuery";
import ActionButton from "@/shared/ActionButton";
import LoginUserComponent from "@/components/scenes/manageUsers/LoginUserComponent";
import { Link as RouterLink } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { loginSuccess, logout } from "@/redux/authSlice";
import { ILoginResponse } from "@/shared/types/interfaces";

const defaultUserIcon =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

type Props = {
  isTopOfPage: boolean;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }: Props) => {
  const dispatch = useDispatch();

  // Redux user
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = Boolean(user?.userId);

  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const navbarBackground = isTopOfPage ? "" : "bg-primary-100 drop-shadow";

  const openLoginModal = () => {
    if (!isLoggedIn) setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = (data: ILoginResponse) => {
    dispatch(loginSuccess(data));
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuLinks = [
    "Home",
    "Benefits",
    "Our Classes",
    "Contact Us",
    "Manage Users",
    "WebGL",
  ];

  const handleMenuClick = (page: SelectedPage) => {
    setSelectedPage(page);
    setIsMenuToggled(false); // ✅ auto close on mobile
  };

  return (
    <nav className="overflow-hidden">
      {/* NAVBAR */}
      <div
        className={`${navbarBackground} fixed top-0 z-30 w-full py-6`}
      >
        <div className="mx-auto w-5/6 flex items-center justify-between">
          {/* LOGO */}
          <img
            src={Logo}
            alt="logo"
            className="h-10 cursor-pointer"
            onClick={() => setSelectedPage(SelectedPage.Home)}
          />

          {/* DESKTOP */}
          {isAboveMediumScreens ? (
            <div className="flex w-full items-center justify-between">
              {/* LINKS */}
              <div className="flex items-center gap-8 text-sm">
                {menuLinks.map((page) => (
                  <Link
                    key={page}
                    page={page}
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
                  />
                ))}
              </div>

              {/* AUTH */}
              <div className="relative flex items-center gap-8">
                {isLoggedIn ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2">
                      <img
                        src={defaultUserIcon}
                        alt="User"
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="font-semibold text-primary-600">
                        {user?.name ?? "User"}
                      </span>
                    </button>

                    {/* DROPDOWN */}
                    <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ul className="py-2 text-sm text-gray-700">
                        <li>
                          <RouterLink
                            to="/sample-update"
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            Update Profile
                          </RouterLink>
                        </li>
                        <li>
                          <RouterLink
                            to="/sample-reset"
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            Reset Password
                          </RouterLink>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <>
                    <p
                      className="cursor-pointer hover:text-primary-500"
                      onClick={openLoginModal}
                    >
                      Sign In
                    </p>
                    <ActionButton setSelectedPage={setSelectedPage}>
                      Become a Member
                    </ActionButton>
                  </>
                )}
              </div>
            </div>
          ) : (
            // MOBILE HAMBURGER
            <button
              className="rounded-full bg-secondary-500 p-2"
              onClick={() => setIsMenuToggled(true)}
            >
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-primary-100 shadow-xl">
          <div className="flex justify-end p-6">
            <button onClick={() => setIsMenuToggled(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 text-xl">
            {/* NAV LINKS */}
            {menuLinks.map((page) => (
              <Link
                key={page}
                page={page}
                selectedPage={selectedPage}
                setSelectedPage={(p) =>
                  handleMenuClick(p as SelectedPage)
                }
              />
            ))}

            {/* AUTH SECTION */}
            <div className="mt-10 flex flex-col items-center gap-4">
              {isLoggedIn ? (
                <>
                  <p className="font-semibold text-primary-600">
                    {user?.name ?? "User"}
                  </p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuToggled(false);
                    }}
                    className="rounded-md bg-red-500 px-6 py-2 text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      openLoginModal();
                      setIsMenuToggled(false);
                    }}
                    className="text-primary-600 font-semibold"
                  >
                    Sign In
                  </button>

                  <ActionButton setSelectedPage={setSelectedPage}>
                    Become a Member
                  </ActionButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      <LoginUserComponent
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
};

export default Navbar;
