import React from "react";
import Layout from "@/components/Layout";
import ProfileHeader from "@/components/sections/ProfileHeader";
import UserProfileSection from "@/components/sections/UserProfileSection";
import bannerImg from "@/assets/images/cover.jpg";
import avatarImg from "@/assets/images/avatar.png";
import SEO from "@/components/SEO";
import { getPageSEO } from "@/config/seo";

const UserProfilePage = () => {
  // SEO configuration
  const seoData = getPageSEO('profile', { path: '/profile' });

  return (
    <Layout>
      <SEO {...seoData} />
      {/* Mobile Layout */}
      <div className="md:hidden w-full min-h-screen bg-[#131314] flex flex-col">
        {/* Banner Image */}
        <div className="relative w-full h-[164px] bg-[#272727]">
          <img
            className="absolute w-full h-full top-0 left-0 object-cover"
            alt="Profile Banner"
            src={bannerImg}
          />
        </div>

        {/* Profile Avatar */}
        <div className="relative w-20 h-20 -mt-10 self-start ml-10 bg-[#4e5462] rounded-[20px] overflow-hidden border-[1.67px] border-solid border-[#3f3f3f]">
          <img
            className="w-20 h-20 object-cover"
            alt="Avatar"
            src={avatarImg}
          />
        </div>

        {/* Profile Header and Content */}
        <div className="flex flex-col w-full px-4 mt-4 gap-6">
          <ProfileHeader />
          <UserProfileSection />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block  overflow-hidden ">
          {/* Desktop Banner */}
          <div className="relative h-[307px] bg-cover bg-[50%_50%]">
            <img
              className="absolute w-full h-[307px] top-0 left-0 object-cover"
              alt="Background image"
              src={bannerImg}
            />
          </div>
         
          <div className="  w-[86%] mx-auto left-0">

          {/* Desktop Avatar */}
          <div className="relative w-24 h-24 -mt-16 ml-8 mb-8 bg-[#4e5462] rounded-[20px] overflow-hidden border-[1.67px] border-solid border-[#3f3f3f]">
            <img
              className="w-24 h-24 object-cover"
              alt="Avatar"
              src={avatarImg}
            />
          </div>

          {/* Desktop Profile Header and Content */}
          <div className="flex flex-col gap-10 mx-auto min-h-[500px] pb-4">
            <ProfileHeader />
            <UserProfileSection />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
