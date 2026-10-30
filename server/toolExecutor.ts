import {
  VERIFIED_PROPERTIES,
  VERIFIED_TEAM,
  VERIFIED_COMMUNITIES,
  GNS_CONFIG,
  PropertyItem,
} from '../src/data/gnsData';
import {
  isValidEmail,
  isValidPhone,
  sendBookingNotificationEmail,
  prepareAdvisorWhatsApp,
  saveBookingToDatabase,
  saveLeadToDatabase,
  StoredBooking,
  StoredLead,
} from './backendStore';
import {
  propertyMatchesBedrooms,
  findClosestProperties,
} from '../src/data/websiteControl';
import { ToolExecutionOutput } from '../src/data/bookingTypes';

/**
 * Execute tool against the single source of truth data and return client action + description.
 * Runs exclusively on Node.js backend.
 */
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
        summaryForSara: `On screen: The Properties page displays all 7 verified luxury developments across Dubai, including off-plan apartments like Oria by Emaar (from AED 1.75M) and ready villas like Silva Residences in Dubai Hills (AED 4.8M).`,
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
          overview:
            'GNS Real Estate is a licensed brokerage based in Vision Tower, Business Bay, Dubai, guiding buyers across premier developer launches and secondary transactions.',
        },
        summaryForSara: `On screen: About GNS Real Estate displays our licensed brokerage credentials (RERA License 28941, ORN 19482), our headquarters at Vision Tower in Business Bay, and our services spanning residential buying, off-plan launches, and conveyancing.`,
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
            languages: m.languages,
          })),
        },
        summaryForSara: `On screen: The GNS Advisory Team page presents our 8 licensed advisors, led by Managing Director Tariq Al-Ghaith, Nadia Mansoor (Head of Prime & Luxury Sales), and Rashid Al-Nuaimi (Director of Off-Plan Investments).`,
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
        summaryForSara: `On screen: The Contact section displays our central advisory desk at Suite 2401, Vision Tower, Business Bay, telephone ${GNS_CONFIG.phone}, instant WhatsApp, and the direct enquiry form.`,
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
        summaryForSara: `On screen: The Popular Communities section showcases 6 prime Dubai destinations: Dubai Creek Harbour, Business Bay, Dubai Hills Estate, Palm Jumeirah, Dubai Maritime City, and Dubai Islands.`,
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
        summaryForSara: `On screen: The Villas and Townhouses section highlights Silva Residences golf villas in Dubai Hills Estate and Shams Waterfront Residences in Dubai Harbour.`,
      };
    }

    if (section.includes('featured')) {
      return {
        success: true,
        statusText: 'Showing Featured Properties',
        clientAction: {
          type: 'navigate_to_section',
          path: '/',
          elementId: 'featured-properties',
        },
        data: {
          section: 'Featured Launches',
          featured: VERIFIED_PROPERTIES.slice(0, 4).map((p) => ({
            title: p.title,
            location: p.location,
            pricing: p.pricingNote,
          })),
        },
        summaryForSara: `On screen: The Featured Launches section showcases Oria by Emaar at Dubai Creek Harbour, Bayz 102 by Danube in Business Bay, and Silva Residences in Dubai Hills Estate.`,
      };
    }

    if (section.includes('developer')) {
      return {
        success: true,
        statusText: 'Showing Master Developers',
        clientAction: {
          type: 'navigate_to_section',
          path: '/',
          elementId: 'developers',
        },
        data: {
          section: 'Leading Developers',
          developers: ['Emaar', 'DAMAC', 'Nakheel', 'Meraas', 'Sobha', 'Omniyat', 'Select Group', 'Danube'],
        },
        summaryForSara: `On screen: The Leading Developers strip highlights our direct brokerage partnerships with Emaar, DAMAC, Nakheel, Meraas, Sobha, Omniyat, and Danube.`,
      };
    }

    // Default: Home
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
        subheading: GNS_CONFIG.heroSubheading,
      },
      summaryForSara: `On screen: The Home page features our Dubai luxury real estate search, premier developer partners, popular communities, and featured project launches.`,
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
        summaryForSara: `On screen: Filtered to show ${matches.length} matching property listings (${summaryList}). The Properties section is now smoothly scrolled into view and highlighted.`,
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
          category: p.category,
        })),
      },
      summaryForSara: `On screen: No properties match ${filterLabel} exactly. The page now shows our closest verified options instead: ${closestDesc}. Honestly inform the caller that there is no exact match and suggest these closest alternatives.`,
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
      summaryForSara: `On screen: The property dossier for ${property.title} in ${property.location} is now open and highlighted. Starting price is ${property.pricingNote}, featuring ${property.bedrooms}, handover ${property.handoverDate || property.status}, developed by ${property.developer}.`,
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

    // Prepare email notification
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

    // Prepare WhatsApp dispatch
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
      summaryForSara: `Contact details for ${leadName} have been recorded under Lead ID ${leadId}. Email: ${leadEmail}, WhatsApp: ${leadWhatsapp}, Interest: ${interest}. Read them back briefly and confirm that our advisory team will review their request. Only promise that an advisor will review it, nothing more.`,
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
