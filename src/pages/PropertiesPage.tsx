import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { useDemoContext } from '../context/DemoContext';
import { PROPERTY_CATEGORIES } from '../data/gnsData';
import { propertyMatchesBedrooms, findClosestProperties } from '../data/websiteControl';

export const PropertiesPage: React.FC = () => {
  const { properties } = useDemoContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query parameters
  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const currentBedrooms = searchParams.get('bedrooms') || '';
  const currentMaxBudgetStr = searchParams.get('maxBudget') || '';
  const currentMaxBudget = currentMaxBudgetStr ? Number(currentMaxBudgetStr) : undefined;

  // Synchronised filter handlers
  const handleCategoryChange = (category: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', category);
    }
    setSearchParams(nextParams, { replace: false });
  };

  const handleSearchChange = (q: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!q) {
      nextParams.delete('q');
    } else {
      nextParams.set('q', q);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const removeFilter = (key: 'category' | 'q' | 'bedrooms' | 'maxBudget') => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(key);
    setSearchParams(nextParams, { replace: false });
  };

  const handleClearFilters = () => {
    setSearchParams({}, { replace: false });
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Category filter
      if (currentCategory !== 'All' && prop.category !== currentCategory) {
        return false;
      }

      // Keyword / location search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLocation = prop.location.toLowerCase().includes(query);
        const matchesSubLocation = prop.subLocation.toLowerCase().includes(query);
        const matchesDeveloper = prop.developer.toLowerCase().includes(query);
        const matchesCategory = prop.category.toLowerCase().includes(query);

        if (!matchesTitle && !matchesLocation && !matchesSubLocation && !matchesDeveloper && !matchesCategory) {
          return false;
        }
      }

      // Bedrooms filter
      if (currentBedrooms && !propertyMatchesBedrooms(prop.bedrooms, currentBedrooms)) {
        return false;
      }

      // Max budget filter
      if (currentMaxBudget && prop.startingPriceAED > currentMaxBudget) {
        return false;
      }

      return true;
    });
  }, [properties, currentCategory, searchQuery, currentBedrooms, currentMaxBudget]);

  // Closest recommendations when 0 properties match
  const closestProperties = useMemo(() => {
    if (filteredProperties.length > 0) return [];
    return findClosestProperties({
      location: searchQuery,
      bedrooms: currentBedrooms,
      max_budget: currentMaxBudget,
      type: currentCategory !== 'All' ? currentCategory : undefined,
    });
  }, [filteredProperties.length, searchQuery, currentBedrooms, currentMaxBudget, currentCategory]);

  const hasActiveFilters =
    currentCategory !== 'All' ||
    !!searchQuery.trim() ||
    !!currentBedrooms ||
    !!currentMaxBudget;

  return (
    <div id="properties-page-container" className="w-full bg-[#F5F4F0] min-h-screen py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Page Banner & Header */}
        <div className="bg-white border border-[#E8E5DE] rounded-lg p-8 sm:p-10 mb-8 shadow-xs">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-2">
            Dubai Property Inventory
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[#202020] font-semibold leading-tight">
            Explore Dubai Properties
          </h1>
          <p className="text-sm text-[#666666] mt-2 max-w-2xl leading-relaxed">
            Browse our verified inventory of apartments, off-plan projects, and luxury villas across Dubai’s most desirable communities.
          </p>
        </div>

        {/* Functional Search / Filter Toolbar */}
        <div className="bg-white border border-[#E8E5DE] rounded-lg p-5 sm:p-6 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Category Segmented Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {PROPERTY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  type="button"
                  className={`px-4 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors border ${
                    currentCategory === cat
                      ? 'bg-[#D6A536] text-[#202020] border-[#D6A536] shadow-xs'
                      : 'bg-[#F5F4F0] text-[#666666] border-[#E8E5DE] hover:border-[#202020]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Keyword / Location Search Input */}
            <div className="flex items-center gap-2 w-full lg:w-80">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#D6A536] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search community, developer..."
                  className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-md pl-9 pr-8 py-2 text-xs text-[#202020] placeholder:text-[#666666] focus:outline-none focus:border-[#D6A536]"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    type="button"
                    aria-label="Clear search input"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#202020]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#E8E5DE]">
              <span className="text-[11px] text-[#666666] uppercase tracking-wider font-semibold mr-1">
                Active Criteria:
              </span>
              {currentCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F4F0] border border-[#E8E5DE] rounded-sm text-xs text-[#202020]">
                  <span>Type: {currentCategory}</span>
                  <button onClick={() => removeFilter('category')} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F4F0] border border-[#E8E5DE] rounded-sm text-xs text-[#202020]">
                  <span>Keyword: "{searchQuery}"</span>
                  <button onClick={() => removeFilter('q')} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {currentBedrooms && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F4F0] border border-[#E8E5DE] rounded-sm text-xs text-[#202020]">
                  <span>Bedrooms: {currentBedrooms}</span>
                  <button onClick={() => removeFilter('bedrooms')} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {currentMaxBudget && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F4F0] border border-[#E8E5DE] rounded-sm text-xs text-[#202020]">
                  <span>Max Budget: AED {currentMaxBudget.toLocaleString()}</span>
                  <button onClick={() => removeFilter('maxBudget')} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                type="button"
                className="inline-flex items-center gap-1 text-xs text-[#D6A536] hover:text-[#B98722] font-semibold ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-3 pt-3 border-t border-[#E8E5DE] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="text-[#666666]">
              Showing <span className="font-semibold text-[#202020]">{filteredProperties.length}</span> of{' '}
              <span className="font-semibold text-[#202020]">{properties.length}</span> verified properties
            </div>
          </div>
        </div>

        {/* 4 Columns Grid */}
        <div id="properties-grid" className="scroll-mt-24 transition-all duration-300">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Honest no-match card */}
              <div className="bg-white border border-[#E8E5DE] rounded-lg p-10 text-center max-w-xl mx-auto shadow-xs">
                <SlidersHorizontal className="w-10 h-10 text-[#666666]/40 mx-auto mb-3" />
                <h3 className="font-serif text-2xl text-[#202020] font-semibold">
                  No Matching Properties Found
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] mt-2 leading-relaxed">
                  No verified developments in our portfolio match all of your exact search parameters.
                </p>
                <div className="mt-5">
                  <button
                    onClick={handleClearFilters}
                    type="button"
                    className="bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold px-6 py-2.5 rounded-md text-xs uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Closest Recommended Alternatives */}
              {closestProperties.length > 0 && (
                <div className="bg-white border border-[#E8E5DE] rounded-lg p-8 shadow-xs">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-[#D6A536]" />
                    <div>
                      <h4 className="font-serif text-xl text-[#202020] font-semibold">
                        Closest Verified Options from GNS Portfolio
                      </h4>
                      <p className="text-xs text-[#666666] mt-0.5">
                        These prime developments represent our closest available alternatives:
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {closestProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
