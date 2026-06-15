export interface ContentSection {
  title: string;
  paragraph: string;
}

export const TERMS_CONTENT: ContentSection[] = [
  {
    title: "1. Acceptance of Terms",
    paragraph: "Welcome to SEAPEDIA. By creating an account, joining as a buyer or seller, or using our marketplace platform, you agree to abide by these Terms and Conditions. If you do not agree, please do not use our services.",
  },
  {
    title: "2. User Accounts & Security",
    paragraph: "You are responsible for keeping your login credentials confidential. You must immediately notify us of any unauthorized use of your account. Users may hold multiple roles (Buyer, Seller, Driver) but must operate in accordance with active session authorizations.",
  },
  {
    title: "3. Marketplace Transactions",
    paragraph: "SEAPEDIA acts as an intermediary platform enabling buyers to purchase items from third-party sellers. We do not own, inspect, or guarantee the products listed by sellers. Payments are held securely and released according to our escrow protection policies.",
  },
  {
    title: "4. Order & Cart Policies",
    paragraph: "Our shopping cart is locked to a single store entity at any given time. If you attempt to checkout items from multiple stores, you will be prompted to resolve the cart conflict. Prices displayed include statutory PPN (12%) and delivery calculations dynamically.",
  },
  {
    title: "5. Prohibited Activities",
    paragraph: "Users may not list counterfeit products, violate intellectual property rights, manipulate ratings, or post harmful scripts/XSS payloads. Violations will result in immediate account termination.",
  },
];

export const PRIVACY_CONTENT: ContentSection[] = [
  {
    title: "1. Information We Collect",
    paragraph: "We collect personal information that you provide to us, including your first name, last name, email address, phone number, and billing/shipping addresses necessary for transactions and delivery coordination.",
  },
  {
    title: "2. How We Use Your Information",
    paragraph: "Your details are used to process orders, facilitate communication between buyers and sellers, authorize role-based dashboard access, calculation of delivery routing, and prevent fraudulent transactions.",
  },
  {
    title: "3. Data Sharing & Third Parties",
    paragraph: "To fulfill purchases, we share transaction-specific data (e.g., shipping address and contact info) with relevant sellers and assigned delivery drivers. We never sell your personal information to third-party advertisers.",
  },
  {
    title: "4. Cookies & Trackers",
    paragraph: "We use session cookies to keep you logged in, save your active session role preferences, and remember your shopping cart items temporarily.",
  },
  {
    title: "5. Data Retention & Security",
    paragraph: "We protect your data using robust encryption. We retain transaction data as required by law for auditing and tax compliance. You may request account deletion at any time by contacting customer support.",
  },
];
