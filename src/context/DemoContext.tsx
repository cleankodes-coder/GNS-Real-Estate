import React, { createContext, useContext, useState, useEffect } from 'react';
import { PropertyItem, VERIFIED_PROPERTIES } from '../data/gnsData';

export interface EnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyTitle?: string;
  propertyId?: string;
  message: string;
  preferredContact: 'WhatsApp' | 'Phone' | 'Email';
  timeline: string;
  advisorAssigned: string;
  status: 'New' | 'In Contact' | 'Viewing Scheduled' | 'Closed';
  createdAt: string;
  notes: string[];
}

export interface ViewingRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  viewingType: 'In-Person VIP Tour' | 'Live Encrypted Video Tour';
  preferredDate: string;
  preferredTime: string;
  status: 'Pending Confirmation' | 'Confirmed' | 'Completed' | 'Rescheduled';
  advisorAssigned: string;
  createdAt: string;
}

export interface PropertyOverride {
  id: string;
  title?: string;
  pricingNote?: string;
  status?: PropertyItem['status'];
  isFeatured?: boolean;
}

interface DemoContextType {
  properties: PropertyItem[];
  enquiries: EnquiryRecord[];
  viewings: ViewingRequest[];
  propertyOverrides: Record<string, PropertyOverride>;
  addEnquiry: (enquiry: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status' | 'advisorAssigned' | 'notes'>) => void;
  addViewing: (viewing: Omit<ViewingRequest, 'id' | 'createdAt' | 'status' | 'advisorAssigned'>) => void;
  updateEnquiryStatus: (id: string, status: EnquiryRecord['status']) => void;
  updateViewingStatus: (id: string, status: ViewingRequest['status']) => void;
  assignAdvisorToEnquiry: (id: string, advisorName: string) => void;
  addEnquiryNote: (id: string, note: string) => void;
  updatePropertyOverride: (propertyId: string, override: Partial<PropertyOverride>) => void;
  resetPropertyOverride: (propertyId: string) => void;
  resetDemoData: () => void;
  exportCSV: (dataType: 'enquiries' | 'viewings') => void;
}

const DEFAULT_SAMPLE_ENQUIRIES: EnquiryRecord[] = [
  {
    id: 'enq-101',
    name: 'Alexander Sterling',
    email: 'a.sterling@sterling-holdings.co.uk',
    phone: '+44 7700 900142',
    propertyTitle: 'The Luminary Penthouse',
    propertyId: 'signature-palm-penthouse',
    message: 'Seeking discreet family office acquisition on Palm Jumeirah. Inquire on NDA protocol and private yacht mooring options.',
    preferredContact: 'WhatsApp',
    timeline: 'Immediate (Next 30 Days)',
    advisorAssigned: 'Tariq Al-Ghaith',
    status: 'In Contact',
    createdAt: '2026-10-28 14:32',
    notes: ['Introductory brief sent via secure WhatsApp. NDA signed. Scheduled video briefing.'],
  },
  {
    id: 'enq-102',
    name: 'H.E. Sheikh Mohammed Al-Khalili',
    email: 'reception@khalili-investments.ae',
    phone: '+971 50 882 1990',
    propertyTitle: 'Oria by Emaar',
    propertyId: 'oria-creek-harbour',
    message: 'Looking for full floor allocation or 4-unit cluster in Creek Beach for family portfolio.',
    preferredContact: 'Phone',
    timeline: 'Within 3 Months',
    advisorAssigned: 'Rashid Al-Nuaimi',
    status: 'New',
    createdAt: '2026-10-29 09:15',
    notes: ['Awaiting callback after 4:00 PM.'],
  },
  {
    id: 'enq-103',
    name: 'Camille Delacroix',
    email: 'c.delacroix@geneve-capital.ch',
    phone: '+41 22 710 4420',
    propertyTitle: 'Silva Residences',
    propertyId: 'silva-dubai-hills',
    message: 'Relocating to Dubai from Geneva. Interested in 5-bedroom villa close to golf course and King’s College school.',
    preferredContact: 'Email',
    timeline: '1-2 Months',
    advisorAssigned: 'Sophia Laurent',
    status: 'Viewing Scheduled',
    createdAt: '2026-10-29 17:45',
    notes: ['Private chauffeur booked for in-person tour on Saturday.'],
  },
];

const DEFAULT_SAMPLE_VIEWINGS: ViewingRequest[] = [
  {
    id: 'vw-501',
    propertyId: 'signature-palm-penthouse',
    propertyTitle: 'The Luminary Penthouse',
    clientName: 'Alexander Sterling',
    clientEmail: 'a.sterling@sterling-holdings.co.uk',
    clientPhone: '+44 7700 900142',
    viewingType: 'In-Person VIP Tour',
    preferredDate: '2026-11-04',
    preferredTime: '15:00 GST',
    status: 'Confirmed',
    advisorAssigned: 'Tariq Al-Ghaith',
    createdAt: '2026-10-28 15:10',
  },
  {
    id: 'vw-502',
    propertyId: 'silva-dubai-hills',
    propertyTitle: 'Silva Residences',
    clientName: 'Camille Delacroix',
    clientEmail: 'c.delacroix@geneve-capital.ch',
    clientPhone: '+41 22 710 4420',
    viewingType: 'In-Person VIP Tour',
    preferredDate: '2026-11-01',
    preferredTime: '11:00 GST',
    status: 'Confirmed',
    advisorAssigned: 'Sophia Laurent',
    createdAt: '2026-10-29 18:00',
  },
];

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(() => {
    const saved = localStorage.getItem('gns_demo_enquiries');
    return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_ENQUIRIES;
  });

  const [viewings, setViewings] = useState<ViewingRequest[]>(() => {
    const saved = localStorage.getItem('gns_demo_viewings');
    return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_VIEWINGS;
  });

  const [propertyOverrides, setPropertyOverrides] = useState<Record<string, PropertyOverride>>(() => {
    const saved = localStorage.getItem('gns_demo_property_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('gns_demo_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('gns_demo_viewings', JSON.stringify(viewings));
  }, [viewings]);

  useEffect(() => {
    localStorage.setItem('gns_demo_property_overrides', JSON.stringify(propertyOverrides));
  }, [propertyOverrides]);

  // Merge base verified properties with local overrides
  const properties = VERIFIED_PROPERTIES.map((prop) => {
    const override = propertyOverrides[prop.id];
    if (!override) return prop;
    return {
      ...prop,
      title: override.title ?? prop.title,
      pricingNote: override.pricingNote ?? prop.pricingNote,
      status: override.status ?? prop.status,
      isFeatured: override.isFeatured ?? prop.isFeatured,
    };
  });

  const addEnquiry = (enquiryData: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status' | 'advisorAssigned' | 'notes'>) => {
    const newEnquiry: EnquiryRecord = {
      ...enquiryData,
      id: `enq-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'New',
      advisorAssigned: 'Tariq Al-Ghaith',
      notes: ['Submitted via GNS V2 website enquiry portal.'],
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
  };

  const addViewing = (viewingData: Omit<ViewingRequest, 'id' | 'createdAt' | 'status' | 'advisorAssigned'>) => {
    const newViewing: ViewingRequest = {
      ...viewingData,
      id: `vw-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending Confirmation',
      advisorAssigned: 'Nadia Mansoor',
    };
    setViewings((prev) => [newViewing, ...prev]);
  };

  const updateEnquiryStatus = (id: string, status: EnquiryRecord['status']) => {
    setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const updateViewingStatus = (id: string, status: ViewingRequest['status']) => {
    setViewings((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const assignAdvisorToEnquiry = (id: string, advisorName: string) => {
    setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, advisorAssigned: advisorName } : item)));
  };

  const addEnquiryNote = (id: string, note: string) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes: [...item.notes, note] } : item))
    );
  };

  const updatePropertyOverride = (propertyId: string, override: Partial<PropertyOverride>) => {
    setPropertyOverrides((prev) => ({
      ...prev,
      [propertyId]: { ...prev[propertyId], id: propertyId, ...override },
    }));
  };

  const resetPropertyOverride = (propertyId: string) => {
    setPropertyOverrides((prev) => {
      const copy = { ...prev };
      delete copy[propertyId];
      return copy;
    });
  };

  const resetDemoData = () => {
    setEnquiries(DEFAULT_SAMPLE_ENQUIRIES);
    setViewings(DEFAULT_SAMPLE_VIEWINGS);
    setPropertyOverrides({});
    localStorage.removeItem('gns_demo_enquiries');
    localStorage.removeItem('gns_demo_viewings');
    localStorage.removeItem('gns_demo_property_overrides');
  };

  const exportCSV = (dataType: 'enquiries' | 'viewings') => {
    if (dataType === 'enquiries') {
      const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Property', 'Method', 'Timeline', 'Advisor', 'Status'];
      const rows = enquiries.map((e) => [
        e.id,
        `"${e.createdAt}"`,
        `"${e.name}"`,
        `"${e.email}"`,
        `"${e.phone}"`,
        `"${e.propertyTitle || 'General'}"`,
        `"${e.preferredContact}"`,
        `"${e.timeline}"`,
        `"${e.advisorAssigned}"`,
        `"${e.status}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `GNS_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['ID', 'Date', 'Property', 'Client Name', 'Email', 'Phone', 'Type', 'Scheduled Date', 'Time', 'Advisor', 'Status'];
      const rows = viewings.map((v) => [
        v.id,
        `"${v.createdAt}"`,
        `"${v.propertyTitle}"`,
        `"${v.clientName}"`,
        `"${v.clientEmail}"`,
        `"${v.clientPhone}"`,
        `"${v.viewingType}"`,
        `"${v.preferredDate}"`,
        `"${v.preferredTime}"`,
        `"${v.advisorAssigned}"`,
        `"${v.status}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `GNS_Viewings_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DemoContext.Provider
      value={{
        properties,
        enquiries,
        viewings,
        propertyOverrides,
        addEnquiry,
        addViewing,
        updateEnquiryStatus,
        updateViewingStatus,
        assignAdvisorToEnquiry,
        addEnquiryNote,
        updatePropertyOverride,
        resetPropertyOverride,
        resetDemoData,
        exportCSV,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};
