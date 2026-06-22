// Curated Solace Academy learning paths for the in-app /learning-path page.
//
// HOW IT WORKS (simple): a ROLE picks one or more TRACKS. The rendered timeline is
// FOUNDATIONS (shared, Stage 1) followed by each track's `steps`, in array order.
// What you see in `steps` top-to-bottom IS the on-screen order — required courses,
// optional electives (`elective: true`), and the exam (`cert: true`) are all listed
// inline. Shared courses are shown once (de-duped by URL at render time).
//
// TO EDIT A PATH: change the track's `steps` array below. Add/remove/reorder a line.
//   • optional course → add `elective: true`
//   • the certification exam → add `cert: true`
//   • "in-path" course with no standalone link → omit `url`
// To change which tracks a role includes → edit that role's `trackIds`.

export type Price = "FREE" | string; // "FREE" | "$50" | "$ (in $500 path)" | ... (paid shown as "$$")

export interface Course {
  title: string;
  url?: string | null; // omit / null ⇒ delivered "within the path" — links to the track's pathUrl
  duration: string;
  price: Price;
  cert?: boolean; // certification exam → milestone node
  elective?: boolean; // optional "go further" course (not required for the certification)
  note?: string; // e.g. "optional prep", "prereq", "prereq gate"
}

export type Stage = 1 | 2 | 3;

export interface Track {
  id: string;
  code: string;
  title: string;
  certification: string;
  audience: string;
  pathUrl: string;
  cost: Price;
  totalTime: string;
  stage: Stage;
  steps: Course[];
}

export interface Role {
  id: string;
  label: string;
  icon: string; // maps to components/Icon.tsx
  blurb: string;
  trackIds: string[]; // tracks layered after the shared Foundations
  time: string;
  cost: Price;
}

export interface CatalogCourse {
  title: string;
  url: string;
  price: Price;
  duration: string;
  category: string;
}

const C = "https://training.solace.com/learn/courses";
const LP = "https://training.solace.com/learn/learning-plans";

// ── Stage 1 · Universal Foundations (all roles start here) ───────────────────
export const FOUNDATIONS: Course[] = [
  { title: "Solace Background & Use Cases", url: `${C}/243/solace-background-use-cases`, duration: "7 min", price: "FREE" },
  { title: "Being Event-Driven", url: `${C}/228/being-event-driven`, duration: "40 min", price: "FREE" },
  { title: "A Walk Through the Journey of Microservices", url: `${C}/84/a-walk-through-the-journey-of-microservices`, duration: "30 min", price: "FREE" },
  { title: "Solace Event Broker Key Features", url: `${C}/244/solace-event-broker-key-features`, duration: "40 min", price: "FREE" },
  { title: "How to Build an Event Mesh with Solace PubSub+", url: `${C}/179/how-to-build-an-event-mesh-with-solace-pubsub`, duration: "9 min", price: "FREE" },
  { title: "Solace Essentials", url: `${C}/503/solace-essentials`, duration: "4h", price: "FREE" },
  { title: "Foundations of Event-Driven Architecture", url: `${C}/279/foundations-of-event-driven-architecture`, duration: "3h", price: "FREE" },
];

// ── Tracks · each `steps` array is the full series in display order ───────────
export const TRACKS: Track[] = [
  {
    id: "A", code: "A", title: "Solutions Consultant", certification: "Solace Certified Solutions Consultant",
    audience: "Pre-sales, consultants, business-technical roles", pathUrl: `${LP}/37/solace-certified-solutions-consultant-path`,
    cost: "FREE", totalTime: "~7h", stage: 2,
    steps: [
      { title: "Solutions Consultant Certification Overview", duration: "3 min", price: "FREE" },
      { title: "Being Event-Driven", url: `${C}/228/being-event-driven`, duration: "40 min", price: "FREE" },
      { title: "Solace Background & Use Cases", url: `${C}/243/solace-background-use-cases`, duration: "7 min", price: "FREE" },
      { title: "Solace Event Broker Key Features", url: `${C}/244/solace-event-broker-key-features`, duration: "40 min", price: "FREE" },
      { title: "Solace Essentials", url: `${C}/503/solace-essentials`, duration: "4h", price: "FREE" },
      { title: "Architect's Guide To Solace Over Kafka", url: `${C}/345/architects-guide-to-solace-over-kafka`, duration: "31 min", price: "FREE", elective: true },
      { title: "Solace Certified Solutions Consultant Exam", duration: "1h 30m", price: "FREE", cert: true },
    ],
  },
  {
    id: "B", code: "B", title: "EDA Practitioner", certification: "Solace Certified EDA Practitioner",
    audience: "Architects, developers, anyone designing EDA systems", pathUrl: `${LP}/40/solace-certified-eda-practitioner-path`,
    cost: "FREE", totalTime: "~4h 30m", stage: 2,
    steps: [
      { title: "Foundations of Event-Driven Architecture", url: `${C}/279/foundations-of-event-driven-architecture`, duration: "3h", price: "FREE" },
      { title: "Architect's Guide To Solace Over Kafka", url: `${C}/345/architects-guide-to-solace-over-kafka`, duration: "31 min", price: "FREE", elective: true },
      { title: "Schema Registry Foundations", url: `${C}/627/schema-registry-foundations`, duration: "2h", price: "FREE", elective: true },
      { title: "Event Portal Essential — Discover, Design, Promote & Push", url: `${C}/577/event-portal-essential-from-discover-and-design-to-promote-and-push`, duration: "4h", price: "FREE", elective: true },
      { title: "Topic Best Practice at Work", url: `${C}/506/topic-best-practice-at-work`, duration: "1h", price: "$100", elective: true },
      { title: "Designing your Event-Driven Architecture", url: `${C}/418/designing-your-event-driven-architecture`, duration: "2h", price: "$50", elective: true },
      { title: "Event Portal Workshop", url: `${C}/471/event-portal-workshop`, duration: "4h", price: "$100", elective: true },
      { title: "Performance Tuning for DMR", url: `${C}/592/performance-tuning-for-dmr`, duration: "2h", price: "FREE", elective: true },
      { title: "Distributed Tracing in Solace PubSub+ Broker", url: `${C}/412/distributed-tracing-in-solace-pubsub-broker`, duration: "45 min", price: "FREE", elective: true },
      { title: "Solace Certified EDA Practitioner Exam", duration: "1h 30m", price: "FREE", cert: true },
    ],
  },
  {
    id: "C", code: "C", title: "Developer Practitioner", certification: "Solace Certified Developer Practitioner",
    audience: "Software developers building on Solace PubSub+", pathUrl: `${LP}/49/solace-certified-developer-practitioner-path`,
    cost: "FREE", totalTime: "~10h 30m", stage: 2,
    steps: [
      { title: "Solace Essentials", url: `${C}/503/solace-essentials`, duration: "4h", price: "FREE" },
      { title: "Learning Materials – Solace Certified Developer Practitioner Exam", url: `${C}/326/learning-materials-solace-certified-developer-practitioner-exam`, duration: "5h", price: "FREE" },
      { title: "Schema Registry Foundations", url: `${C}/627/schema-registry-foundations`, duration: "2h", price: "FREE", elective: true },
      { title: "Direct Messaging", url: `${C}/547/direct-messaging`, duration: "1h", price: "$50", elective: true },
      { title: "Topic Best Practice at Work", url: `${C}/506/topic-best-practice-at-work`, duration: "1h", price: "$100", elective: true },
      { title: "Event Broker: Guaranteed Messaging", url: `${C}/521/event-broker-guaranteed-messaging`, duration: "2h", price: "$50", elective: true },
      { title: "Partitioned Queues", url: `${C}/468/partitioned-queues`, duration: "30 min", price: "$100", elective: true },
      { title: "Distributed Tracing in Solace PubSub+ Broker", url: `${C}/412/distributed-tracing-in-solace-pubsub-broker`, duration: "45 min", price: "FREE", elective: true },
      { title: "Distributed Tracing for Beginners", url: `${C}/476/distributed-tracing-for-beginners`, duration: "5h", price: "$100", elective: true },
      { title: "Declarative SEMP (dSEMP)", url: `${C}/510/declarative-semp-dsemp`, duration: "1h", price: "$100", elective: true },
      { title: "Performance Tuning for DMR", url: `${C}/592/performance-tuning-for-dmr`, duration: "2h", price: "FREE", elective: true },
      { title: "Solace Certified Developer Practitioner Exam", duration: "1h 30m", price: "FREE", cert: true },
    ],
  },
  {
    id: "D", code: "D", title: "Agent Mesh Practitioner", certification: "Solace Certified Agent Mesh Practitioner",
    audience: "Developers & architects working with enterprise AI agent systems", pathUrl: `${LP}/107/solace-certified-agent-mesh-practitioner-path`,
    cost: "FREE", totalTime: "~4h 30m", stage: 2,
    steps: [
      { title: "Solace Agent Mesh Foundations", duration: "3h", price: "FREE" },
      { title: "Schema Registry Foundations", url: `${C}/627/schema-registry-foundations`, duration: "2h", price: "FREE", elective: true },
      { title: "Event Portal Essential — Discover, Design, Promote & Push", url: `${C}/577/event-portal-essential-from-discover-and-design-to-promote-and-push`, duration: "4h", price: "FREE", elective: true },
      { title: "Distributed Tracing in Solace PubSub+ Broker", url: `${C}/412/distributed-tracing-in-solace-pubsub-broker`, duration: "45 min", price: "FREE", elective: true },
      { title: "Solace Certified Agent Mesh Practitioner Exam", duration: "1h 30m", price: "FREE", cert: true },
    ],
  },
  {
    id: "E-Boomi", code: "E·Boomi", title: "Event-Driven Integration — Boomi", certification: "Solace Certified EDI – Boomi",
    audience: "Integration specialists using the Boomi connector", pathUrl: `${LP}/94/solace-certified-event-driven-integration-boomi`,
    cost: "FREE", totalTime: "~5h", stage: 2,
    steps: [
      { title: "Foundations of Event-Driven Architecture", url: `${C}/279/foundations-of-event-driven-architecture`, duration: "3h", price: "FREE" },
      { title: "Solace PubSub+ Boomi Connector – Getting Started", url: `${C}/338/solace-pubsub-boomi-connector-getting-started`, duration: "30 min", price: "FREE", note: "optional prep" },
      { title: "Event-Driven Integration Course – Boomi", url: `${C}/597/event-driven-integration-course-boomi`, duration: "1h", price: "FREE" },
      { title: "Architect's Guide To Solace Over Kafka", url: `${C}/345/architects-guide-to-solace-over-kafka`, duration: "31 min", price: "FREE", elective: true },
      { title: "Schema Registry Foundations", url: `${C}/627/schema-registry-foundations`, duration: "2h", price: "FREE", elective: true },
      { title: "Event Portal Essential — Discover, Design, Promote & Push", url: `${C}/577/event-portal-essential-from-discover-and-design-to-promote-and-push`, duration: "4h", price: "FREE", elective: true },
      { title: "Integrated Kafka Bridge", url: `${C}/509/integrated-kafka-bridge`, duration: "1h", price: "$100", elective: true },
      { title: "Event Portal for Kafka", url: `${C}/505/event-portal-for-kafka`, duration: "45 min", price: "$100", elective: true },
      { title: "Solace Certified EDI – Boomi Exam", duration: "1h", price: "FREE", cert: true },
    ],
  },
  {
    id: "E-SAP", code: "E·SAP", title: "Event-Driven Integration — SAP", certification: "Solace Certified EDI – SAP",
    audience: "Integration specialists using the SAP connector", pathUrl: `${LP}/93/solace-certified-event-driven-integration-sap`,
    cost: "FREE", totalTime: "~5h", stage: 2,
    steps: [
      { title: "Foundations of Event-Driven Architecture", url: `${C}/279/foundations-of-event-driven-architecture`, duration: "3h", price: "FREE" },
      { title: "Event-Driven Integration Course – SAP", url: `${C}/593/event-driven-integration-course-sap`, duration: "1h", price: "FREE" },
      { title: "Architect's Guide To Solace Over Kafka", url: `${C}/345/architects-guide-to-solace-over-kafka`, duration: "31 min", price: "FREE", elective: true },
      { title: "Schema Registry Foundations", url: `${C}/627/schema-registry-foundations`, duration: "2h", price: "FREE", elective: true },
      { title: "Event Portal Essential — Discover, Design, Promote & Push", url: `${C}/577/event-portal-essential-from-discover-and-design-to-promote-and-push`, duration: "4h", price: "FREE", elective: true },
      { title: "Integrated Kafka Bridge", url: `${C}/509/integrated-kafka-bridge`, duration: "1h", price: "$100", elective: true },
      { title: "Event Portal for Kafka", url: `${C}/505/event-portal-for-kafka`, duration: "45 min", price: "$100", elective: true },
      { title: "Solace Certified EDI – SAP Exam", duration: "1h", price: "FREE", cert: true },
    ],
  },
  {
    id: "E-MuleSoft", code: "E·MuleSoft", title: "Event-Driven Integration — MuleSoft", certification: "Solace Certified EDI – MuleSoft",
    audience: "Integration specialists using the MuleSoft connector", pathUrl: `${LP}/83/solace-certified-event-driven-integration-mulesoft`,
    cost: "FREE", totalTime: "~6h", stage: 2,
    steps: [
      { title: "Foundations of Event-Driven Architecture", url: `${C}/279/foundations-of-event-driven-architecture`, duration: "3h", price: "FREE" },
      { title: "Solace PubSub+ MuleSoft Connector – Getting Started", url: `${C}/314/solace-pubsub-mulesoft-connector-getting-started`, duration: "1h", price: "FREE", note: "optional prep" },
      { title: "Event-Driven Integration Course – MuleSoft", duration: "2h", price: "FREE" },
      { title: "Architect's Guide To Solace Over Kafka", url: `${C}/345/architects-guide-to-solace-over-kafka`, duration: "31 min", price: "FREE", elective: true },
      { title: "Schema Registry Foundations", url: `${C}/627/schema-registry-foundations`, duration: "2h", price: "FREE", elective: true },
      { title: "Event Portal Essential — Discover, Design, Promote & Push", url: `${C}/577/event-portal-essential-from-discover-and-design-to-promote-and-push`, duration: "4h", price: "FREE", elective: true },
      { title: "Integrated Kafka Bridge", url: `${C}/509/integrated-kafka-bridge`, duration: "1h", price: "$100", elective: true },
      { title: "Event Portal for Kafka", url: `${C}/505/event-portal-for-kafka`, duration: "45 min", price: "$100", elective: true },
      { title: "Solace Certified EDI – MuleSoft Exam", duration: "1h", price: "FREE", cert: true },
    ],
  },
  {
    id: "F", code: "F", title: "Integration Associate", certification: "Solace Certified Integration Associate",
    audience: "Integration architects & developers", pathUrl: `${LP}/56/solace-certified-integration-associate-path`,
    cost: "$500", totalTime: "~10h 30m", stage: 3,
    steps: [
      { title: "Foundations of Event-Driven Architecture", url: `${C}/279/foundations-of-event-driven-architecture`, duration: "3h", price: "FREE", note: "prereq" },
      { title: "Solace Certified EDA Practitioner Exam", url: `${LP}/40/solace-certified-eda-practitioner-path`, duration: "1h 30m", price: "FREE", note: "prereq gate", cert: true },
      { title: "Event-Driven Integration with Solace Platform", url: `${C}/348/event-driven-integration-with-solace-platform`, duration: "4h", price: "$ (in $500 path)" },
      { title: "Architect's Guide To Solace Over Kafka", url: `${C}/345/architects-guide-to-solace-over-kafka`, duration: "31 min", price: "FREE", elective: true },
      { title: "Schema Registry Foundations", url: `${C}/627/schema-registry-foundations`, duration: "2h", price: "FREE", elective: true },
      { title: "Event Portal Essential — Discover, Design, Promote & Push", url: `${C}/577/event-portal-essential-from-discover-and-design-to-promote-and-push`, duration: "4h", price: "FREE", elective: true },
      { title: "Topic Best Practice at Work", url: `${C}/506/topic-best-practice-at-work`, duration: "1h", price: "$100", elective: true },
      { title: "Designing your Event-Driven Architecture", url: `${C}/418/designing-your-event-driven-architecture`, duration: "2h", price: "$50", elective: true },
      { title: "Integrated Kafka Bridge", url: `${C}/509/integrated-kafka-bridge`, duration: "1h", price: "$100", elective: true },
      { title: "Event Portal Workshop", url: `${C}/471/event-portal-workshop`, duration: "4h", price: "$100", elective: true },
      { title: "Solace Certified Integration Associate Exam", duration: "2h", price: "$ (in $500 path)", cert: true },
    ],
  },
  {
    id: "G", code: "G", title: "Event Broker Administrator Associate", certification: "Solace Certified Event Broker Administrator Associate",
    audience: "System admins, engineers, operational staff", pathUrl: `${LP}/38/solace-certified-event-broker-administrator-associate-path`,
    cost: "$500", totalTime: "~15h 33m", stage: 3,
    steps: [
      { title: "Solace Essentials", url: `${C}/503/solace-essentials`, duration: "4h", price: "FREE", note: "prereq" },
      { title: "Event Broker Administrator Associate Path Overview", duration: "3 min", price: "$ (in $500 path)" },
      { title: "Solace Event Broker Administration", url: `${C}/251/solace-event-broker-administration`, duration: "10h", price: "$ (in $500 path)" },
      { title: "Event Broker: Guaranteed Messaging", url: `${C}/521/event-broker-guaranteed-messaging`, duration: "2h", price: "$50", elective: true },
      { title: "Event Broker: High Availability", url: `${C}/522/event-broker-high-availability`, duration: "1h", price: "$50", elective: true },
      { title: "Event Broker: Data Replication", url: `${C}/523/event-broker-data-replication`, duration: "30 min", price: "$50", elective: true },
      { title: "Event Broker: Client Authentication", url: `${C}/519/event-broker-client-authentication`, duration: "1h", price: "$50", elective: true },
      { title: "Event Broker: Client Authorization", url: `${C}/520/event-broker-client-authorization`, duration: "1h", price: "$50", elective: true },
      { title: "Event Broker: Solace Multi-Tenancy", url: `${C}/518/event-broker-solace-multi-tenancy`, duration: "1h", price: "$50", elective: true },
      { title: "Event Broker: Dynamic Message Routing", url: `${C}/525/event-broker-dynamic-message-routing`, duration: "30 min", price: "$50", elective: true },
      { title: "Event Broker: VPN Bridging", url: `${C}/524/event-broker-vpn-bridging`, duration: "30 min", price: "$50", elective: true },
      { title: "Event Broker: Operational Maintenance", url: `${C}/526/event-broker-operational-maintenance`, duration: "1h", price: "$50", elective: true },
      { title: "Declarative SEMP (dSEMP)", url: `${C}/510/declarative-semp-dsemp`, duration: "1h", price: "$100", elective: true },
      { title: "Direct Messaging", url: `${C}/547/direct-messaging`, duration: "1h", price: "$50", elective: true },
      { title: "Partitioned Queues", url: `${C}/468/partitioned-queues`, duration: "30 min", price: "$100", elective: true },
      { title: "Performance Tuning for DMR", url: `${C}/592/performance-tuning-for-dmr`, duration: "2h", price: "FREE", elective: true },
      { title: "PubSub+ Cloud Account Management", url: `${C}/349/pubsub-cloud-account-management`, duration: "1h 30m", price: "$50", elective: true },
      { title: "PubSub+ Cloud Service Management", url: `${C}/346/pubsub-cloud-service-management`, duration: "2h 30m", price: "$50", elective: true },
      { title: "PubSub+ Cloud Mesh Management", url: `${C}/361/pubsub-cloud-mesh-management`, duration: "2h 30m", price: "$50", elective: true },
      { title: "PubSub+ Cloud Insights", url: `${C}/365/pubsub-cloud-insights`, duration: "2h 30m", price: "$50", elective: true },
      { title: "Monitoring with Solace", url: `${C}/333/monitoring-with-solace`, duration: "1h", price: "$50", elective: true },
      { title: "Distributed Tracing for Beginners", url: `${C}/476/distributed-tracing-for-beginners`, duration: "5h", price: "$100", elective: true },
      { title: "Solace Certified Event Broker Administrator Associate Exam", duration: "1h 30m", price: "$ (in $500 path)", cert: true },
    ],
  },
];

// ── Roles → tracks (from the Quick Role-Based Path Selector) ──────────────────
export const ROLES: Role[] = [
  { id: "business", label: "Solution Consultant", icon: "Megaphone", blurb: "Speak event-driven fluently and earn the Solace Certified Solutions Consultant credential.", trackIds: ["A"], time: "~17h", cost: "FREE" },
  { id: "architect", label: "Architect", icon: "PenTool", blurb: "Design event-driven systems and certify as an EDA Practitioner.", trackIds: ["B"], time: "~14h", cost: "FREE" },
  { id: "developer", label: "Software Developer", icon: "Code2", blurb: "Build on PubSub+ and become a certified Developer Practitioner.", trackIds: ["C"], time: "~20h", cost: "FREE" },
  { id: "ai-builder", label: "AI / Agent Systems Builder", icon: "Bot", blurb: "Orchestrate enterprise AI agents and certify on Solace Agent Mesh.", trackIds: ["D"], time: "~14h", cost: "FREE" },
  { id: "integration-boomi", label: "Integration Specialist (Boomi)", icon: "Cable", blurb: "EDA Practitioner, then the Boomi event-driven integration certification.", trackIds: ["B", "E-Boomi"], time: "~20h", cost: "FREE" },
  { id: "integration-sap", label: "Integration Specialist (SAP)", icon: "Cable", blurb: "EDA Practitioner, then the SAP event-driven integration certification.", trackIds: ["B", "E-SAP"], time: "~19h", cost: "FREE" },
  { id: "integration-mulesoft", label: "Integration Specialist (MuleSoft)", icon: "Cable", blurb: "EDA Practitioner, then the MuleSoft event-driven integration certification.", trackIds: ["B", "E-MuleSoft"], time: "~21h", cost: "FREE" },
  { id: "senior-integration", label: "Senior Integration Architect", icon: "Network", blurb: "Go from EDA Practitioner to the paid Integration Associate certification.", trackIds: ["B", "F"], time: "~25h", cost: "$500" },
  { id: "sysadmin", label: "System / Cloud Administrator", icon: "Activity", blurb: "Operate Solace in production and certify as a Broker Administrator Associate.", trackIds: ["G"], time: "~26h", cost: "$500" },
  { id: "fullstack", label: "Full-Stack Solace Expert", icon: "Trophy", blurb: "Everything — all tracks and electives for end-to-end mastery.", trackIds: ["A", "B", "C", "D", "E-Boomi", "F", "G"], time: "60h+", cost: "~$1000" },
];

// ── Full course catalog (FREE + paid) — the standalone "Explore every course"
// browse list. Independent of the tracks above; edit freely.
export const CATALOG: CatalogCourse[] = [
  // FREE
  { title: "Solace Background & Use Cases", url: `${C}/243/solace-background-use-cases`, price: "FREE", duration: "7 min", category: "Foundations" },
  { title: "Being Event-Driven", url: `${C}/228/being-event-driven`, price: "FREE", duration: "40 min", category: "Foundations" },
  { title: "Solace Event Broker Key Features", url: `${C}/244/solace-event-broker-key-features`, price: "FREE", duration: "40 min", category: "Foundations" },
  { title: "Solace Essentials", url: `${C}/503/solace-essentials`, price: "FREE", duration: "4h", category: "Foundations" },
  { title: "Foundations of Event-Driven Architecture", url: `${C}/279/foundations-of-event-driven-architecture`, price: "FREE", duration: "3h", category: "EDA" },
  { title: "A Walk Through the Journey of Microservices", url: `${C}/84/a-walk-through-the-journey-of-microservices`, price: "FREE", duration: "~30 min", category: "Getting Started" },
  { title: "How to Build an Event Mesh with Solace PubSub+", url: `${C}/179/how-to-build-an-event-mesh-with-solace-pubsub`, price: "FREE", duration: "9 min", category: "Getting Started" },
  { title: "Event Portal Essential — Discover, Design, Promote & Push", url: `${C}/577/event-portal-essential-from-discover-and-design-to-promote-and-push`, price: "FREE", duration: "4h", category: "Event Management" },
  { title: "Schema Registry Foundations", url: `${C}/627/schema-registry-foundations`, price: "FREE", duration: "2h", category: "Event Streaming" },
  { title: "Performance Tuning for DMR", url: `${C}/592/performance-tuning-for-dmr`, price: "FREE", duration: "2h", category: "Event Streaming" },
  { title: "Architect's Guide To Solace Over Kafka", url: `${C}/345/architects-guide-to-solace-over-kafka`, price: "FREE", duration: "31 min", category: "Integration" },
  { title: "Distributed Tracing in Solace PubSub+ Broker", url: `${C}/412/distributed-tracing-in-solace-pubsub-broker`, price: "FREE", duration: "45 min", category: "Insights" },
  { title: "Event-Driven Integration Course – Boomi", url: `${C}/597/event-driven-integration-course-boomi`, price: "FREE", duration: "1h", category: "Integration" },
  { title: "Event-Driven Integration Course – SAP", url: `${C}/593/event-driven-integration-course-sap`, price: "FREE", duration: "1h", category: "Integration" },
  { title: "Solace PubSub+ Boomi Connector – Getting Started", url: `${C}/338/solace-pubsub-boomi-connector-getting-started`, price: "FREE", duration: "30 min", category: "APIs & Integration" },
  { title: "Solace PubSub+ MuleSoft Connector – Getting Started", url: `${C}/314/solace-pubsub-mulesoft-connector-getting-started`, price: "FREE", duration: "1h", category: "APIs & Integration" },
  { title: "Learning Materials – Developer Practitioner Exam", url: `${C}/326/learning-materials-solace-certified-developer-practitioner-exam`, price: "FREE", duration: "5h", category: "Developer Cert Prep" },
  // PAID
  { title: "Designing your Event-Driven Architecture", url: `${C}/418/designing-your-event-driven-architecture`, price: "$50", duration: "2h", category: "Architecture" },
  { title: "Direct Messaging", url: `${C}/547/direct-messaging`, price: "$50", duration: "1h", category: "Admin" },
  { title: "Event Broker: Operational Maintenance", url: `${C}/526/event-broker-operational-maintenance`, price: "$50", duration: "1h", category: "Admin" },
  { title: "Event Broker: Dynamic Message Routing", url: `${C}/525/event-broker-dynamic-message-routing`, price: "$50", duration: "30 min", category: "Admin" },
  { title: "Event Broker: VPN Bridging", url: `${C}/524/event-broker-vpn-bridging`, price: "$50", duration: "30 min", category: "Admin" },
  { title: "Event Broker: Data Replication", url: `${C}/523/event-broker-data-replication`, price: "$50", duration: "30 min", category: "Admin" },
  { title: "Event Broker: High Availability", url: `${C}/522/event-broker-high-availability`, price: "$50", duration: "1h", category: "Admin" },
  { title: "Event Broker: Guaranteed Messaging", url: `${C}/521/event-broker-guaranteed-messaging`, price: "$50", duration: "2h", category: "Admin" },
  { title: "Event Broker: Client Authorization", url: `${C}/520/event-broker-client-authorization`, price: "$50", duration: "1h", category: "Admin" },
  { title: "Event Broker: Client Authentication", url: `${C}/519/event-broker-client-authentication`, price: "$50", duration: "1h", category: "Admin" },
  { title: "Event Broker: Solace Multi-Tenancy", url: `${C}/518/event-broker-solace-multi-tenancy`, price: "$50", duration: "1h", category: "Admin" },
  { title: "PubSub+ Cloud Account Management", url: `${C}/349/pubsub-cloud-account-management`, price: "$50", duration: "1h 30m", category: "Cloud" },
  { title: "PubSub+ Cloud Service Management", url: `${C}/346/pubsub-cloud-service-management`, price: "$50", duration: "2h 30m", category: "Cloud" },
  { title: "PubSub+ Cloud Mesh Management", url: `${C}/361/pubsub-cloud-mesh-management`, price: "$50", duration: "2h 30m", category: "Cloud" },
  { title: "PubSub+ Cloud Insights", url: `${C}/365/pubsub-cloud-insights`, price: "$50", duration: "2h 30m", category: "Cloud" },
  { title: "Monitoring with Solace", url: `${C}/333/monitoring-with-solace`, price: "$50", duration: "1h", category: "Insights" },
  { title: "Topic Best Practice at Work", url: `${C}/506/topic-best-practice-at-work`, price: "$100", duration: "1h", category: "Event Streaming" },
  { title: "Integrated Kafka Bridge", url: `${C}/509/integrated-kafka-bridge`, price: "$100", duration: "1h", category: "Event Streaming" },
  { title: "Event Portal for Kafka", url: `${C}/505/event-portal-for-kafka`, price: "$100", duration: "45 min", category: "Event Management" },
  { title: "Event Portal Workshop", url: `${C}/471/event-portal-workshop`, price: "$100", duration: "4h", category: "Event Management" },
  { title: "Declarative SEMP (dSEMP)", url: `${C}/510/declarative-semp-dsemp`, price: "$100", duration: "1h", category: "Admin / APIs" },
  { title: "Partitioned Queues", url: `${C}/468/partitioned-queues`, price: "$100", duration: "30 min", category: "Event Streaming" },
  { title: "Distributed Tracing for Beginners", url: `${C}/476/distributed-tracing-for-beginners`, price: "$100", duration: "5h", category: "Insights" },
];

export const ACADEMY_URL = "https://training.solace.com/learn";
