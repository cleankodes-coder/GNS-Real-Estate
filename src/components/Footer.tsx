import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare, ArrowUpRight } from 'lucide-react';
import { GNSLogo } from './GNSLogo';
import { GNS_CONFIG, VERIFIED_DEVELOPERS } from '../data/gnsData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F4F0] text-[#666666] border-t border-[#E8E5DE] pt-16 pb-12">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#E8E5DE]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <GNSLogo variant="light" />
            <p className="text-sm text-[#666666] leading-relaxed max-w-sm pt-2">
              Premier Dubai real estate brokerage offering professional guidance for residential acquisitions, off-plan developer launches, and private investments.
            </p>
            <div className="pt-2 text-xs text-[#202020] font-mono tracking-wider font-semibold">
              {GNS_CONFIG.reraOrLicense}
            </div>
          </div>

          {/* Properties Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base text-[#202020] font-semibold">
              Properties
            </h4>
            <ul className="space-y-2.5 text-sm text-[#666666]">
              <li>
                <Link to="/properties" className="hover:text-[#D6A536] transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Off-plan" className="hover:text-[#D6A536] transition-colors">
                  Off-Plan Projects
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Villas%20%26%20Townhouses" className="hover:text-[#D6A536] transition-colors">
                  Villas & Townhouses
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Apartments" className="hover:text-[#D6A536] transition-colors">
                  Apartments
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Penthouses" className="hover:text-[#D6A536] transition-colors">
                  Penthouses
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base text-[#202020] font-semibold">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-[#666666]">
              <li>
                <Link to="/about" className="hover:text-[#D6A536] transition-colors">
                  About GNS
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-[#D6A536] transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D6A536] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/demo-workspace"
                  className="text-[#D6A536] hover:text-[#B98722] text-xs transition-colors flex items-center gap-1 font-semibold"
                >
                  <span>Demo Workspace</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-base text-[#202020] font-semibold">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-[#666666]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6A536] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{GNS_CONFIG.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D6A536] shrink-0" />
                <a href={`tel:${GNS_CONFIG.phone.replace(/\s+/g, '')}`} className="text-xs hover:text-[#202020] font-mono">
                  {GNS_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#D6A536] shrink-0" />
                <a
                  href={`https://wa.me/${GNS_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:text-[#202020]"
                >
                  WhatsApp: {GNS_CONFIG.whatsappFormatted}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D6A536] shrink-0" />
                <a href={`mailto:${GNS_CONFIG.email}`} className="text-xs hover:text-[#202020]">
                  {GNS_CONFIG.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Mentions */}
        <div className="py-6 border-b border-[#E8E5DE] flex flex-wrap items-center justify-between gap-4 text-xs text-[#666666]">
          <span className="uppercase tracking-wider text-[11px] text-[#202020] font-semibold">
            Leading Master Developers
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {VERIFIED_DEVELOPERS.map((dev) => (
              <span key={dev.id} className="hover:text-[#202020] transition-colors">
                {dev.name}
              </span>
            ))}
          </div>
        </div>

        {/* Subtle Copyright Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <p>© {new Date().getFullYear()} GNS Real Estate. All rights reserved. RERA Registered Brokerage.</p>
          <p className="text-[11px] text-[#666666]/80 text-right">
            GNS Real Estate represents properties from multiple developers and is not the master developer.
          </p>
        </div>
      </div>
    </footer>
  );
};
