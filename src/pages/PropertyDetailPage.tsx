import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Share2,
  Check,
} from 'lucide-react';
import { useDemoContext } from '../context/DemoContext';
import { PropertyCard } from '../components/PropertyCard';
import { GNS_CONFIG } from '../data/gnsData';

interface PropertyDetailPageProps {
  onOpenViewingModal: (title?: string, id?: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ onOpenViewingModal }) => {
  const { slug } = useParams<{ slug: string }>();
  const { properties, addEnquiry } = useDemoContext();

  const property = properties.find((p) => p.slug === slug);

  // Gallery Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Sticky enquiry form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Phone' | 'Email'>('WhatsApp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Keyboard navigation for gallery modal
  useEffect(() => {
    if (!lightboxOpen || !property) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev + 1) % property.gallery.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev - 1 + property.gallery.length) % property.gallery.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, property]);

  if (!property) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F5F4F0] px-6 py-20 text-center">
        <h2 className="font-serif text-3xl text-[#202020]">Property Not Found</h2>
        <p className="text-sm text-[#666666] mt-2 mb-6">
          The requested property record is currently unavailable.
        </p>
        <Link
          to="/properties"
          className="bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold px-6 py-2.5 rounded-md text-xs uppercase tracking-wider transition-colors"
        >
          Return to Properties
        </Link>
      </div>
    );
  }

  // Related properties without duplicates
  const relatedProperties = properties
    .filter((p) => p.id !== property.id && (p.category === property.category || p.developer === property.developer))
    .slice(0, 4);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addEnquiry({
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        propertyTitle: property.title,
        propertyId: property.id,
        message: message || `Inquiring about ${property.title} (${property.pricingNote})`,
        preferredContact,
        timeline: 'Within 30 Days',
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const whatsappUrl = `https://wa.me/${GNS_CONFIG.whatsapp}?text=${encodeURIComponent(
    `Hello GNS Real Estate, I would like to inquire about ${property.title} in ${property.location} (${property.pricingNote}).`
  )}`;

  return (
    <div id="property-detail-container" className="w-full bg-[#F5F4F0] py-8 sm:py-12 scroll-mt-20">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#666666] mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-[#D6A536] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/properties" className="hover:text-[#D6A536] transition-colors">
            Properties
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#202020] font-medium truncate max-w-xs">{property.title}</span>
        </nav>

        {/* Top Header Card */}
        <div className="bg-white border border-[#E8E5DE] rounded-lg p-6 sm:p-8 mb-8 shadow-xs flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#D6A536] font-semibold">
                {property.developer}
              </span>
              <span className="text-[#E8E5DE]">|</span>
              <span className="text-xs uppercase tracking-wider text-[#666666] font-medium">
                {property.category}
              </span>
              <span className="text-[#E8E5DE]">|</span>
              <span className="text-xs uppercase tracking-wider text-[#202020] font-semibold">
                {property.status}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#202020] font-semibold leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-1.5 text-sm text-[#666666]">
              <MapPin className="w-4 h-4 text-[#D6A536] shrink-0" />
              <span>
                {property.location} · {property.subLocation}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-[#666666] block">
                Starting Price
              </span>
              <span className="font-serif text-2xl sm:text-3xl text-[#202020] font-bold">
                {property.pricingNote}
              </span>
            </div>

            <button
              onClick={handleShare}
              type="button"
              className="p-3 bg-[#F5F4F0] hover:bg-white border border-[#E8E5DE] rounded-md text-[#666666] hover:text-[#202020] transition-colors"
              title="Copy share link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <section aria-label="Property Gallery" className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Primary Gallery Image */}
            <div
              onClick={() => {
                setActiveImageIndex(0);
                setLightboxOpen(true);
              }}
              className="md:col-span-8 relative aspect-[16/10] bg-white rounded-lg overflow-hidden cursor-pointer group border border-[#E8E5DE]"
            >
              <img
                src={property.gallery[0] || property.primaryImage}
                alt={`${property.title} view 1`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-4 left-4 bg-white/95 text-[#202020] px-3 py-1.5 rounded-sm text-xs font-semibold shadow-xs">
                Expand Gallery ({property.gallery.length} verified photos)
              </div>
            </div>

            {/* Secondary Thumbnails */}
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4">
              {property.gallery.slice(1, 3).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx + 1);
                    setLightboxOpen(true);
                  }}
                  className="relative aspect-[16/10] md:aspect-auto md:h-full bg-white rounded-lg overflow-hidden cursor-pointer group border border-[#E8E5DE]"
                >
                  <img
                    src={img}
                    alt={`${property.title} view ${idx + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Two-Column Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Facts, Overview, Highlights */}
          <div className="lg:col-span-7 space-y-8">
            {/* Facts Grid */}
            <div className="bg-white border border-[#E8E5DE] rounded-lg p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-2xl text-[#202020] font-semibold mb-6">
                Property Specifications
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                <div className="border-b border-[#E8E5DE] pb-3">
                  <span className="text-[11px] uppercase tracking-wider text-[#666666] block">
                    Bedrooms
                  </span>
                  <span className="font-semibold text-[#202020] mt-1 block">
                    {property.bedrooms}
                  </span>
                </div>

                <div className="border-b border-[#E8E5DE] pb-3">
                  <span className="text-[11px] uppercase tracking-wider text-[#666666] block">
                    Bathrooms
                  </span>
                  <span className="font-semibold text-[#202020] mt-1 block">
                    {property.bathrooms}
                  </span>
                </div>

                <div className="border-b border-[#E8E5DE] pb-3">
                  <span className="text-[11px] uppercase tracking-wider text-[#666666] block">
                    Area Scope
                  </span>
                  <span className="font-semibold text-[#202020] mt-1 block">
                    {property.areaRangeSqFt}
                  </span>
                </div>

                <div className="border-b border-[#E8E5DE] pb-3">
                  <span className="text-[11px] uppercase tracking-wider text-[#666666] block">
                    Developer
                  </span>
                  <span className="font-semibold text-[#202020] mt-1 block">
                    {property.developer}
                  </span>
                </div>

                <div className="border-b border-[#E8E5DE] pb-3">
                  <span className="text-[11px] uppercase tracking-wider text-[#666666] block">
                    Handover Status
                  </span>
                  <span className="font-semibold text-[#202020] mt-1 block">
                    {property.handoverDate || property.status}
                  </span>
                </div>

                <div className="border-b border-[#E8E5DE] pb-3">
                  <span className="text-[11px] uppercase tracking-wider text-[#666666] block">
                    Category
                  </span>
                  <span className="font-semibold text-[#202020] mt-1 block">
                    {property.category}
                  </span>
                </div>
              </div>

              {property.paymentPlan && (
                <div className="mt-6 pt-4 border-t border-[#E8E5DE] bg-[#F5F4F0] p-4 rounded-md text-xs">
                  <span className="font-semibold text-[#202020] uppercase tracking-wider block mb-1">
                    Payment Milestone Outline:
                  </span>
                  <p className="text-[#666666] leading-relaxed">{property.paymentPlan}</p>
                </div>
              )}
            </div>

            {/* Description & Overview */}
            <div className="bg-white border border-[#E8E5DE] rounded-lg p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-2xl text-[#202020] font-semibold mb-3">
                About the Development
              </h2>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="bg-white border border-[#E8E5DE] rounded-lg p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-2xl text-[#202020] font-semibold mb-6">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[#202020]">
                    <div className="w-5 h-5 bg-[#F5F4F0] border border-[#E8E5DE] rounded-full flex items-center justify-center text-[#D6A536] shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Desktop Enquiry Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-[#E8E5DE] rounded-lg p-6 sm:p-8 shadow-xs">
              <div className="border-b border-[#E8E5DE] pb-4 mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D6A536] font-semibold block">
                  Connect with GNS
                </span>
                <h3 className="font-serif text-2xl text-[#202020] font-semibold mt-1">
                  Enquire on this Property
                </h3>
                <p className="text-xs text-[#666666] mt-1">
                  Speak directly with an advisor handling {property.location}.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-6 text-center space-y-3 bg-[#F5F4F0] p-4 rounded-md border border-[#E8E5DE]">
                  <CheckCircle2 className="w-10 h-10 text-[#D6A536] mx-auto" />
                  <h4 className="font-serif text-lg text-[#202020] font-semibold">
                    Inquiry Received
                  </h4>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Thank you, {clientName}. Your inquiry regarding <strong className="text-[#202020]">{property.title}</strong> has been logged. An advisor will contact you via {preferredContact}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label htmlFor="detail-enq-name" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      id="detail-enq-name"
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] focus:outline-none focus:border-[#D6A536]"
                    />
                  </div>

                  <div>
                    <label htmlFor="detail-enq-email" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                      Email Address *
                    </label>
                    <input
                      id="detail-enq-email"
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] focus:outline-none focus:border-[#D6A536]"
                    />
                  </div>

                  <div>
                    <label htmlFor="detail-enq-phone" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="detail-enq-phone"
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+971 50 000 0000"
                      className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] font-mono focus:outline-none focus:border-[#D6A536]"
                    />
                  </div>

                  <div>
                    <label htmlFor="detail-enq-msg" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                      Notes
                    </label>
                    <textarea
                      id="detail-enq-msg"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`I am interested in pricing and availability for ${property.title}...`}
                      className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] focus:outline-none focus:border-[#D6A536]"
                    />
                  </div>

                  {/* Preferred Channel */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1.5">
                      Preferred Channel
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['WhatsApp', 'Phone', 'Email'] as const).map((channel) => (
                        <button
                          key={channel}
                          type="button"
                          onClick={() => setPreferredContact(channel)}
                          className={`py-2 text-[11px] font-medium border rounded-md text-center transition-colors ${
                            preferredContact === channel
                              ? 'bg-[#202020] text-white border-[#202020]'
                              : 'bg-[#F5F4F0] text-[#202020] border-[#E8E5DE]'
                          }`}
                        >
                          {channel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold py-3.5 rounded-md text-xs uppercase tracking-[0.14em] transition-colors shadow-xs"
                  >
                    {isSubmitting ? 'Transmitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}

              {/* Direct Viewing and WhatsApp Buttons */}
              <div className="mt-6 pt-6 border-t border-[#E8E5DE] space-y-3">
                <button
                  onClick={() => onOpenViewingModal(property.title, property.id)}
                  type="button"
                  className="w-full bg-[#202020] hover:bg-[#333333] text-white py-3 rounded-md text-xs uppercase tracking-[0.14em] font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#D6A536]" />
                  <span>Book Private Viewing</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-md text-xs uppercase tracking-[0.14em] font-semibold transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#E8E5DE]">
            <div className="mb-8">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-1">
                More Opportunities
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#202020] font-semibold">
                Similar Properties in Dubai
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProperties.map((rel) => (
                <PropertyCard key={rel.id} property={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery fullscreen view"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen gallery"
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/20 rounded-full transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>

          {property.gallery.length > 1 && (
            <button
              onClick={() =>
                setActiveImageIndex((prev) => (prev - 1 + property.gallery.length) % property.gallery.length)
              }
              aria-label="Previous photo"
              className="absolute left-6 text-white p-3 hover:bg-white/20 rounded-full transition-colors z-20"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}

          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={property.gallery[activeImageIndex]}
              alt={`${property.title} view ${activeImageIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-md shadow-2xl"
            />
            <div className="text-white text-xs mt-4 tracking-wider flex items-center gap-3">
              <span>
                Photo {activeImageIndex + 1} of {property.gallery.length}
              </span>
              <span className="text-white/40">·</span>
              <span>{property.title}</span>
            </div>
          </div>

          {property.gallery.length > 1 && (
            <button
              onClick={() => setActiveImageIndex((prev) => (prev + 1) % property.gallery.length)}
              aria-label="Next photo"
              className="absolute right-6 text-white p-3 hover:bg-white/20 rounded-full transition-colors z-20"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
