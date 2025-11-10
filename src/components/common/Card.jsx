import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cart from "../../assets/icons/Cart";
import OfferBadge from "../../layout/CommonLayout/OfferBadge";
import StarRating from "../../assets/icons/startRating";
import CheckBadgeIcon from "../../assets/icons/CheckBadgeIcon";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createCartData } from "../../redux/slices/cartSlice";
import SignIn from "../../pages/auth/signIn/SignIn";
import Cookies from "js-cookie";
import { LoggingContext } from "../../Context/LoggingContext";

/* Badge colors */
const BADGE_COLORS = {
  "New Launch": "bg-[#533d99]",
  "Special Deal": "bg-[#198754]",
};

const Card = ({ product }) => {
  const { isform, setIsForm } = useContext(LoggingContext);

  console.log(product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const wishlistItems = useSelector((state) => state?.wishlist?.wishlist || []);

  // Sync wishlist
  useEffect(() => {
    const inWishlist = wishlistItems.some(
      (item) => item.productId === product._id || item._id === product._id
    );
    setIsInWishlist(inWishlist);
  }, [wishlistItems, product._id]);

  // Add to cart
  const addToCart = (id) => {
    if (token) {
      dispatch(createCartData({ productId: id }));
    } else {
      setIsForm(true);
    }
  };

  // Toggle wishlist
  const handleWishlistToggle = async (e) => {
 

    if (token) {
      try {
        if (isInWishlist) {
          await dispatch(removeFromWishlist(product._id)).unwrap();
        } else {
          await dispatch(addToWishlist(product._id)).unwrap();
        }
      } catch (error) {
        console.error("Wishlist error:", error);
        } 
    } else {
      setIsForm(true);
    }
  };

  // Navigate to product
  const goToProduct = (slug) => {
    navigate(`/showproduct/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  // Build badges
  const badges = [];
  if (product.newproduct === true) {
    badges.push({ text: "New Launch", color: BADGE_COLORS["New Launch"] });
  }
  if (product.special === true) {
    badges.push({
      text: "Special Deal",
      color: BADGE_COLORS["Special Deal"],
      icon: <CheckBadgeIcon size={16} />,
    });
  }

  return (
    <>
      <div className="bg-white overflow-hidden relative group hover:transition duration-300">
        {/* Image */}
        <div className="relative cursor-pointer">
          <img
            onClick={() => goToProduct(product.slug)}
            src={product.img || product.imagesUrl?.[0]}
            alt={product.title}
            className="w-full object-cover rounded-lg transition-transform duration-300 h-64 md:h-76"
          />

          {/* Badges */}
          {badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className={`text-white px-2 py-1 flex items-center gap-1 rounded-md text-xs font-medium ${badge.color}`}
                >
                  {badge.icon}
                  {badge.text}
                </span>
              ))}
            </div>
          )}

          {/* Heart Icon */}
          <div
            className={`absolute top-3 right-3 transition-opacity duration-300 ${
              isInWishlist ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <button
              onClick={handleWishlistToggle}
              disabled={isLoading}
              className={`rounded-full p-2 shadow cursor-pointer transition ${
                isInWishlist ? "bg-white" : "bg-black/40"
              }`}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isInWishlist ? "text-red-500 fill-red-500" : "text-gray-200"
                }`}
              />
            </button>
          </div>

          {/* Add to Cart */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product._id);
            }}
            className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <button className="w-full cursor-pointer bg-white text-gray-800 px-4 py-2 text-sm rounded-none">
              <div className="p-2 border border-gray-300 rounded-[1px] flex items-center justify-center gap-2">
                <Cart className="w-4 h-4 text-gray-600" />
                <span>Add To Cart</span>
              </div>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-3">
          <h3
            className="text-sm md:text-base font-medium line-clamp-2 cursor-pointer truncate"
            onClick={() => goToProduct(product.slug)}
          >
            {product.title}
          </h3>
          <div className="mt-1">
            {product.averageRating && (
              <StarRating rating={product.averageRating} size={16} />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm md:text-base font-semibold">
              ₹{product.discountPrice}
            </span>
            <span className="text-xs line-through text-gray-400">
              ₹{product.price}
            </span>
            <span className="text-xs md:text-sm text-orange-600">
              ({product.discount}% OFF)
            </span>
          </div>

          {product?.offers?.[0]?.active && (
            <OfferBadge text={product?.offers?.[0]?.title} />
          )}
          {product.stock < 15 && product.stock !== 0 && (
            <span className="text-[14px] font-medium text-red-500">
              Only {product.stock} left
            </span>
          )}

          {product.stock === 0 && (
            <span className="text-[14px] font-medium text-red-500">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Card;
