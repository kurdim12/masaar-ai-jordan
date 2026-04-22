// Demo account seeders.
// Writes to BOTH the spec localStorage keys (masaar_*) AND the
// existing AppContext keys (masaar.*) so the running app picks them up
// after a hard reload.

export type DemoOffer = {
  id: string;
  roomType: string;
  rooms: number;
  date: string;
  originalPrice: number;
  offerPrice: number;
  duration: string;
  expiresIn: string;
  views: number;
  businessName: string;
  location: string; // governorate id, e.g. "petra"
  description: string;
  descriptionAr: string;
};

export const investorDemo = {
  role: "investor" as const,
  profile: {
    name: "خالد المحاميد",
    nationality: "Jordan",
    investmentTypes: ["Camp / Eco-lodge", "Wellness center"],
    capitalRange: "200K - 500K JD",
    focusRegion: "wadi_rum",
    locale: "ar",
  },
  watchlist: [
    {
      govId: "wadi_rum",
      savedAt: "2025-01-15",
      note: "أولوية عالية — فجوة الإيكو لودج واضحة",
      score: 9.2,
    },
    {
      govId: "dead_sea",
      savedAt: "2025-01-20", 
      note: "مركز علاجي متخصص — طلب متنامٍ",
      score: 9.0,
    },
  ],
  locale: "ar" as const,
};

export const businessDemo = {
  role: "business" as const,
  profile: {
    name: "Nour Alkhatib",
    businessName: "Rose City Guesthouse",
    businessType: "Guesthouse",
    location: "petra",
    rooms: 12,
    minPrice: 45,
    maxPrice: 85,
    locale: "en",
  },
  offers: [
    {
      id: "offer_demo_1",
      roomType: "Double Room",
      rooms: 2,
      date: "Tonight",
      originalPrice: 75,
      offerPrice: 55,
      duration: "12h",
      expiresIn: "11h 30m",
      views: 47,
      businessName: "Rose City Guesthouse",
      location: "petra",
      description:
        "Cozy double room with stunning Petra view. Wake up steps away from the Siq. Book now for an unforgettable night in the Rose City.",
      descriptionAr:
        "غرفة مزدوجة دافئة مع إطلالة رائعة على البتراء. استيقظ على بُعد خطوات من السيق. احجز الآن لقضاء ليلة لا تُنسى في المدينة الوردية.",
    },
  ] as DemoOffer[],
  locale: "en" as const,
};

export function loadInvestorDemo() {
  // Spec keys
  localStorage.setItem("masaar_role", investorDemo.role);
  localStorage.setItem("masaar_investor_profile", JSON.stringify(investorDemo.profile));
  localStorage.setItem("masaar_watchlist", JSON.stringify(investorDemo.watchlist));
  localStorage.setItem("masaar_locale", investorDemo.locale);
  localStorage.removeItem("masaar_banner_investor_dismissed");
  // Bridge to AppContext keys
  localStorage.setItem("masaar.userType", "investor");
  localStorage.setItem("masaar.locale", "ar");
  localStorage.setItem(
    "masaar.ip",
    JSON.stringify({
      focus: investorDemo.profile.investmentTypes.join(", "),
      capital: investorDemo.profile.capitalRange,
      region: investorDemo.profile.focusRegion,
    })
  );
}

export function loadBusinessDemo() {
  localStorage.setItem("masaar_role", businessDemo.role);
  localStorage.setItem("masaar_business_profile", JSON.stringify(businessDemo.profile));
  localStorage.setItem("masaar_active_offers", JSON.stringify(businessDemo.offers));
  localStorage.setItem("masaar_locale", businessDemo.locale);
  localStorage.removeItem("masaar_banner_business_dismissed");
  // Bridge to AppContext
  localStorage.setItem("masaar.userType", "business");
  localStorage.setItem("masaar.locale", "en");
  localStorage.setItem(
    "masaar.bp",
    JSON.stringify({
      name: businessDemo.profile.businessName,
      type: businessDemo.profile.businessType,
      location: businessDemo.profile.location,
      rooms: businessDemo.profile.rooms,
      minPrice: businessDemo.profile.minPrice,
      maxPrice: businessDemo.profile.maxPrice,
    })
  );
  // Also push the demo offer into context offers (merged with existing seeds)
  try {
    const existing = JSON.parse(localStorage.getItem("masaar.offers") || "[]");
    const mapped = businessDemo.offers.map((o) => ({
      id: o.id,
      businessName: o.businessName,
      governorateId: o.location,
      roomType: o.roomType,
      rooms: o.rooms,
      originalPrice: o.originalPrice,
      offerPrice: o.offerPrice,
      duration: o.duration,
      date: new Date().toISOString().slice(0, 10),
      descAr: o.descriptionAr,
      descEn: o.description,
      views: o.views,
      createdAt: Date.now(),
    }));
    const filtered = existing.filter((e: { id: string }) => !mapped.find((m) => m.id === e.id));
    localStorage.setItem("masaar.offers", JSON.stringify([...mapped, ...filtered]));
  } catch {
    /* ignore */
  }
}

export function isDemoMode(): boolean {
  return (
    !!localStorage.getItem("masaar_investor_profile") ||
    !!localStorage.getItem("masaar_business_profile")
  );
}

export function clearAllDemoKeys() {
  [
    "masaar_role",
    "masaar_investor_profile",
    "masaar_business_profile",
    "masaar_active_offers",
    "masaar_watchlist",
    "masaar_locale",
    "masaar_banner_investor_dismissed",
    "masaar_banner_business_dismissed",
  ].forEach((k) => localStorage.removeItem(k));
}

export function getActiveDemoOffers(): DemoOffer[] {
  try {
    return JSON.parse(localStorage.getItem("masaar_active_offers") || "[]");
  } catch {
    return [];
  }
}

export function getInvestorWatchlist(): typeof investorDemo.watchlist {
  try {
    return JSON.parse(localStorage.getItem("masaar_watchlist") || "[]");
  } catch {
    return [];
  }
}

export function setInvestorWatchlist(list: typeof investorDemo.watchlist) {
  localStorage.setItem("masaar_watchlist", JSON.stringify(list));
}
