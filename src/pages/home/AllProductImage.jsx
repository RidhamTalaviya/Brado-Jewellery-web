import React from 'react'
import { allproduct } from '../../constant/constant'


function Allproductimage() {
 

  return (
    <>
    
    <div className="py-10 w-[87%] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-6">
        {allproduct.map((item, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition"
          >
            <img
              src={item}
              alt={`product-${index}`}
              className="w-full h-[450px] object-cover"
            />
          </div>
        ))}
      </div>
    </div>

    <div className="w-full h-[200px] sm:h-[300px] md:h-[600px]">
  <video
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover"
  >
    <source src="https://pub-fcbdfa5d08884a7fb45a0457f296badb.r2.dev/video/b/1713940466054.mp4" type="video/mp4" />
  </video>
</div>
    
    </>
  )
}

export default Allproductimage
