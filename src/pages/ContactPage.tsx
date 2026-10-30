import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageSquare, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useDemoContext } from '../context/DemoContext';
import { GNS_CONFIG } from '../data/gnsData';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestedAdvisor = searchParams.get('advisor') || '';

  const { addEnquiry } = useDemoContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [timeline, setTimeline] = useState('Immediate (Next 30 Days)');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Phone' | 'Email'>('WhatsApp');
  const [message, setMessage] = useState(
    requestedAdvisor ? `I would like to speak directly with ${requestedAdvisor}.` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addEnquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        preferredContact,
        timeline,
        propertyTitle: requestedAdvisor ? `Advisory Request: ${requestedAdvisor}` : 'General Brokerage Inquiry',
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  return (
    <div id="contact-page-container" className="w-full bg-[#F5F4F0] py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Page Header Card */}
        <div className="bg-white border border-[#E8E5DE] rounded-lg p-8 sm:p-10 mb-8 shadow-xs">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D6A536] font-semibold block mb-2">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[#202020] font-semibold leading-tight">
            Contact GNS Real Estate
          </h1>
          <p className="text-sm text-[#666666] mt-2 max-w-2xl leading-relaxed">
            Connect with our advisory desk in Business Bay for bespoke inquiries, viewing schedules, or general consultation.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Real Contact Methods */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8E5DE] rounded-lg p-8 space-y-6 shadow-xs">
              <h2 className="font-serif text-2xl text-[#202020] font-semibold border-b border-[#E8E5DE] pb-4">
                Office Information
              </h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md flex items-center justify-center text-[#D6A536] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#666666] block">
                      Office Address
                    </span>
                    <p className="text-[#202020] font-medium mt-0.5 leading-relaxed">
                      {GNS_CONFIG.officeAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md flex items-center justify-center text-[#D6A536] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#666666] block">
                      Direct Telephone
                    </span>
                    <a
                      href={`tel:${GNS_CONFIG.phone.replace(/\s+/g, '')}`}
                      className="text-[#202020] font-mono font-medium hover:text-[#D6A536] transition-colors mt-0.5 block"
                    >
                      {GNS_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md flex items-center justify-center text-[#D6A536] shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#666666] block">
                      Direct WhatsApp
                    </span>
                    <a
                      href={`https://wa.me/${GNS_CONFIG.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D6A536] font-medium hover:underline mt-0.5 block"
                    >
                      {GNS_CONFIG.whatsappFormatted}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md flex items-center justify-center text-[#D6A536] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#666666] block">
                      Official Email
                    </span>
                    <a href={`mailto:${GNS_CONFIG.email}`} className="text-[#202020] font-medium hover:text-[#D6A536] transition-colors mt-0.5 block">
                      {GNS_CONFIG.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8E5DE]">
                <div className="flex items-center gap-2 text-xs text-[#202020] font-mono font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#D6A536] shrink-0" />
                  <span>{GNS_CONFIG.reraOrLicense}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-7 bg-white border border-[#E8E5DE] rounded-lg p-8 sm:p-10 shadow-xs">
            <div className="border-b border-[#E8E5DE] pb-4 mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#202020] font-semibold">
                Send an Enquiry
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">
                Please complete the form below to connect with an advisor.
              </p>
            </div>

            {isSuccess ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#202020] font-semibold">
                  Inquiry Registered
                </h3>
                <p className="text-sm text-[#666666] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your message has been logged. An assigned advisor will reach out to you via {preferredContact}.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    type="button"
                    className="bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold px-6 py-2.5 rounded-md text-xs uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label htmlFor="contact-form-name" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                    Your Name *
                  </label>
                  <input
                    id="contact-form-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] focus:outline-none focus:border-[#D6A536]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-form-email" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                      Email Address *
                    </label>
                    <input
                      id="contact-form-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] focus:outline-none focus:border-[#D6A536]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-form-phone" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="contact-form-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 000 0000"
                      className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] font-mono focus:outline-none focus:border-[#D6A536]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-form-timeline" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                      Timeline
                    </label>
                    <select
                      id="contact-form-timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] focus:outline-none cursor-pointer"
                    >
                      <option value="Immediate (Next 30 Days)">Immediate (Next 30 Days)</option>
                      <option value="1 to 3 Months">1 to 3 Months</option>
                      <option value="3 to 6 Months">3 to 6 Months</option>
                      <option value="Exploring Market">Exploring Market</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                      Preferred Channel
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['WhatsApp', 'Phone', 'Email'] as const).map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setPreferredContact(ch)}
                          className={`py-2 text-[11px] font-medium border rounded-md text-center transition-colors ${
                            preferredContact === ch
                              ? 'bg-[#202020] text-white border-[#202020]'
                              : 'bg-[#F5F4F0] text-[#202020] border-[#E8E5DE]'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-form-message" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                    Your Requirements & Questions *
                  </label>
                  <textarea
                    id="contact-form-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what areas, developer launches, or property sizes you are seeking..."
                    className="w-full bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3.5 py-2.5 text-xs text-[#202020] focus:outline-none focus:border-[#D6A536]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold py-3.5 rounded-md text-xs uppercase tracking-[0.14em] transition-colors shadow-xs"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
