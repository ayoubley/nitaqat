export type DomainStatus = "AVAILABLE" | "PENDING" | "SOLD";
export type OfferStatus = "UNREAD" | "READ" | "REJECTED" | "ACCEPTED";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Domain {
  id: string;
  name: string;          // e.g. "aqar"
  tld: string;           // e.g. ".com"
  arabicName?: string;   // e.g. "عقار"
  description?: string;
  price: number | null;  // null => Make Offer
  views: number;
  status: DomainStatus;
  categoryId: string;
  featured?: boolean;
  createdAt: string;
}

export interface Offer {
  id: string;
  domainId: string;
  buyerName: string;
  email: string;
  phone?: string;
  offerAmount: number;
  message?: string;
  status: OfferStatus;
  createdAt: string;
}
