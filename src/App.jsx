import { RouterProvider } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./routing/routes";
import { useContext } from "react";
// Import your global CSS file so the new styles are loaded
import "./index.css"; 

const App = () => {
  return (
    <>
      <ToastContainer
        position="bottom-right" 
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}  
      />
      <RouterProvider router={router} />
    </>
  );
};

export default App;