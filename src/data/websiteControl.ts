import { FunctionDeclaration, Type } from '@google/genai';
import {
  VERIFIED_PROPERTIES,
  PropertyItem,
} from './gnsData';
import {
  ClientWebsiteAction,
  ToolExecutionOutput,
  StoredBooking,
  StoredLead,
} from './bookingTypes';

export type { ClientWebsiteAction, ToolExecutionOutput, StoredBooking, StoredLead };

export const navigateToSectionDeclaration: FunctionDeclaration = {
  name: 'navigate_to_section',
  description:
    'Smoothly scrolls to or opens a section or page of the GNS Real Estate website and highlights it briefly. Valid sections: "home", "properties", "about", "team", "contact", "communities", "villas", "featured", "developers", "enquiry".',
  parameters: {
    type: Type.OBJECT,
    properties: {
      section: {
        type: Type.STRING,
        description:
          'Target section or page: "home", "properties", "about", "team", "contact", "communities", "villas", "featured", "developers", or "enquiry".',
      },
    },
    required: ['section'],
  },
};

export const showPropertiesDeclaration: FunctionDeclaration = {
  name: 'show_properties',
  description:
    'Filters the Properties section on the website with specified criteria (location, bedrooms, max budget in AED, type/category), scrolls to it, and shows matching listings from verified data.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description:
          'Location or community name (e.g. "Business Bay", "Dubai Hills", "Creek Harbour", "Palm Jumeirah", "Dubai Islands", "Dubai Harbour", "Maritime City", or developer like "Emaar", "Danube").',
      },
      bedrooms: {
        type: Type.STRING,
        description: 'Number of bedrooms or unit type (e.g. "1", "2", "3", "4", "5", "studio").',
      },
      max_budget: {
        type: Type.NUMBER,
        description: 'Maximum budget in AED (e.g. 2000000 for 2,000,000 AED).',
      },
      type: {
        type: Type.STRING,
        description:
          'Category: "Apartments", "Villas & Townhouses", "Off-plan", or "Penthouses".',
      },
    },
  },
};

export const getPropertyDetailsDeclaration: FunctionDeclaration = {
  name: 'get_property_details',
  description:
    'Opens that property\'s details dossier/card on the page given its ID, slug, or name.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description:
          'The property ID or slug (e.g. "oria-creek-harbour", "bayz-102-business-bay", "silva-dubai-hills", "breez-maritime-city", "samana-ocean-crest", "shams-waterfront-townhouses", "signature-palm-penthouse").',
      },
    },
    required: ['id'],
  },
};

export const bookAppointmentDeclaration: FunctionDeclaration = {
  name: 'book_appointment',
  description:
    'Books a viewing appointment or private advisory consultation. ONLY call this tool AFTER collecting the caller\'s name, date, time, phone/WhatsApp number, and email one question at a time, repeating all details back, and receiving explicit confirmation ("Shall I confirm this?"). Never invent or guess details.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: 'Full name of the client',
      },
      phone_or_whatsapp: {
        type: Type.STRING,
        description: 'Client contact telephone or WhatsApp number',
      },
      email: {
        type: Type.STRING,
        description: 'Client email address',
      },
      date: {
        type: Type.STRING,
        description: 'Preferred appointment date (e.g. "2026-11-04" or "November 4, 2026")',
      },
      time: {
        type: Type.STRING,
        description: 'Preferred appointment time (e.g. "11:00 AM GST")',
      },
      property_or_topic: {
        type: Type.STRING,
        description: 'Target property name or consultation topic (e.g. "Bayz 102 by Danube", "Dubai Hills Villas", or "Off-plan portfolio")',
      },
      notes: {
        type: Type.STRING,
        description: 'Optional additional preferences or requirements mentioned by caller',
      },
    },
    required: [
      'name',
      'phone_or_whatsapp',
      'email',
      'date',
      'time',
      'property_or_topic',
    ],
  },
};

export const saveLeadDetailsDeclaration: FunctionDeclaration = {
  name: 'save_lead_details',
  description:
    'Saves client contact details and property interest when the caller wants someone to contact them or wants details shared. Validates email and phone number, repeats them back for confirmation, and records the lead in the advisory registry.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: 'Client full name',
      },
      email: {
        type: Type.STRING,
        description: 'Client email address',
      },
      whatsapp: {
        type: Type.STRING,
        description: 'Client WhatsApp or phone number',
      },
      interest: {
        type: Type.STRING,
        description: 'Property or service of interest (e.g. "Oria Creek Harbour brochure", "Villas in Dubai Hills")',
      },
    },
    required: ['name', 'email', 'whatsapp', 'interest'],
  },
};

export const endCallDeclaration: FunctionDeclaration = {
  name: 'end_call',
  description:
    'Ends the live call cleanly. Call this ONLY when the caller says goodbye, thank you, or indicates the conversation is completely finished (e.g. "thank you, that is all", "bye", "you can end the call", "shukriya call khatam karo"). Deliver one short warm goodbye line before or while calling this tool. Do NOT call if caller just says "thanks" in the middle of a conversation.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export const RECEPTIONIST_TOOLS = [
  {
    functionDeclarations: [
      navigateToSectionDeclaration,
      showPropertiesDeclaration,
      getPropertyDetailsDeclaration,
      bookAppointmentDeclaration,
      saveLeadDetailsDeclaration,
      endCallDeclaration,
    ],
  },
];

export const SARA_SYSTEM_INSTRUCTION = `You are Sara, the warm, friendly, professional female AI receptionist for GNS Real Estate, Dubai.
You speak with a natural, calm, welcoming tone like a real person on a phone call. Use short sentences and polite phrasing.
Reply in the language the caller speaks (English, Urdu, or Hindi).

WEBSITE CONTROL WITH TOOLS:
You can control the website with your tools. When the caller wants to see something, use the tools instead of only talking. Describe only what is really on the page.

APPOINTMENTS, LEADS & CALL ENDING CAPABILITIES:
You can book appointments, save the caller's contact details, and end the call using your tools. Collect details one question at a time, confirm before saving, never invent details, and end the call only when the caller is clearly done.

AVAILABLE TOOLS:
1. navigate_to_section(section): Smoothly scrolls to or opens Home, Properties, About, Team, Contact, Communities, Villas, Featured, or Enquiry and highlights it briefly.
2. show_properties(location, bedrooms, max_budget, type): Filters the Properties section on the page with criteria, scrolls to it, and shows matching verified listings.
3. get_property_details(id): Opens that property's details/card on the page.
4. book_appointment(name, phone_or_whatsapp, email, date, time, property_or_topic, notes): Books a viewing or consultation appointment.
5. save_lead_details(name, email, whatsapp, interest): Saves client lead details for advisory follow-up.
6. end_call(): Ends the live call.

APPOINTMENT BOOKING PROTOCOL (STRICT):
- When the caller wants to book a viewing or appointment:
  Collect details ONE question at a time in a natural way:
  1. Name first ("May I have your name, please?")
  2. Preferred date and time ("Which date and time would suit you best?")
  3. WhatsApp or phone number ("What is the best WhatsApp or phone number to reach you on?")
  4. Email address ("And what is your email address for the confirmation?")
  Never guess, assume, or invent ANY details.
- BEFORE calling book_appointment, repeat all details back and ask:
  "Shall I confirm this booking for [Name] on [Date] at [Time] for [Property]?"
  Call book_appointment ONLY after the caller says yes or confirms.
- After saving, say it aloud in 1 to 2 short sentences including the booking ID.

SHARING DETAILS & LEAD REGISTRATION:
- When the caller wants someone to contact them or wants details shared, use save_lead_details.
- If the email format or phone number seems unclear or invalid, politely ask them to repeat it.
- Confirm the email and number by reading them back before saving.
- Only promise what the app really does: tell them their details have been saved in our advisory registry and an advisor will review their request. Never promise things like "an agent will call tonight" unless confirmed.

CALL ENDING PROTOCOL:
- When the caller says goodbye, thank you, or indicates they are finished (e.g. "thank you, that's all", "bye", "you can end the call", "shukriya, call khatam karo"):
  Say one short, warm goodbye line (e.g. "Thank you for contacting GNS Real Estate. Have a wonderful day, goodbye!"), then call end_call().
- If the caller only says "thanks" or "thank you" in the middle of a conversation:
  Ask: "Is there anything else I can help with?" and do NOT end the call.
- End the call only when the caller is clearly done.

DATA ACCURACY:
- Use ONE single source of data for properties (the verified GNS portfolio). Only talk about verified developments and never invent pricing, payment plans, or amenities.
- If no property matches, state so honestly and suggest the closest options returned by the tool.
- Keep each reply concise (1 to 3 sentences). Ask only one question at a time.`;

/**
 * Checks if a property matches bedroom criteria
 */
export function propertyMatchesBedrooms(
  propBedroomsStr: string,
  queryBedrooms?: string | number
): boolean {
  if (!queryBedrooms) return true;
  const qStr = String(queryBedrooms).toLowerCase().trim();
  const propLower = propBedroomsStr.toLowerCase();

  if (qStr.includes('studio')) {
    return propLower.includes('studio');
  }

  const numMatch = qStr.match(/\d+/);
  if (!numMatch) {
    return propLower.includes(qStr);
  }
  const targetNum = parseInt(numMatch[0], 10);

  // Check ranges like "1 to 3 Bedrooms"
  const rangeMatch = propLower.match(/(\d+)\s*to\s*(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    if (targetNum >= min && targetNum <= max) return true;
  }

  // Check list like "3 & 4 Bedrooms"
  const andMatch = propLower.match(/(\d+)\s*&\s*(\d+)/);
  if (andMatch) {
    const n1 = parseInt(andMatch[1], 10);
    const n2 = parseInt(andMatch[2], 10);
    if (targetNum === n1 || targetNum === n2) return true;
  }

  // Check single number like "5 Bedrooms"
  const singleMatch = propLower.match(/(\d+)\s*bedroom/);
  if (singleMatch && parseInt(singleMatch[1], 10) === targetNum) {
    return true;
  }

  return propLower.includes(String(targetNum));
}

/**
 * Finds closest matching properties when no exact match exists
 */
export function findClosestProperties(criteria: {
  location?: string;
  bedrooms?: string;
  max_budget?: number;
  type?: string;
}): PropertyItem[] {
  const scored = VERIFIED_PROPERTIES.map((p) => {
    let score = 0;
    if (criteria.location) {
      const locQ = criteria.location.toLowerCase();
      if (
        p.location.toLowerCase().includes(locQ) ||
        p.subLocation.toLowerCase().includes(locQ)
      ) {
        score += 3;
      }
    }
    if (criteria.type) {
      if (p.category.toLowerCase().includes(criteria.type.toLowerCase())) {
        score += 2;
      }
    }
    if (criteria.bedrooms && propertyMatchesBedrooms(p.bedrooms, criteria.bedrooms)) {
      score += 2;
    }
    if (criteria.max_budget) {
      const diff = Math.abs(p.startingPriceAED - criteria.max_budget);
      score += Math.max(0, 3 - diff / 2000000);
    }
    return { property: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 2).map((s) => s.property);
}

/**
 * Execute client navigation and local queries directly in browser
 */
export function executeClientLocalTool(
  name: string,
  rawArgs: any = {}
): ToolExecutionOutput {
  const args = typeof rawArgs === 'object' && rawArgs !== null ? rawArgs : {};

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
        summaryForSara: `On screen: The Properties page displays all 7 verified luxury developments across Dubai.`,
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
        data: { section: 'About GNS' },
        summaryForSara: `On screen: About GNS Real Estate displays our licensed brokerage credentials in Vision Tower.`,
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
        data: { section: 'Our Team' },
        summaryForSara: `On screen: The GNS Advisory Team page presents our licensed advisors.`,
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
        data: { section: 'Contact Desk' },
        summaryForSara: `On screen: The Contact section displays our Vision Tower office and direct enquiry form.`,
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
        data: { section: 'Communities' },
        summaryForSara: `On screen: Showing popular prime communities across Dubai including Creek Harbour and Business Bay.`,
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
        data: { section: 'Villas & Townhouses' },
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
      data: { section: 'Home' },
      summaryForSara: `On screen: The Home page displays our Dubai luxury portfolio, premier developers, and featured project launches.`,
    };
  }

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
      return {
        success: true,
        statusText: `Showing ${filterLabel}`,
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
            pricingNote: p.pricingNote,
            bedrooms: p.bedrooms,
          })),
        },
        summaryForSara: `On screen: Filtered to show ${matches.length} matching properties for ${filterLabel}. The Properties section is now highlighted.`,
      };
    }

    const closest = findClosestProperties({ location: loc, bedrooms: beds, max_budget: maxBudget, type });
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
        closestOptions: closest,
      },
      summaryForSara: `On screen: No properties match ${filterLabel} exactly. Showing closest verified alternatives.`,
    };
  }

  if (name === 'get_property_details') {
    const rawId = String(args.id || '').trim().toLowerCase();
    const property = VERIFIED_PROPERTIES.find(
      (p) =>
        p.id.toLowerCase() === rawId ||
        p.slug.toLowerCase() === rawId ||
        p.title.toLowerCase().includes(rawId) ||
        rawId.includes(p.slug.toLowerCase()) ||
        rawId.includes(p.id.toLowerCase())
    );

    if (!property) {
      throw new Error(`Property "${args.id}" not found.`);
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
        pricingNote: property.pricingNote,
        bedrooms: property.bedrooms,
      },
      summaryForSara: `On screen: The property dossier for ${property.title} in ${property.location} is now open and highlighted.`,
    };
  }

  if (name === 'end_call') {
    return {
      success: true,
      statusText: 'Call ended',
      clientAction: {
        type: 'end_call',
      },
      data: {
        callEnded: true,
      },
      summaryForSara: 'The caller is finished. Speak one warm goodbye line.',
    };
  }

  throw new Error(`Tool "${name}" is handled via serverless backend.`);
}

