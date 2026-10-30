import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Mail, Phone, Video, MapPin } from 'lucide-react';
import { useDemoContext } from '../context/DemoContext';
import { GNS_CONFIG } from '../data/gnsData';

interface ViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
  propertyId?: string;
}

export const ViewingModal: React.FC<ViewingModalProps> = ({
  isOpen,
  onClose,
  propertyTitle = 'General Portfolio',
  propertyId = 'general',
}) => {
  const { addViewing } = useDemoContext();
  const modalRef = useRef<HTMLDivElement>(null);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [viewingType, setViewingType] = useState<'In-Person VIP Tour' | 'Live Encrypted Video Tour'>('In-Person VIP Tour');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 GST');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Keyboard Escape listener & scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim() || !preferredDate) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addViewing({
        propertyId,
        propertyTitle,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim(),
        viewingType,
        preferredDate,
        preferredTime,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setPreferredDate('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewing-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white border border-[#E8E5DE] rounded-lg shadow-2xl p-6 sm:p-8 text-[#202020] max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close viewing modal"
          className="absolute top-5 right-5 p-1.5 text-[#666666] hover:text-[#202020] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A536]"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-[#202020] font-semibold">
              Viewing Request Logged
            </h3>
            <p className="text-sm text-[#666666] leading-relaxed max-w-md mx-auto">
              Your appointment request for <strong className="text-[#202020]">{propertyTitle}</strong> has been received. A GNS advisor will confirm arrangements with you on {clientPhone}.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleReset}
                type="button"
                className="bg-[#D6A536] hover:bg-[#B98722] text-[#202020] font-semibold px-6 py-2.5 rounded-md text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#E8E5DE] pb-4 mb-5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D6A536] font-semibold block">
                Private Viewing
              </span>
              <h2 id="viewing-modal-title" className="font-serif text-2xl sm:text-3xl text-[#202020] font-semibold mt-1">
                Book a Private Viewing
              </h2>
              <p className="text-xs text-[#666666] mt-1">
                Property: <span className="font-semibold text-[#202020]">{propertyTitle}</span>
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tour Format */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-2">
                  Tour Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingType('In-Person VIP Tour')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs font-semibold border transition-colors ${
                      viewingType === 'In-Person VIP Tour'
                        ? 'bg-[#202020] text-white border-[#202020]'
                        : 'bg-[#F5F4F0] text-[#202020] border-[#E8E5DE] hover:border-[#202020]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#D6A536]" />
                    <span>In-Person Tour</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewingType('Live Encrypted Video Tour')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs font-semibold border transition-colors ${
                      viewingType === 'Live Encrypted Video Tour'
                        ? 'bg-[#202020] text-white border-[#202020]'
                        : 'bg-[#F5F4F0] text-[#202020] border-[#E8E5DE] hover:border-[#202020]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-[#D6A536]" />
                    <span>Video Tour</span>
                  </button>
                </div>
              </div>

              {/* Client Name */}
              <div>
                <label htmlFor="modal-name-input" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                  Full Name *
                </label>
                <div className="flex items-center gap-2 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3 py-2.5 focus-within:border-[#D6A536]">
                  <User className="w-4 h-4 text-[#666666]" />
                  <input
                    id="modal-name-input"
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-email-input" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                    Email Address *
                  </label>
                  <div className="flex items-center gap-2 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3 py-2.5 focus-within:border-[#D6A536]">
                    <Mail className="w-4 h-4 text-[#666666]" />
                    <input
                      id="modal-email-input"
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-phone-input" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                    Phone Number *
                  </label>
                  <div className="flex items-center gap-2 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3 py-2.5 focus-within:border-[#D6A536]">
                    <Phone className="w-4 h-4 text-[#666666]" />
                    <input
                      id="modal-phone-input"
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+971 50 000 0000"
                      className="w-full bg-transparent text-sm focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-date-input" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                    Preferred Date *
                  </label>
                  <div className="flex items-center gap-2 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3 py-2 focus-within:border-[#D6A536]">
                    <Calendar className="w-4 h-4 text-[#666666]" />
                    <input
                      id="modal-date-input"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-transparent text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-time-input" className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                    Time Slot
                  </label>
                  <div className="flex items-center gap-2 bg-[#F5F4F0] border border-[#E8E5DE] rounded-md px-3 py-2 focus-within:border-[#D6A536]">
                    <Clock className="w-4 h-4 text-[#666666]" />
                    <select
                      id="modal-time-input"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-transparent text-sm focus:outline-none"
                    >
                      <option value="10:00 GST">10:00 GST (Morning)</option>
                      <option value="11:30 GST">11:30 GST (Midday)</option>
                      <option value="14:00 GST">14:00 GST (Afternoon)</option>
                      <option value="16:30 GST">16:30 GST (Sunset Tour)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D6A536] hover:bg-[#B98722] disabled:opacity-60 text-[#202020] font-semibold py-3.5 rounded-md text-xs uppercase tracking-[0.14em] transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Confirm Viewing Appointment</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-[#666666] text-center pt-1">
                For immediate assistance, contact our desk at{' '}
                <a href={`tel:${GNS_CONFIG.phone}`} className="underline text-[#202020] font-mono">
                  {GNS_CONFIG.phone}
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
