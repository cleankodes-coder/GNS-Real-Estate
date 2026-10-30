import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { GNS_CONFIG, PROPERTY_CATEGORIES } from '../data/gnsData';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    if (selectedCategory && selectedCategory !== 'All') {
      params.set('category', selectedCategory);
    }
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative w-full min-h-[560px] lg:h-[620px] flex items-center justify-center overflow-hidden bg-[#202020]">
      {/* Full-width Dubai Property Photograph */}
      <img
        src={GNS_CONFIG.heroPosterImage}
        alt="Dubai Waterfront Skyline and Developments"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />

      {/* Balanced Dark Overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-brightness-95" />

      {/* Centred Hero Content (101 Style) */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-5 sm:px-8 py-14 sm:py-16 text-center flex flex-col items-center">
        {/* Playfair Display Headline (56–64px desktop, 36–40px mobile, selected words in gold) */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-white text-4xl sm:text-5xl lg:text-[62px] font-semibold leading-[1.12] tracking-normal"
        >
          Find Your <span className="text-[#D6A536]">Home.</span>
          <br />
          Build Your <span className="text-[#D6A536]">Future.</span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-white/90 text-base sm:text-lg max-w-xl mx-auto mt-4 leading-relaxed font-normal"
        >
          Explore Dubai homes and investment opportunities with GNS Real Estate.
        </motion.p>

        {/* Compact Search Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-full max-w-3xl mt-8 sm:mt-10"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-3 sm:p-4 rounded-lg shadow-xl border border-[#E8E5DE]"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Project or Location Keyword */}
              <div className="flex-1 w-full flex items-center gap-2.5 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5">
                <Search className="w-4 h-4 text-[#D6A536] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Project, location, or developer name..."
                  className="w-full bg-transparent text-sm text-[#202020] placeholder:text-[#666666] focus:outline-none"
                />
              </div>

              {/* Existing Property Category */}
              <div className="w-full sm:w-56 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#202020] font-medium focus:outline-none cursor-pointer"
                  aria-label="Filter by property category"
                >
                  {PROPERTY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gold Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold px-8 py-3 rounded-md text-xs uppercase tracking-[0.14em] transition-colors shadow-xs shrink-0"
              >
                Search
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
