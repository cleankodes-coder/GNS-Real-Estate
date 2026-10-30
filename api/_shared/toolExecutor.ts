import {
  VERIFIED_PROPERTIES,
  VERIFIED_TEAM,
  VERIFIED_COMMUNITIES,
  GNS_CONFIG,
  propertyMatchesBedrooms,
  findClosestProperties,
} from './data.js';
import {
  isValidEmail,
  isValidPhone,
  sendBookingNotificationEmail,
  prepareAdvisorWhatsApp,
  saveBookingToDatabase,
  saveLeadToDatabase,
  StoredBooking,
  StoredLead,
} from './backendStore.js';

export interface ClientWebsiteAction {
  type:
    | 'navigate_to_section'
    | 'show_properties'
    | 'get_property_details'
    | 'book_appointment'
    | 'save_lead_details'
    | 'end_call';
  path?: string;
  elementId?: string;
  params?: {
    location?: string;
    bedrooms?: string;
    max_budget?: number;
    type?: string;
  };
  propertySlug?: string;
  propertyId?: string;
  booking?: StoredBooking;
  lead?: StoredLead;
}

export interface ToolExecutionOutput {
  success: boolean;
  statusText: string;
  clientAction: ClientWebsiteAction;
  data: any;
  summaryForSara: string;
}

export async function executeWebsiteTool(
  name: string,
  rawArgs: any = {}
): Promise<ToolExecutionOutput> {
  const args = typeof rawArgs === 'object' && rawArgs !== null ? rawArgs : {};

  // 1. Navigate to section
  if (name === 'navigate_to_section') {
    const section = String(args.section || 'home').toLowerCase().trim();

    if (section.includes('prop')) {
      return {
        success: true,
        statusText: 'Showing Properties section',
        clientAction: {
          type: 'navigate_to_section',
          path: '/properties',
          elementId: 'properties-page-container',
        },
        data: {
          section: 'Properties',
          totalProperties: VERIFIED_PROPERTIES.length,
          properties: VERIFIED_PROPERTIES.map((p) => ({
            id: p.id,
            title: p.title,
            location: p.location,
            pricing: p.pricingNote,
            bedrooms: p.bedrooms,
          })),
        },
        summaryForSara: `On screen: The Properties page displays verified luxury developments across Dubai, including off-plan apartments and ready villas.`,
      };
    }

    if (section.includes('about')) {
      return {
        success: true,
        statusText: 'Navigating to About section',
        clientAction: {
          type: 'navigate_to_section',
          path: '/about',
          elementId: 'about-page-container',
        },
        data: {
          section: 'About GNS',
          license: GNS_CONFIG.reraOrLicense,
          address: GNS_CONFIG.officeAddress,
        },
        summaryForSara: `On screen: About GNS Real Estate displays our licensed brokerage credentials (RERA License 28941) and headquarters in Business Bay.`,
      };
    }

    if (section.includes('team')) {
      return {
        success: true,
        statusText: 'Opening Advisory Team',
        clientAction: {
          type: 'navigate_to_section',
          path: '/team',
          elementId: 'team-page-container',
        },
        data: {
          section: 'Our Team',
          members: VERIFIED_TEAM.map((m) => ({
            name: m.name,
            role: m.role,
            department: m.department,
          })),
        },
        summaryForSara: `On screen: The GNS Advisory Team page presents our licensed advisors led by Managing Director Tariq Al-Ghaith.`,
      };
    }

    if (section.includes('contact') || section.includes('enquir')) {
      return {
        success: true,
        statusText: 'Opening Contact section',
        clientAction: {
          type: 'navigate_to_section',
          path: '/contact',
          elementId: 'contact-page-container',
        },
        data: {
          section: 'Contact Desk',
          phone: GNS_CONFIG.phone,
          whatsapp: GNS_CONFIG.whatsappFormatted,
          email: GNS_CONFIG.email,
          address: GNS_CONFIG.officeAddress,
        },
        summaryForSara: `On screen: The Contact section displays our Vision Tower office in Business Bay, phone ${GNS_CONFIG.phone}, and direct enquiry desk.`,
      };
    }

    if (section.includes('communit')) {
      return {
        success: true,
        statusText: 'Showing Popular Communities',
        clientAction: {
          type: 'navigate_to_section',
          path: '/',
          elementId: 'communities',
        },
        data: {
          section: 'Communities',
          communities: VERIFIED_COMMUNITIES.map((c) => ({
            name: c.name,
            tagline: c.tagline,
          })),
        },
        summaryForSara: `On screen: Showing prime communities across Dubai including Creek Harbour, Business Bay, and Dubai Hills Estate.`,
      };
    }

    if (section.includes('villa')) {
      return {
        success: true,
        statusText: 'Showing Villas and Townhouses',
        clientAction: {
          type: 'navigate_to_section',
          path: '/',
          elementId: 'villas',
        },
        data: {
          section: 'Villas & Townhouses',
          properties: VERIFIED_PROPERTIES.filter(
            (p) => p.category === 'Villas & Townhouses' || p.category === 'Penthouses'
          ).map((p) => ({
            title: p.title,
            location: p.location,
            pricing: p.pricingNote,
          })),
        },
        summaryForSara: `On screen: The Villas and Townhouses section highlights luxury villas in Dubai Hills and waterfront townhouses.`,
      };
    }

    return {
      success: true,
      statusText: 'Navigating to Home',
      clientAction: {
        type: 'navigate_to_section',
        path: '/',
        elementId: 'root',
      },
      data: {
        section: 'Home',
        heading: GNS_CONFIG.heroHeading,
      },
      summaryForSara: `On screen: The Home page features our Dubai luxury real estate search, communities, and developer partners.`,
    };
  }

  // 2. Show properties
  if (name === 'show_properties') {
    const loc = args.location ? String(args.location).trim() : '';
    const beds = args.bedrooms !== undefined ? String(args.bedrooms).trim() : '';
    const maxBudget = args.max_budget ? Number(args.max_budget) : undefined;
    const type = args.type ? String(args.type).trim() : '';

    const matches = VERIFIED_PROPERTIES.filter((prop) => {
      if (loc) {
        const q = loc.toLowerCase();
        const matchesLoc =
          prop.location.toLowerCase().includes(q) ||
          prop.subLocation.toLowerCase().includes(q) ||
          prop.title.toLowerCase().includes(q) ||
          prop.developer.toLowerCase().includes(q);
        if (!matchesLoc) return false;
      }
      if (type && type !== 'All') {
        const q = type.toLowerCase();
        const cat = prop.category.toLowerCase();
        if (
          !cat.includes(q) &&
          !(q.includes('villa') && cat.includes('villa')) &&
          !(q.includes('apart') && cat.includes('apart')) &&
          !(q.includes('off') && cat.includes('off'))
        ) {
          return false;
        }
      }
      if (beds && !propertyMatchesBedrooms(prop.bedrooms, beds)) {
        return false;
      }
      if (maxBudget && prop.startingPriceAED > maxBudget) {
        return false;
      }
      return true;
    });

    const parts: string[] = [];
    if (loc) parts.push(loc);
    if (beds) parts.push(beds.includes('bed') || beds.toLowerCase() === 'studio' ? beds : `${beds} bedrooms`);
    if (type && type !== 'All') parts.push(type);
    if (maxBudget) parts.push(`under AED ${maxBudget.toLocaleString()}`);

    const filterLabel = parts.length > 0 ? parts.join(', ') : 'All Properties';

    if (matches.length > 0) {
      const statusText = `Showing ${filterLabel}`;
      const summaryList = matches
        .map((p) => `${p.title} in ${p.location} (${p.pricingNote}, ${p.bedrooms})`)
        .join('; ');

      return {
        success: true,
        statusText,
        clientAction: {
          type: 'show_properties',
          path: '/properties',
          elementId: 'properties-grid',
          params: {
            location: loc || undefined,
            bedrooms: beds || undefined,
            max_budget: maxBudget,
            type: type || undefined,
          },
        },
        data: {
          matchingCount: matches.length,
          properties: matches.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            location: p.location,
            developer: p.developer,
            category: p.category,
            startingPriceAED: p.startingPriceAED,
            pricingNote: p.pricingNote,
            bedrooms: p.bedrooms,
            status: p.status,
            handoverDate: p.handoverDate,
          })),
        },
        summaryForSara: `On screen: Filtered to show ${matches.length} matching properties (${summaryList}). The Properties section is now scrolled into view.`,
      };
    }

    const closest = findClosestProperties({ location: loc, bedrooms: beds, max_budget: maxBudget, type });
    const closestDesc = closest
      .map((p) => `${p.title} in ${p.location} (${p.pricingNote})`)
      .join(' and ');

    return {
      success: true,
      statusText: `No exact match for ${filterLabel}; showing closest options`,
      clientAction: {
        type: 'show_properties',
        path: '/properties',
        elementId: 'properties-grid',
        params: {
          location: loc || undefined,
          bedrooms: beds || undefined,
          max_budget: maxBudget,
          type: type || undefined,
        },
      },
      data: {
        matchingCount: 0,
        noMatchReason: `No verified properties match ${filterLabel}.`,
        closestOptions: closest.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          location: p.location,
          pricingNote: p.pricingNote,
          bedrooms: p.bedrooms,
        })),
      },
      summaryForSara: `On screen: No properties match ${filterLabel} exactly. The page now shows our closest verified options instead: ${closestDesc}. State this honestly to the caller.`,
    };
  }

  // 3. Get property details
  if (name === 'get_property_details') {
    const rawId = String(args.id || '').trim().toLowerCase();
    if (!rawId) {
      throw new Error('Property ID is required.');
    }

    const property = VERIFIED_PROPERTIES.find(
      (p) =>
        p.id.toLowerCase() === rawId ||
        p.slug.toLowerCase() === rawId ||
        p.title.toLowerCase().includes(rawId) ||
        rawId.includes(p.slug.toLowerCase()) ||
        rawId.includes(p.id.toLowerCase())
    );

    if (!property) {
      throw new Error(`Property "${args.id}" not found in verified inventory.`);
    }

    return {
      success: true,
      statusText: `Viewing ${property.title} details`,
      clientAction: {
        type: 'get_property_details',
        path: `/properties/${property.slug}`,
        elementId: 'property-detail-container',
        propertySlug: property.slug,
        propertyId: property.id,
      },
      data: {
        id: property.id,
        slug: property.slug,
        title: property.title,
        location: property.location,
        subLocation: property.subLocation,
        developer: property.developer,
        category: property.category,
        status: property.status,
        startingPriceAED: property.startingPriceAED,
        pricingNote: property.pricingNote,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        areaRangeSqFt: property.areaRangeSqFt,
        handoverDate: property.handoverDate,
        paymentPlan: property.paymentPlan,
        keyFeatures: property.keyFeatures,
        description: property.description,
      },
      summaryForSara: `On screen: The property dossier for ${property.title} in ${property.location} is now open. Starting price is ${property.pricingNote}, featuring ${property.bedrooms}.`,
    };
  }

  // 4. Book appointment
  if (name === 'book_appointment') {
    const clientName = String(args.name || '').trim();
    const phone = String(args.phone_or_whatsapp || '').trim();
    const email = String(args.email || '').trim();
    const date = String(args.date || '').trim();
    const time = String(args.time || '').trim();
    const propertyOrTopic = String(args.property_or_topic || 'Dubai Real Estate Consultation').trim();
    const notes = String(args.notes || '').trim();

    if (!clientName || !phone || !email || !date || !time) {
      throw new Error(
        'Missing booking details. Please ask the caller one question at a time for name, date, time, phone, and email before confirming.'
      );
    }

    if (!isValidEmail(email)) {
      throw new Error(
        `Email address "${email}" appears invalid. Please ask the caller to repeat their email address clearly.`
      );
    }

    if (!isValidPhone(phone)) {
      throw new Error(
        `Phone number "${phone}" appears incomplete. Please ask the caller to confirm their telephone or WhatsApp number with area/country code.`
      );
    }

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const emailResult = await sendBookingNotificationEmail({
      bookingId,
      name: clientName,
      date,
      time,
      property: propertyOrTopic,
      phone,
      email,
      notes,
      timestamp,
    });

    const whatsAppResult = prepareAdvisorWhatsApp({
      bookingId,
      name: clientName,
      date,
      time,
      property: propertyOrTopic,
      phone,
      email,
      notes,
    });

    const bookingRecord: StoredBooking = {
      bookingId,
      name: clientName,
      phone,
      email,
      date,
      time,
      property: propertyOrTopic,
      notes,
      emailStatus: emailResult.message,
      whatsAppStatus: `Prepared for dispatch to ${whatsAppResult.advisorNumber}`,
      whatsAppUrl: whatsAppResult.url,
      timestamp,
    };

    saveBookingToDatabase(bookingRecord);

    const statusText = `Booking appointment for ${clientName} (${bookingId})`;

    return {
      success: true,
      statusText,
      clientAction: {
        type: 'book_appointment',
        booking: bookingRecord,
      },
      data: {
        bookingId,
        clientName,
        date,
        time,
        property: propertyOrTopic,
        phone,
        email,
        emailNotification: emailResult.message,
        whatsAppDispatchUrl: whatsAppResult.url,
      },
      summaryForSara: `Viewing appointment confirmed under Booking ID ${bookingId} for ${clientName} on ${date} at ${time} for ${propertyOrTopic}. Say this confirmation aloud to the caller in 1 to 2 short sentences including the booking ID. ${emailResult.message}`,
    };
  }

  // 5. Save lead details
  if (name === 'save_lead_details') {
    const leadName = String(args.name || '').trim();
    const leadEmail = String(args.email || '').trim();
    const leadWhatsapp = String(args.whatsapp || '').trim();
    const interest = String(args.interest || 'Dubai Properties').trim();

    if (!leadName) {
      throw new Error('Client name is required to register lead details.');
    }

    if (!isValidEmail(leadEmail)) {
      throw new Error(
        `Email address "${leadEmail}" appears invalid. Please politely ask the caller to repeat their email address.`
      );
    }

    if (!isValidPhone(leadWhatsapp)) {
      throw new Error(
        `WhatsApp number "${leadWhatsapp}" appears incomplete. Please politely ask the caller to repeat their phone or WhatsApp number.`
      );
    }

    const leadId = `LD-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const leadRecord: StoredLead = {
      leadId,
      name: leadName,
      email: leadEmail,
      whatsapp: leadWhatsapp,
      interest,
      timestamp,
    };

    saveLeadToDatabase(leadRecord);

    const statusText = `Saving contact details for ${leadName}`;

    return {
      success: true,
      statusText,
      clientAction: {
        type: 'save_lead_details',
        lead: leadRecord,
      },
      data: {
        leadId,
        name: leadName,
        email: leadEmail,
        whatsapp: leadWhatsapp,
        interest,
        status: 'Saved to GNS Advisory Registry',
      },
      summaryForSara: `Contact details for ${leadName} have been recorded under Lead ID ${leadId}. Email: ${leadEmail}, WhatsApp: ${leadWhatsapp}, Interest: ${interest}. Read them back briefly and confirm that our advisory team will review their request.`,
    };
  }

  // 6. Auto End Call
  if (name === 'end_call') {
    return {
      success: true,
      statusText: 'Call ended',
      clientAction: {
        type: 'end_call',
      },
      data: {
        callEnded: true,
        message: 'Live session terminated cleanly.',
      },
      summaryForSara: `The caller is finished. Speak one warm, courteous goodbye sentence before the call disconnects.`,
    };
  }

  throw new Error(`Unknown tool action "${name}".`);
}
