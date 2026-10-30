import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { PropertyItem } from '../data/gnsData';

interface PropertyCardProps {
  property: PropertyItem;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, className = '' }) => {
  return (
    <article
      className={`group bg-white border border-[#E8E5DE] rounded-lg flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#D6A536]/60 ${className}`}
    >
      <Link
        to={`/properties/${property.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A536]"
        aria-label={`View ${property.title}`}
      >
        {/* Consistent Image Proportion with subtle hover zoom */}
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#F5F4F0]">
          <img
            src={property.primaryImage}
            alt={property.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* Restrained Category Badge */}
          <div className="absolute top-3 left-3 bg-white/95 text-[#202020] px-2.5 py-1 rounded-sm text-[11px] font-semibold tracking-wider uppercase shadow-xs">
            {property.category}
          </div>

          {property.status && (
            <div className="absolute bottom-3 right-3 bg-[#202020]/85 text-white px-2.5 py-0.5 rounded-sm text-[10px] font-medium tracking-wider uppercase">
              {property.status}
            </div>
          )}
        </div>

        {/* Content Area with equal-height alignment */}
        <div className="p-5 flex flex-col flex-1">
          {/* Developer */}
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#D6A536] font-semibold mb-1 block">
            {property.developer}
          </span>

          {/* Project Title (17–19px) */}
          <h3 className="font-serif text-[18px] text-[#202020] font-semibold leading-snug group-hover:text-[#D6A536] transition-colors line-clamp-1">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#666666] mt-2">
            <MapPin className="w-3.5 h-3.5 text-[#D6A536] shrink-0" />
            <span className="truncate">
              {property.location} · {property.subLocation}
            </span>
          </div>

          {/* Facts (Bedrooms / Area) */}
          <div className="text-xs text-[#666666] mt-3 pt-3 border-t border-[#E8E5DE] flex items-center gap-2">
            <span>{property.bedrooms}</span>
            <span aria-hidden="true" className="text-[#E8E5DE]">·</span>
            <span>{property.areaRangeSqFt}</span>
          </div>
        </div>
      </Link>

      {/* Aligned Card Footer */}
      <div className="px-5 py-3.5 bg-[#F5F4F0] border-t border-[#E8E5DE] flex items-center justify-between mt-auto">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#666666] block">
            Starting Price
          </span>
          <span className="text-xs sm:text-sm font-semibold text-[#202020]">
            {property.pricingNote}
          </span>
        </div>

        <Link
          to={`/properties/${property.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#D6A536] hover:text-[#B98722] transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
