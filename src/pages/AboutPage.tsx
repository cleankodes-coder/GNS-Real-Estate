import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Building, Users, Compass } from 'lucide-react';
import { GNS_CONFIG, VERIFIED_TEAM } from '../data/gnsData';

export const AboutPage: React.FC = () => {
  const leadershipPreview = VERIFIED_TEAM.slice(0, 4);

  return (
    <div id="about-page-container" className="w-full bg-white text-[#202020] scroll-mt-20">
      {/* Editorial Opening Section */}
      <section className="py-14 sm:py-20 border-b border-[#E8E5DE] bg-[#F5F4F0]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-2">
              About GNS Real Estate
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[46px] text-[#202020] font-semibold leading-tight">
              A Premier Brokerage for Dubai Residential & Off-Plan Living
            </h1>
            <p className="text-sm sm:text-base text-[#666666] mt-4 leading-relaxed">
              Headquartered in Vision Tower, Business Bay, GNS Real Estate provides client-focused brokerage representation for purchasing homes, managing off-plan developer allocations, and building property portfolios in Dubai.
            </p>
          </div>
        </div>
      </section>

      {/* Verified Company Content & Philosophy */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#E8E5DE]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Story Text */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block">
                Our Mission
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#202020] font-semibold leading-snug">
                Client Dedication Over Project Marketing
              </h2>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                As a licensed brokerage under the Dubai Real Estate Regulatory Agency (RERA), GNS operates independently on behalf of our buyers and investors. We represent developments from master developers such as Emaar, Nakheel, DAMAC, and Danube, offering impartial guidance on build quality, delivery track records, and secondary market liquidity.
              </p>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                Whether selecting your family residence in Dubai Hills Estate or securing an early-phase allocation in Dubai Creek Harbour, our private advisors ensure a transparent and protected acquisition process.
              </p>

              <div className="pt-2 text-xs text-[#202020] font-mono tracking-wider border-l-2 border-[#D6A536] pl-4 py-1 font-semibold">
                {GNS_CONFIG.reraOrLicense}
              </div>
            </div>

            {/* Architectural Visual */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E8E5DE] shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85"
                  alt="Dubai Downtown and Business Bay Skyline"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relevant Service Information */}
      <section className="py-16 lg:py-20 bg-[#F5F4F0] border-b border-[#E8E5DE]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="max-w-2xl text-center mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-2">
              What We Do
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#202020] font-semibold">
              Comprehensive Real Estate Services
            </h2>
            <p className="text-sm text-[#666666] mt-2">
              Transparent advisory across residential acquisitions, off-plan developer launches, and investor representation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E8E5DE] rounded-lg p-8 space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-[#F5F4F0] rounded-md flex items-center justify-center text-[#D6A536]">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#202020] font-semibold">
                Residential Buying
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Personalised assistance for purchasing ready apartments, penthouses, and private villas in Dubai’s leading communities.
              </p>
            </div>

            <div className="bg-white border border-[#E8E5DE] rounded-lg p-8 space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-[#F5F4F0] rounded-md flex items-center justify-center text-[#D6A536]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#202020] font-semibold">
                Off-Plan Launches
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Direct developer allocation access, milestone payment structuring, and unit clustering across new releases.
              </p>
            </div>

            <div className="bg-white border border-[#E8E5DE] rounded-lg p-8 space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-[#F5F4F0] rounded-md flex items-center justify-center text-[#D6A536]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#202020] font-semibold">
                Conveyancing & Handovers
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Overseeing trustee office filings, escrow verification, snagging inspections, and title deed completions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Preview Section */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#E8E5DE]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-1">
                Leadership
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#202020] font-semibold">
                Our Advisory Leadership
              </h2>
            </div>

            <Link
              to="/team"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#D6A536] hover:text-[#B98722] transition-colors pb-1 border-b border-[#D6A536]"
            >
              <span>Meet All Advisors ({VERIFIED_TEAM.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipPreview.map((member) => (
              <div key={member.id} className="bg-[#F5F4F0] border border-[#E8E5DE] rounded-lg overflow-hidden">
                <div className="aspect-[4/4.5] w-full overflow-hidden bg-[#E8E5DE]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-[#202020] font-semibold">{member.name}</h3>
                  <p className="text-xs text-[#666666] mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="py-16 lg:py-20 bg-[#F5F4F0]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 text-center max-w-2xl">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-2">
            Get in Touch
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#202020] font-semibold">
            Ready to Explore Dubai Real Estate?
          </h2>
          <p className="text-sm text-[#666666] mt-3 leading-relaxed">
            Contact our advisory desk in Business Bay for bespoke property suggestions and developer updates.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/contact"
              className="bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold px-8 py-3.5 rounded-md text-xs uppercase tracking-[0.14em] transition-colors shadow-xs"
            >
              Contact Our Advisors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
