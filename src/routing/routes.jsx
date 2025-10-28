import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import User from "../pages/user/User";
import NotFound from "../pages/notfound/NotFound";
import Wrapper from "../layout/CommonLayout/Wrapper";
import AuthLayout from "../layout/AuthLayout/AuthLayout";
import SignIn from "../pages/auth/signIn/SignIn";
import SignUp from "../pages/auth/signup/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import React from "react";
import HomePages from "../pages/home/Index";
import ShowProduct from "../pages/buy/ShowProduct";
import Category from "../pages/category/Category";
import ProfileDashboard from "../pages/Setting/Setting";
import Profile from "../pages/Setting/Profile";
import Order from "../pages/Setting/Order";
import Wish from "../pages/Setting/Wish";
import AddressManager from "../pages/Setting/Adressbook";
import Wallate from "../pages/Setting/Wallate";
import CheckoutFlow from "../pages/Setper Order/CheckoutFlow";
import ContactUs from "../pages/ContactUs";
import Shipment from "../pages/Setting/Shipment";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Wrapper />,
        children: [
          {
            path: "/",
            element: <HomePages />,
          },
          {
            path: "/category/:categoryName",
            element: <Category />,
          },
          {
            path: "/showproduct/:slug",
            element: <ShowProduct />,
          },
          {
            path: "/shopping-cart",
            element: <CheckoutFlow />,
          },
          {
            element: <ProfileDashboard />,
            children: [
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "orders",
                element: <Order />,
              },
              {
                path: "wishlist",
                element: <Wish />,
              },
              {
                path: "address-book",
                element: <AddressManager />,
              },
              {
                path: "wallet",
                element: <Wallate />,
              },
              {
                path: "shipment/:orderId",
                element: <Shipment />,
              },
            ]
          },
          {
            path: "/user",
            element: <User />,
          },
          {
            path: "/contact-us",
            element: <ContactUs />,
          },
        ]
      },
    ]
  },
  {
    path: "/auth",
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "signIn",
            element: <SignIn />,
          },
          {
            path: "signUp",
            element: <SignUp />,
          },
        ],
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);