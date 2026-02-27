import React from 'react';
import trafficAnalytics  from '../../../assets/images/svg/trafficAnalyticsImg.svg'

const TrafficAnalyticsSection = () => {
  return (
    <section className=" px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Text Section */}
        <div className="max-w-xl text-left flex flex-col items-center md:items-start">
          <h2 className="text-size-32 sm:text-size-40  md:text-size-48 font-medium text-black text-center md:text-start mb-6 leading-tight tracking-widest">
            Why Weblinqo?
          </h2>
          <p className="text-gray-700 mb-6 text-center md:text-start text-size-18">
          Unlike scattered tools and platforms, Weblinqo gives you everything in one ecosystem — from your profile to your domain.
          It's fast, flexible, and designed to scale with you.
          </p>
          <ul className="text-gray-700 mb-6 md:text-start text-size-18 list-disc list-inside space-y-2">
            <li>Simple, no-code setup.</li>
            <li>Centralized digital identity.</li>
            <li>Designed for creators, businesses, and communities.</li>
          </ul>
        </div>

        {/* Right Chart Section */}
        <div className=" w-full max-w-md">
          
          {/* Charts */}
          <div className="p-4 rounded-xl shadow-lg mb-6">
            <img
              src={trafficAnalytics}
              alt="analytics"
              className="w-full rounded-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrafficAnalyticsSection;
