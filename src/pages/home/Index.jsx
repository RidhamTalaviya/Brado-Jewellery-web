import React from 'react'
import Heroslider from './Heroslider'
import CollectionsSlider from './Collections'
import Category from './Category'
import NecklaCeSet from './NacklaCeset'
import Handwere from './Handwere'
import Earrings from './Earrings'
import Allproductimage from './Allproductimage'
import Fingerring from './Fingerring'
import BangleSet from './BangleSet'
import Traditional from './Traditional'
import Chainpendent from './Chainpendent'
import Dealoftheday from './Dealoftheday'
import Dropearring from './Dropearring'
import Juda from './Juda'
import Menbracelet from './Menbracelet'
import Sareepin from './Sareepin'
import RecentlyViewed from './RecentlyViewed'
import CustomerTestimonials from './CustomerTestimonials'
import Newarrival from './Newarrival'
import CarryDream from './CarryDream'
const HomePages = () => {
  return (
    <>
    <Heroslider/>
    <CollectionsSlider/>
    <Category/>
    <CarryDream/>
    <Newarrival/>
    <NecklaCeSet/>  
    {/* <Handwere/> */}
    <Earrings/>
    <Allproductimage/>
    <Fingerring/>
    <BangleSet/>
    <Traditional/>
    <Chainpendent/>
    {/* <Dealoftheday/> */}
    <Dropearring/>
    <Juda/>
    <Menbracelet/>
    <Sareepin/>
    {/* <RecentlyViewed/> */}
    <CustomerTestimonials/>
    </>
  )
}

export default HomePages