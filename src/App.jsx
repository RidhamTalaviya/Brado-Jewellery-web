import { RouterProvider } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./routing/routes";

const App = () => {
  return (
    <>
    <ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"

  />
    <RouterProvider router={router} />
    </>
  )
};

export default App;
