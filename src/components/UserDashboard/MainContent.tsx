import {  Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState } from 'react';

const MainContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = {
    image: 'https://static.vecteezy.com/system/resources/previews/014/194/216/non_2x/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg',
    name: 'User',
    email: 'user@email.com',
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex overflow-x-hidden bn">
      {/* Sidebar */}
      <Sidebar user={user} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className={`${
          isSidebarOpen ? 'ml-80' : 'ml-0'
        } flex-1 transition-all duration-300`}
      >
        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden p-4 fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-blue-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="cursor-pointer w-full p-3 shadow-md px-10 flex items-center justify-end gap-1" >
          <img src="/images/logo.png" alt="logo" className="h-10" />
          <span className="text-2xl font-bold">ITSYBIZZ</span>
        </div>

        <div className="mt-6 p-5">
         <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
