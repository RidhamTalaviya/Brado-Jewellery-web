import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function SubHeader() {
  const navigate = useNavigate();
  const state = useSelector((state) => state?.collections?.collections);
  
  const handleCategoryClick = (item) => {
    // Navigate with state instead of just URL params
    navigate(`/category/${item.slug}`, {
      state: {
        categoryId: item._id,
        categoryName: item.categoryName,
        categoryData: item
      }
    });
  };

  return (
    <div className="lg:block hidden w-full bg-white z-20 sticky top-0">
      <nav className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <ul className="flex justify-center items-center space-x-5 pt-2.5 pb-3 px-2">
            {state.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleCategoryClick(item)}
                  style={{ wordSpacing: "3.5px" }}
                  className="relative 
                    text-[#000] text-[13.5px] font-[500] 
                    transition-all duration-300
                    hover:text-[#b4853e]
                    whitespace-nowrap
                    after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[13px] 
                    after:h-[2px] after:w-0 after:bg-[#b4853e]
                    hover:after:w-full
                    after:transition-all after:duration-300
                  "
                >
                  {item.categoryName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default SubHeader;