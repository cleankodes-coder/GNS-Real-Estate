import React from 'react';
import { VERIFIED_DEVELOPERS } from '../data/gnsData';

export const DeveloperStrip: React.FC = () => {
  return (
    <section id="developers" className="bg-white py-14 sm:py-16 border-b border-[#E8E5DE]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 text-center">
        {/* Small gold label */}
        <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-2">
          Premier Partnerships
        </span>

        {/* Centred heading */}
        <h2 className="font-serif text-2xl sm:text-3xl text-[#202020] font-semibold mb-10">
          Explore Developments by Leading Developers
        </h2>

        {/* Balanced row of existing developer logos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-5 items-center">
          {VERIFIED_DEVELOPERS.map((dev) => (
            <div
              key={dev.id}
              className="p-3 bg-[#F5F4F0] hover:bg-white border border-[#E8E5DE] rounded-md transition-all text-center flex flex-col items-center justify-center min-h-[64px] shadow-2xs hover:shadow-xs group"
              title={dev.tagline}
            >
              <span className="font-serif text-sm tracking-[0.12em] text-[#202020] font-bold group-hover:text-[#D6A536] transition-colors">
                {dev.logoText}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#666666] mt-0.5 truncate max-w-[100px]">
                {dev.name.replace(' Properties', '').replace(' Realty', '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
