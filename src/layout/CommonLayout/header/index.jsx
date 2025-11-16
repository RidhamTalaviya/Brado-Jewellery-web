import React, { useState, useEffect, useContext } from "react";
import SearchIcon from "../../../assets/icons/SearchIcon";
import HeartIcon from "../../../assets/icons/HeartIcon";
import CartIcon from "../../../assets/icons/Cart";
import UserIcon from "../../../assets/icons/UserIcon";
import logo from "../../../assets/images/logo.png";
import logo1 from "../../../assets/images/logo1.jpg";
import { useNavigate } from "react-router-dom";
import SignIn from "../../../pages/auth/signIn/SignIn";
import Cookies from "js-cookie";
import { Heart, LogOut, MapPin, Package, User, Wallet } from "lucide-react";
import { clearCart, fetchCartData } from "../../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearWishlist } from "../../../redux/slices/wishlistSlice";
import { LoggingContext } from "../../../Context/LoggingContext";
import { getuserprofile } from "../../../redux/slices/authSlice";

const Header = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dispatch = useDispatch();
  const { isform, setIsForm } = useContext(LoggingContext);
  const state = useSelector((state) => state?.collections?.collections);
  const cart = useSelector((state) => state?.cart?.cart[0]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
useEffect(() => {
  if(token)
  {
    dispatch(getuserprofile());
  }
}, [token]);

  console.log(state, "state collection");

  const products = ["Necklace", "Earrings", "Ring", "Bracelet", "Hand Bag"];

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
    } else {
      const filtered = products.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered.length > 0 ? filtered : ["No product found."]);
    }
  };

  const toggleMobileSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setQuery("");
      setResults([]);
    }
  };

  const handleWishlist = () => {
    if (token) {
      navigate("/wishlist");
    } else {
      setIsForm(true);
    }
  };

  const lockScroll = () => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    const header = document.querySelector("header");
    if (header && window.getComputedStyle(header).position === "fixed") {
      header.style.paddingRight = `${scrollbarWidth}px`;
    }
  };

  const unlockScroll = () => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    const header = document.querySelector("header");
    if (header) {
      header.style.paddingRight = "";
    }
  };
  const profile = useSelector((state) => state?.auth?.profile?.data);
  useEffect(() => {
    if (token) {
      dispatch(fetchCartData());
    }
  }, [token]);

  useEffect(() => {
    if (isform) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => unlockScroll();
  }, [isform]);

  useEffect(() => {
    if (isMenuOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => unlockScroll();
  }, [isMenuOpen]);

  useEffect(() => {
    const closeUserMenu = (event) => {
      if (showUserMenu && !event.target.closest(".relative")) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", closeUserMenu);
    return () => document.removeEventListener("mousedown", closeUserMenu);
  }, [showUserMenu]);

  const openSignInModal = () => {
    if (!token) {
      setIsForm(true);
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  const UserLoginLogout = () => {
    if (token) {
      localStorage.removeItem("token");
      dispatch(clearWishlist());
      dispatch(clearCart());
      navigate("/");
    } else {
      setIsForm(true);
    }
  };

  return (
    <>
      <header className="w-full sticky lg:relative top-0 z-50 ">
        <div className="bg-white border-b border-gray-200">
          {/* Mobile Header */}
          <div className="lg:hidden top-0 z-50 relative flex items-center py-2 px-3">
            {/* Left: Menu Button */}
            <div className="z-10">
              <button
                className="flex flex-col items-center justify-center w-6 h-6 space-y-1 p-0"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span
                  className={`w-5 h-0.5 bg-gray-700 transition-all ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-gray-700 transition-all ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-gray-700 transition-all ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </button>
            </div>

            {/* Center: Logo - Absolutely Centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <img
                src={logo1}
                onClick={() => navigate("/")}
                alt="Brado Jewellery Logo"
                className="h-11 w-auto cursor-pointer"
              />
            </div>

            {/* Right: Icons */}
            <div className="ml-auto flex items-center gap-2.5 z-10">
              <button
                onClick={toggleMobileSearch}
                className="py-1.5 cursor-pointer"
                aria-label="Search"
              >
                <SearchIcon className="h-6 w-6 text-gray-700" />
              </button>

              <button
                className="py-1.5 cursor-pointer"
                aria-label="Wishlist"
                onClick={() => navigate("/wishlist")}
              >
                <HeartIcon className="h-6 w-6 text-gray-700" />
              </button>

              <button
                className="py-1.5 cursor-pointer relative"
                aria-label="Shopping cart"
                onClick={() => navigate("/shopping-cart")}
              >
                <CartIcon className="h-5 w-5 text-gray-700" />
                {cart?.total_quantity > 0 && (
                  <span
                    className="absolute top-0 inline-flex items-center justify-center w-4.5 h-4.5 text-[10px]  text-white rounded-full"
                    style={{ backgroundColor: "#b4853e" }}
                  >
                    {cart?.total_quantity}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between py-3 px-16">
            {/* Desktop Logo */}
            <div className="flex-shrink-0">
              <img
                src={logo}
                onClick={() => navigate("/")}
                alt="Brado Jewellery Logo"
                className="h-16 lg:h-20 w-auto cursor-pointer"
              />
            </div>

            {/* Desktop Search + Icons */}
            <div className="flex items-center space-x-3 flex-1 justify-end ml-8">
              {/* Desktop Search */}
              <div className="relative w-full lg:max-w-md">
                <input
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="Search for products"
                  className="w-full border border-gray-300 rounded-sm pl-5 pr-10 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                />
                <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800 transition-colors">
                  <SearchIcon className="w-5 h-5" />
                </button>

                {query && (
                  <div className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                    {results.map((item, i) => (
                      <div
                        key={i}
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleWishlist}
                  className="py-2 mx-2 cursor-pointer  rounded-full transition-colors"
                  aria-label="Wishlist"
                >
                  <HeartIcon className="h-6 w-6 text-gray-700 hover:text-gray-900 transition-colors" />
                </button>
                <button
                  onClick={() => navigate("/shopping-cart")}
                  className="py-2 mx-2 cursor-pointer  rounded-full transition-colors relative"
                  aria-label="Shopping cart"
                >
                  <CartIcon className="h-5 w-5 text-gray-700 hover:text-gray-900 transition-colors" />
                  {cart?.total_quantity > 0 && (
                    <span
                      className="absolute top-0 inline-flex items-center justify-center w-4.5 h-4.5 text-[10px]  text-white rounded-full"
                      style={{ backgroundColor: "#b4853e" }}
                    >
                      {cart?.total_quantity}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={openSignInModal}
                    className="py-2 mx-2 cursor-pointer  rounded-full transition-colors"
                    aria-label="User account"
                  >
                    <UserIcon className="h-6 w-6 text-gray-700 hover:text-gray-900 transition-colors" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <ul className="py-2">
                        <li
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            navigate("/profile");
                            setShowUserMenu(false);
                          }}
                        >
                          <User size={18} className="text-gray-600" />
                          <span className="text-sm font-medium">Profile</span>
                        </li>
                        <li
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            navigate("/orders");
                            setShowUserMenu(false);
                          }}
                        >
                          <Package size={18} className="text-gray-600" />
                          <span className="text-sm font-medium">Orders</span>
                        </li>
                        <li
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            navigate("/wishlist");
                            setShowUserMenu(false);
                          }}
                        >
                          <Heart size={18} className="text-gray-600" />
                          <span className="text-sm font-medium">Wishlist</span>
                        </li>
                        <li
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            navigate("/address-book");
                            setShowUserMenu(false);
                          }}
                        >
                          <MapPin size={18} className="text-gray-600" />
                          <span className="text-sm font-medium">
                            Address Book
                          </span>
                        </li>
                        <li
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            navigate("/wallet");
                            setShowUserMenu(false);
                          }}
                        >
                          <Wallet size={18} className="text-gray-600" />
                          <span className="text-sm font-medium">Wallet</span>
                        </li>
                        <li
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors text-red-500 border-t border-gray-100 mt-1 pt-2.5"
                          onClick={() => {
                            UserLoginLogout();
                            setShowUserMenu(false);
                          }}
                        >
                          <LogOut size={18} />
                          <span className="text-sm font-medium">Logout</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="lg:hidden border-t border-gray-200 px-4 py-3 bg-gray-50">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="Search products..."
                  className="w-full border border-gray-200 rounded-sm pl-4 pr-10 py-2 text-sm focus:outline-none transition-colors"
                  autoFocus
                />
                <button
                  onClick={toggleMobileSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
                  aria-label="Close search"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {query && (
                  <div className="absolute top-11 left-0 w-full bg-white border rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                    {results.map((item, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-b-0"
                        onClick={() => {
                          setQuery("");
                          setResults([]);
                          setIsSearchOpen(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Overlay */}
          <div
            className={`fixed inset-0 bg-black/40 transition-opacity duration-300 lg:hidden z-40 ${
              isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Side Drawer Menu */}
          <div
            className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-[#b4893e] rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg text-[16px] text-black-900">
                  {token ? profile?.name : "Guest"}
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Menu Items Container */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ height: "calc(100vh - 140px)" }}
            >
              <div className="">
                <nav>
                  <div
                    onClick={() => {
                      navigate(`/`);
                      setIsMenuOpen(false);
                    }}
                    className="px-6 py-3 text-gray-900 transition-colors text-[15px] font-normal cursor-pointer hover:bg-gray-50"
                  >
                    Home
                  </div>
                  {state?.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        navigate(`/category/${item.slug}`);
                        setIsMenuOpen(false);
                      }}
                      className="px-6 py-3 text-gray-900 transition-colors text-[15px] font-normal cursor-pointer hover:bg-gray-50"
                    >
                      {item?.categoryName}
                    </div>
                  ))}
                  {token && (
                    <div>
                      <div
                        onClick={() => {
                          navigate("/profile");
                          setIsMenuOpen(false);
                        }}
                        className="px-6 py-3 text-gray-900 transition-colors text-[15px] font-normal cursor-pointer hover:bg-gray-50"
                      >
                        Profile
                      </div>

                      <div
                        className="px-6 py-3 text-gray-900 transition-colors text-[15px] font-normal cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          navigate("/orders");
                          setIsMenuOpen(false);
                        }}
                      >
                        Orders
                      </div>
                      <div
                        className="px-6 py-3 text-gray-900 transition-colors text-[15px] font-normal cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          navigate("/wishlist");
                          setIsMenuOpen(false);
                        }}
                      >
                        Wishlist
                      </div>
                      <div
                        className="px-6 py-3 text-gray-900 transition-colors text-[15px] font-normal cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          navigate("/address-book");
                          setIsMenuOpen(false);
                        }}
                      >
                        Address Book
                      </div>
                      <div
                        className="px-6 py-3 text-gray-900 transition-colors text-[15px] font-normal cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          navigate("/wallet");
                          setIsMenuOpen(false);
                        }}
                      >
                        Wallet
                      </div>
                     
                    </div>
                  )}
                </nav>
              </div>
            </div>

            {/* Logout Button - Fixed at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-white">
              <button
              onClick={() => {
                UserLoginLogout();
                setIsMenuOpen(false);
              }}
                className="w-full cursor-pointer flex items-center justify-center gap-3 bg-[#b4893e] text-white py-4 mx-6 mb-6 rounded-lg text-[15px] font-medium hover:bg-[#a07835] transition-colors"
                style={{ width: "calc(100% - 48px)" }}
              >
               {token ? <span className="">Logout</span> : <span>Login / SignUp</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* SignIn Modal */}
    </>
  );
};

export default Header;
