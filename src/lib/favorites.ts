// Favorites system using localStorage + Supabase
import type { Domain } from "./types";
import { getDomains } from "./db";

const STORAGE_KEY = "nitaqat:favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addFavorite(domainId: string) {
  const favorites = getFavorites();
  if (!favorites.includes(domainId)) {
    favorites.push(domainId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(domainId: string) {
  const favorites = getFavorites();
  const filtered = favorites.filter((id) => id !== domainId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function isFavorite(domainId: string): boolean {
  return getFavorites().includes(domainId);
}

export function toggleFavorite(domainId: string): boolean {
  if (isFavorite(domainId)) {
    removeFavorite(domainId);
    return false;
  } else {
    addFavorite(domainId);
    return true;
  }
}

// ✅ نسخة async الصحيحة
export async function getFavoriteDomains(): Promise<Domain[]> {
  try {
    const favorites = getFavorites();
    const allDomains = await getDomains(); // ✅ انتظار الـ Promise
    
    if (!Array.isArray(allDomains)) {
      console.error("❌ getDomains() لم ترجع مصفوفة:", allDomains);
      return [];
    }
    
    if (!Array.isArray(favorites)) {
      console.error("❌ getFavorites() لم ترجع مصفوفة:", favorites);
      return [];
    }
    
    const result = allDomains.filter((d: Domain) => {
      if (!d || typeof d !== "object" || !d.id) {
        console.warn("⚠️ عنصر نطاق غير صالح:", d);
        return false;
      }
      return favorites.includes(d.id);
    });
    
    console.log("✅ تم تحميل", result.length, "نطاق مفضل من أصل", favorites.length, "مفضل");
    return result;
  } catch (error) {
    console.error("❌ خطأ في getFavoriteDomains:", error);
    return [];
  }
}