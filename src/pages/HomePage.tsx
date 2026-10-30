import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, MessageSquare, CheckCircle2, Building, Home, Users } from 'lucide-react';
import { Hero } from '../components/Hero';
import { DeveloperStrip } from '../components/DeveloperStrip';
import { PropertyCard } from '../components/PropertyCard';
import { useDemoContext } from '../context/DemoContext';
import { VERIFIED_COMMUNITIES, VERIFIED_TEAM, GNS_CONFIG } from '../data/gnsData';

interface HomePageProps {
  onOpenViewingModal: (title?: string, id?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenViewingModal }) => {
  const { properties, addEnquiry } = useDemoContext();
  const navigate = useNavigate();

  // 4. Featured / Off-Plan Properties: 4 columns on wide desktop
  const featuredProperties = properties.slice(0, 4);

  // 5. Villas & Townhouses: 3 cards across desktop
  const villaProperties = properties.filter((p) => p.category === 'Villas & Townhouses');
  const displayVillas =
    villaProperties.length >= 3
      ? villaProperties.slice(0, 3)
      : properties.filter((p) => p.category === 'Villas & Townhouses' || p.category === 'Penthouses').slice(0, 3);

  // 7. Team Selection (3 members)
  const teamPreview = VERIFIED_TEAM.slice(0, 3);

  // 8. Compact Enquiry Section Form
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addEnquiry({
        name: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        message: clientMessage.trim() || 'General consultation request from homepage enquiry form.',
        preferredContact: 'WhatsApp',
        timeline: 'Within 30 Days',
        propertyTitle: 'Homepage Consultation Form',
      });
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  // Helper to count properties for each community
  const getCommunityPropertyCount = (communityQuery: string) => {
    const q = communityQuery.toLowerCase();
    const count = properties.filter(
      (p) =>
        p.location.toLowerCase().includes(q) ||
        p.subLocation.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)
    ).length;
    return count > 0 ? `${count} ${count === 1 ? 'Property' : 'Properties'}` : '1 Property';
  };

  return (
    <div className="w-full bg-white text-[#202020]">
      {/* 1. HERO (Playfair Centred Headline, Gold Highlights, Compact Search) */}
      <Hero />

      {/* 2. DEVELOPER LOGOS (White background, small gold label, balanced row) */}
      <DeveloperStrip />

      {/* 3. COMMUNITIES (#F5F4F0 Alternate background, 3-column image tiles) */}
      <section id="communities" className="py-16 lg:py-20 bg-[#F5F4F0] border-b border-[#E8E5DE]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-2">
              Prime Destinations
            </span>
            <h2 className="font-serif text-3xl sm:text-[36px] text-[#202020] font-semibold leading-tight">
              Explore Popular Dubai Communities
            </h2>
            <p className="text-sm text-[#666666] mt-2">
              Discover residential enclaves offering waterfront promenades, golf fairways, and city skyline living.
            </p>
          </div>

          {/* Three-Column Image-Tile Composition (3 cols desktop, 2 cols tablet, 1 mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VERIFIED_COMMUNITIES.map((comm) => (
              <Link
                key={comm.id}
                to={`/properties?q=${encodeURIComponent(comm.queryParam)}`}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E8E5DE] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A536]"
              >
                <img
                  src={comm.image}
                  alt={comm.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="text-xs font-semibold text-[#D6A536] uppercase tracking-wider block mb-1">
                    {getCommunityPropertyCount(comm.queryParam)}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold leading-snug group-hover:text-[#D6A536] transition-colors">
                    {comm.name}
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-1">
                    {comm.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED / OFF-PLAN PROPERTIES (White background, 4 columns on wide desktop) */}
      <section id="featured-properties" className="py-16 lg:py-20 bg-white border-b border-[#E8E5DE] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-1">
                Featured Launches
              </span>
              <h2 className="font-serif text-3xl sm:text-[36px] text-[#202020] font-semibold leading-tight">
                Featured Properties & Launches
              </h2>
            </div>

            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#D6A536] hover:text-[#B98722] transition-colors pb-1 border-b border-[#D6A536]"
            >
              <span>View All Properties ({properties.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 4 Columns on wide desktop, 2 on tablet, 1 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. VILLAS AND TOWNHOUSES (#F5F4F0 Alternate background, 3 larger cards) */}
      <section id="villas" className="py-16 lg:py-20 bg-[#F5F4F0] border-b border-[#E8E5DE] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-1">
                Exclusive Enclaves
              </span>
              <h2 className="font-serif text-3xl sm:text-[36px] text-[#202020] font-semibold leading-tight">
                Villas and Townhouses
              </h2>
            </div>

            <Link
              to="/properties?category=Villas%20%26%20Townhouses"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#D6A536] hover:text-[#B98722] transition-colors pb-1 border-b border-[#D6A536]"
            >
              <span>Explore All Villas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Larger Cards across desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayVillas.map((villa) => (
              <PropertyCard key={villa.id} property={villa} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. ABOUT GNS (White background, concise company intro, relevant image, gold button) */}
      <section id="about-gns" className="py-16 lg:py-20 bg-white border-b border-[#E8E5DE] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Relevant Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E8E5DE] shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85"
                  alt="Dubai Modern Waterfront Residence"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right: Concise Introduction & Button */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block">
                About GNS Real Estate
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#202020] font-semibold leading-tight">
                Your Trusted Partner in Dubai Real Estate
              </h2>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                GNS Real Estate is a licensed brokerage based in Business Bay, Dubai. We represent buyers, private investors, and family offices looking to acquire residential homes and off-plan opportunities from leading developers.
              </p>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                With comprehensive market insights and direct developer relations across Emaar, DAMAC, Nakheel, and Danube, our advisors guide you through every step with transparency and care.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold px-6 py-3 rounded-md text-xs uppercase tracking-[0.14em] transition-colors shadow-xs"
                >
                  <span>About GNS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TEAM (#F5F4F0 Alternate background, real portraits, names, roles) */}
      <section id="team-preview" className="py-16 lg:py-20 bg-[#F5F4F0] border-b border-[#E8E5DE] scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-1">
                Our Experts
              </span>
              <h2 className="font-serif text-3xl sm:text-[36px] text-[#202020] font-semibold leading-tight">
                Meet Our Professional Advisors
              </h2>
            </div>

            <Link
              to="/team"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#D6A536] hover:text-[#B98722] transition-colors pb-1 border-b border-[#D6A536]"
            >
              <span>View Full Team ({VERIFIED_TEAM.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamPreview.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-[#E8E5DE] rounded-lg overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[4/4.5] w-full overflow-hidden bg-[#F5F4F0]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[10px] uppercase tracking-wider text-[#D6A536] font-semibold block mb-1">
                    {member.department}
                  </span>
                  <h3 className="font-serif text-xl text-[#202020] font-semibold">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#666666] font-medium mt-1">
                    {member.role}
                  </p>
                  <p className="text-xs text-[#666666] mt-3 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. ENQUIRY SECTION (White background, clear compact form, phone & WhatsApp) */}
      <section id="enquiry-section" className="py-16 lg:py-20 bg-white scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-2">
                  Get in Touch
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#202020] font-semibold leading-tight">
                  Start Your Property Journey with GNS
                </h2>
                <p className="text-sm text-[#666666] mt-3 leading-relaxed">
                  Have questions about property prices, developer payment milestones, or scheduling an in-person viewing? Our team is here to assist.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <a
                  href={`tel:${GNS_CONFIG.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 p-4 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md hover:border-[#D6A536] transition-colors group"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#D6A536] shadow-2xs group-hover:bg-[#D6A536] group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#666666] block">
                      Call Direct
                    </span>
                    <span className="font-mono text-sm font-semibold text-[#202020]">
                      {GNS_CONFIG.phone}
                    </span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${GNS_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md hover:border-[#D6A536] transition-colors group"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#666666] block">
                      Instant WhatsApp
                    </span>
                    <span className="text-sm font-semibold text-[#202020]">
                      {GNS_CONFIG.whatsappFormatted}
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Right: Compact Enquiry Form */}
            <div className="lg:col-span-7 bg-[#F5F4F0] border border-[#E8E5DE] rounded-lg p-6 sm:p-8">
              <h3 className="font-serif text-2xl text-[#202020] font-semibold mb-1">
                Quick Enquiry
              </h3>
              <p className="text-xs text-[#666666] mb-6">
                Fill in the details below and an advisor will contact you promptly.
              </p>

              {isSuccess ? (
                <div className="py-8 text-center space-y-3 bg-white p-6 rounded-md border border-[#E8E5DE]">
                  <CheckCircle2 className="w-12 h-12 text-[#D6A536] mx-auto" />
                  <h4 className="font-serif text-xl text-[#202020] font-semibold">
                    Inquiry Received
                  </h4>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                    Thank you, {clientName}. Your inquiry has been registered. An advisor will reach out shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label htmlFor="home-enq-name" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      id="home-enq-name"
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Alexander Sterling"
                      className="w-full bg-white border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] focus:outline-none focus:border-[#D6A536]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="home-enq-email" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                        Email Address *
                      </label>
                      <input
                        id="home-enq-email"
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="client@domain.com"
                        className="w-full bg-white border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] focus:outline-none focus:border-[#D6A536]"
                      />
                    </div>

                    <div>
                      <label htmlFor="home-enq-phone" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                        Phone Number *
                      </label>
                      <input
                        id="home-enq-phone"
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+971 50 000 0000"
                        className="w-full bg-white border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] font-mono focus:outline-none focus:border-[#D6A536]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="home-enq-msg" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                      Message / Criteria
                    </label>
                    <textarea
                      id="home-enq-msg"
                      rows={3}
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      placeholder="I am interested in apartments or off-plan villas in Dubai..."
                      className="w-full bg-white border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] focus:outline-none focus:border-[#D6A536]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold py-3.5 rounded-md text-xs uppercase tracking-[0.14em] transition-colors shadow-xs"
                  >
                    {isSubmitting ? 'Sending Inquiry...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
