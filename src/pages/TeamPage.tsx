import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { VERIFIED_TEAM, GNS_CONFIG } from '../data/gnsData';

export const TeamPage: React.FC = () => {
  return (
    <div id="team-page-container" className="w-full bg-[#F5F4F0] py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Page Header */}
        <div className="bg-white border border-[#E8E5DE] rounded-lg p-8 sm:p-10 mb-8 shadow-xs">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-2">
            Advisory Team
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[#202020] font-semibold leading-tight">
            Meet the GNS Advisors
          </h1>
          <p className="text-sm text-[#666666] mt-2 max-w-2xl leading-relaxed">
            Our licensed advisors represent buyers, investors, and family offices with integrity, comprehensive community knowledge, and personal representation.
          </p>
        </div>

        {/* 8 Team Members in 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VERIFIED_TEAM.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-[#E8E5DE] rounded-lg overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="aspect-[4/4.5] w-full overflow-hidden bg-[#F5F4F0] relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 bg-white/95 text-[#202020] px-2.5 py-0.5 rounded-sm text-[10px] tracking-wider uppercase font-semibold shadow-xs">
                    {member.department}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-lg sm:text-xl text-[#202020] font-semibold">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#D6A536] font-semibold mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-xs text-[#666666] mt-2.5 leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="mt-3.5 pt-3 border-t border-[#E8E5DE] text-[11px] text-[#666666]">
                    <span className="text-[#202020] font-medium">Languages: </span>
                    <span>{member.languages.join(' · ')}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`/contact?advisor=${encodeURIComponent(member.name)}`}
                  className="w-full py-2.5 px-3 bg-[#F5F4F0] hover:bg-[#D6A536] hover:text-[#202020] text-[#202020] border border-[#E8E5DE] rounded-md text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Connect with Advisor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Desk Banner */}
        <div className="mt-12 bg-white border border-[#E8E5DE] rounded-lg p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl text-center md:text-left">
            <h3 className="font-serif text-2xl text-[#202020] font-semibold">
              Looking for a Specific Development?
            </h3>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              Our central desk coordinates inquiries across all master developer launches. Connect with us directly for floor plans and payment schedules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${GNS_CONFIG.phone.replace(/\s+/g, '')}`}
              className="bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold px-6 py-2.5 rounded-md text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              Call Advisory Desk
            </a>
            <a
              href={`https://wa.me/${GNS_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F5F4F0] hover:bg-[#E8E5DE] text-[#202020] border border-[#E8E5DE] px-6 py-2.5 rounded-md text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
