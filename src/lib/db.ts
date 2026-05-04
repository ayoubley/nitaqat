import { supabase } from "./supabase";
import type { Category, Domain, Offer } from "./types";

/* =========================
   CATEGORIES
========================= */

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCategories error:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/* =========================
   DOMAINS
========================= */

export async function getDomains(): Promise<Domain[]> {
  const { data, error } = await supabase
    .from("domains")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getDomains error:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/* =========================
   DOMAIN BY SLUG
========================= */

export async function getDomainBySlug(slug: string) {
  const { data, error } = await supabase
    .from("domains")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getDomainBySlug error:", error);
    return null;
  }

  return data ?? null;
}

/* =========================
   CREATE DOMAIN
========================= */

export async function createDomain(
  domain: Omit<Domain, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from("domains")
    .insert([domain])
    .select()
    .single();

  if (error) {
    console.error("createDomain error:", error);
    return null;
  }

  return data ?? null;
}

/* =========================
   UPDATE DOMAIN
========================= */

export async function updateDomain(id: string, patch: Partial<Domain>) {
  const { data, error } = await supabase
    .from("domains")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateDomain error:", error);
    return null;
  }

  return data ?? null;
}

/* =========================
   DELETE DOMAIN
========================= */

export async function deleteDomain(id: string) {
  const { error } = await supabase
    .from("domains")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteDomain error:", error);
  }
}

/* =========================
   INCREMENT VIEWS (SAFE)
========================= */

export async function incrementViews(id: string) {
  const { data, error } = await supabase
    .from("domains")
    .select("views")
    .eq("id", id)
    .single();

  if (error || !data) return;

  const currentViews = typeof data.views === "number" ? data.views : 0;

  await supabase
    .from("domains")
    .update({ views: currentViews + 1 })
    .eq("id", id);
}

/* =========================
   OFFERS
========================= */

export async function getOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOffers error:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/* =========================
   CREATE OFFER
========================= */

export async function createOffer(offer: Partial<Offer>) {
  console.log("📤 محاولة إرسال العرض:", offer);
  
  const { data, error } = await supabase
    .from("offers")
    .insert([
      {
        domainId: offer.domainId,
        buyerName: offer.buyerName,
        email: offer.email,
        phone: offer.phone || null,
        offerAmount: Number(offer.offerAmount) || 0,
        message: offer.message || null,
        status: 'UNREAD' // أو 'pending' حسب ما تستخدمه
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ خطأ أثناء حفظ العرض:", error.message);
    return null;
  }

  console.log("✅ تم الحفظ بنجاح:", data);
  return data;
}

/* =========================
   UPDATE OFFER STATUS
========================= */

export async function updateOfferStatus(
  id: string,
  status: Offer["status"]
) {
  const { data, error } = await supabase
    .from("offers")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateOfferStatus error:", error);
    return null;
  }

  return data ?? null;
}

/* =========================
   DELETE OFFER
========================= */

export async function deleteOffer(id: string) {
  const { error } = await supabase
    .from("offers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteOffer error:", error);
  }
}

/* =========================
   SITE CONFIG
========================= */

export const SITE_CONFIG = {
  whatsappNumber: "971500000000",
  brandName: "نِطاقات",
  brandNameEn: "Nitaqat",
  email: "sales@nitaqat.boutique",
};