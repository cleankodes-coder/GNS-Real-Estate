import React from 'react';

interface GNSLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export const GNSLogo: React.FC<GNSLogoProps> = ({
  className = 'h-9',
  variant = 'dark',
  showSubtitle = true,
}) => {
  const isLightMode = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Monogram Seal with geometric architectural symmetry */}
      <div
        className={`relative flex items-center justify-center w-10 h-10 border transition-colors ${
          isLightMode
            ? 'border-[#202020] bg-white text-[#202020]'
            : 'border-[#D6A536] bg-[#202020] text-white'
        }`}
        style={{ borderWidth: '1.25px' }}
      >
        <span className="font-serif text-lg tracking-wider font-bold text-[#D6A536]">
          G<span className={isLightMode ? 'text-[#202020]' : 'text-white'}>N</span>S
        </span>
        {/* Subtle architectural corner accents */}
        <div className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-[#D6A536]" />
        <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-[#D6A536]" />
      </div>

      {/* Brand Title and Location */}
      <div className="flex flex-col text-left">
        <span
          className={`font-serif tracking-[0.16em] text-sm md:text-base font-bold leading-none ${
            isLightMode ? 'text-[#202020]' : 'text-white'
          }`}
        >
          GNS REAL ESTATE
        </span>
        {showSubtitle && (
          <span
            className={`font-sans tracking-[0.24em] text-[9px] uppercase font-medium mt-1 ${
              isLightMode ? 'text-[#666666]' : 'text-[#E8E5DE]'
            }`}
          >
            DUBAI · BROKERAGE
          </span>
        )}
      </div>
    </div>
  );
};
