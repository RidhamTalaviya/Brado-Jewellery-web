import React from "react";
import img1 from "../../assets/images/Dropearring/img1.jpeg";
import img2 from "../../assets/images/Dropearring/img2.jpeg";
import img3 from "../../assets/images/Dropearring/img3.jpeg";

const products = [img1, img2, img3];

function Dropearring() {
  return (
    <div className="w-[87%] mx-auto py-10">
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((item, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition"
          >
            <img
              src={item}
              alt={`earring-${index}`}
              className="w-full h-[550px] object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dropearring;
