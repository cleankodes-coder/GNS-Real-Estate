import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';
import { GNSLogo } from './GNSLogo';
import { GNS_CONFIG } from '../data/gnsData';

interface HeaderProps {
  onOpenViewingModal?: (propertyTitle?: string, propertyId?: string) => void;
  onOpenEnquiry?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenViewingModal, onOpenEnquiry }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Properties', to: '/properties' },
    { label: 'Communities', to: '/#communities' },
    { label: 'About', to: '/about' },
    { label: 'Our Team', to: '/team' },
    { label: 'Contact', to: '/contact' },
  ];

  const isActive = (to: string) => {
    if (to.startsWith('/#')) return false;
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 bg-white border-b border-[#E8E5DE] ${
          isScrolled ? 'h-[74px] shadow-xs' : 'h-[80px]'
        }`}
      >
        <div className="max-w-[1240px] mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
          {/* Original GNS Logo left */}
          <Link
            to="/"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A536]"
            aria-label="GNS Real Estate Home"
          >
            <GNSLogo variant="light" />
          </Link>

          {/* Navigation centre */}
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#202020]">
            {navLinks.map((link) => {
              if (link.to.startsWith('/#')) {
                return (
                  <a
                    key={link.label}
                    href={link.to}
                    className="py-1 transition-colors hover:text-[#D6A536]"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-1 transition-colors relative hover:text-[#D6A536] ${
                    isActive(link.to)
                      ? 'text-[#D6A536] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D6A536]'
                      : 'text-[#202020]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Gold Enquire Now button right */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => (onOpenEnquiry ? onOpenEnquiry() : onOpenViewingModal?.())}
              type="button"
              className="bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold px-6 py-2.5 rounded-md text-xs uppercase tracking-[0.14em] transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202020]"
            >
              Enquire Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 text-[#202020] hover:text-[#D6A536] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A536]"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50 bg-white text-[#202020] pt-20 px-6 pb-8 flex flex-col justify-between overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-6 border-b border-[#E8E5DE]">
            <GNSLogo variant="light" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#202020] hover:text-[#D6A536]"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-5 py-6 text-lg font-serif">
            {navLinks.map((link) => {
              if (link.to.startsWith('/#')) {
                return (
                  <a
                    key={link.label}
                    href={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1 text-xl border-b border-[#E8E5DE] pb-2 text-[#202020] hover:text-[#D6A536]"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-1 text-xl border-b border-[#E8E5DE] pb-2 ${
                    isActive(link.to) ? 'text-[#D6A536] font-semibold' : 'text-[#202020]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/demo-workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs tracking-wider text-[#666666] uppercase pt-2"
            >
              Internal Demo Workspace
            </Link>
          </nav>

          <div className="space-y-4 pt-4 border-t border-[#E8E5DE]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenEnquiry) onOpenEnquiry();
                else onOpenViewingModal?.();
              }}
              type="button"
              className="w-full py-3.5 bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold text-xs uppercase tracking-wider text-center rounded-md"
            >
              Enquire Now
            </button>

            <div className="flex items-center justify-between text-xs text-[#666666] pt-1">
              <a href={`tel:${GNS_CONFIG.phone.replace(/\s+/g, '')}`} className="font-mono">
                {GNS_CONFIG.phone}
              </a>
              <span>·</span>
              <a
                href={`https://wa.me/${GNS_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D6A536] font-medium"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent fixed header overlap */}
      <div className="h-[80px]" />
    </>
  );
};
