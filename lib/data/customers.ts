// Top 5 newest Solace customers, extracted (newest-first) from the customers archive
// at https://solace.com/company/customers/ (FacetWP "newest_to_oldest" sort).
// Static snapshot — logos rarely change; refresh this list when notable new customers
// land. Used by the sidebar CustomerCarousel.

export type FeaturedCustomer = {
  name: string;
  industry: string;
  logo: string; // remote logo (solace.com/wp-content); some are SVG
  description: string; // short blurb, as found on the customer's story page
  href: string; // customer story (falls back to the customers index)
};

export const CUSTOMERS_URL = "https://solace.com/company/customers/";

export const FEATURED_CUSTOMERS: FeaturedCustomer[] = [
  {
    name: "U Tech",
    industry: "Retail",
    logo: "https://solace.com/wp-content/uploads/2026/05/u-tech-logo.png",
    description:
      "U Tech, the IT arm of France's fourth-largest retailer Coopérative U, chose Solace to modernize data flows across its 2,000 stores.",
    href: CUSTOMERS_URL,
  },
  {
    name: "United Airlines",
    industry: "Transportation & Logistics",
    logo: "https://solace.com/wp-content/uploads/2026/03/united-airlines-logo.svg",
    description:
      "United uses real-time data powered by Solace to streamline operations, reduce outages, accelerate recovery, and unlock next-generation AI.",
    href: "https://solace.com/company/customers/united/",
  },
  {
    name: "Bison",
    industry: "Transportation & Logistics",
    logo: "https://solace.com/wp-content/uploads/2026/03/bison-logo-500x250-1.svg",
    description:
      "Bison modernized how information flows across its business so teams can respond faster, make better decisions, and meet evolving customer demands.",
    href: "https://solace.com/company/customers/bison/",
  },
  {
    name: "Singapore Cruise Centre",
    industry: "Transportation & Logistics",
    logo: "https://solace.com/wp-content/uploads/2026/02/singapore-cruise-center-logo_400x200.jpg",
    description:
      "Singapore Cruise Centre is modernizing terminal operations with Solace — streaming real-time events across passenger, vessel, baggage, and partner systems.",
    href: "https://solace.com/company/customers/singapore-cruise-centre/",
  },
  {
    name: "Lagardère Travel Retail",
    industry: "Retail",
    logo: "https://solace.com/wp-content/uploads/2026/01/Lagardere-Travel-Retail-logo_600x300.png",
    description:
      "Lagardère Travel Retail, with 4,900+ stores across 45 countries, made Solace the real-time backbone connecting its stores, channels, and partners.",
    href: CUSTOMERS_URL,
  },
];
