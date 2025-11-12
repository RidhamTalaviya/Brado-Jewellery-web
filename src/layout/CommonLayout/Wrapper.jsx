import { useCallback, useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";
import SubHeader from "./header/Subheader";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { fetchWishlist } from "../../redux/slices/wishlistSlice";
import { fetchCollectionsData } from "../../redux/slices/collections";
import { useLoading } from "../../Context/LoadingContext";
import Loader from "../../components/Loader";
import { LoggingContext } from "../../Context/LoggingContext";
import SignIn from "../../pages/auth/signIn/SignIn";

const Wrapper = () => {
  const dispatch = useDispatch();
  const [isform, setIsForm] = useState(false);

  useEffect(() => {
    dispatch(fetchCollectionsData());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchWishlist()).then(() => {
        console.log("Wishlist fetched successfully");
      }).catch((error) => {
        console.error("Failed to fetch wishlist:", error);
      });
    } else {
      console.log("No token found, skipping wishlist fetch");
    }
  }, [dispatch]); 

   const location = useLocation();
  const { loading, setLoading } = useLoading();

  

  const closeSignInModal = () => {
    setIsForm(false);
  };
  useEffect(() => {
    // Show loader when route changes
    setLoading(true);

    // Hide loader after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]);

  return (
    <>
    <LoggingContext.Provider value={{isform, setIsForm , closeSignInModal}}>
      {loading && <Loader />}
      <Header  />
      <SubHeader />
      <div>
        <Outlet  />
      </div>
      <Footer />

      {isform && (
          <div onClick={(e) => e.stopPropagation()}>
            <SignIn open={true} onClose={closeSignInModal} data={closeSignInModal} />
          </div>
      )}
    </LoggingContext.Provider>
    </>
  );
};

export default Wrapper;