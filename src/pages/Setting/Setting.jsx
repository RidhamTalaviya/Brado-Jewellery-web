import React, { useState } from 'react';
import wall from '../../assets/images/wallate.png'
import {
  User,
  Package,
  Heart,
  MapPin,
  Wallet,
  Edit3,
  Phone,
  Mail,
  Calendar,
  Plus,
  X,
  ShoppingBag,
  Home
} from 'lucide-react';
import AddressManager from './Adressbook';
import Profile from './Profile';
import Order from './Order';
import Wish from './Wish';
import Wallate from './Wallate';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useLoading } from '../../Context/LoadingContext';

const ProfileDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { loading , setLoading } = useLoading();
  
  const menuItems = [
    { id: '/profile', label: 'Profile', icon: User },
    { id: '/orders', label: 'Orders', icon: Package },
    { id: '/wishlist', label: 'Wishlist', icon: Heart },
    { id: '/address-book', label: 'Address Book', icon: MapPin },
    { id: '/wallet', label: 'Wallet', icon: Wallet },
  ];

  // Find the current page label based on the route
  const getCurrentLabel = () => {
    const currentItem = menuItems.find(item => item.id === location.pathname);
    return currentItem ? currentItem.label : 'Profile';
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="w-full bg-[#f4f3ef]">
        <div className="w-[90%] mx-auto">
          <Breadcrumb label={getCurrentLabel()} />
        </div>
      </div>

      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 md:flex-shrink-0 hidden md:block">
            <div className="bg-[#f8f8f6] borde p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`w-full flex border-b border-gray-300 items-center space-x-3 px-2 py-2 text-left transition-all duration-200 text-[14px] ${
                        location.pathname === item.id
                          ? 'text-[#b4853e]'
                          : 'text-gray-600 hover:text-gray-900 text-[14px]'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;