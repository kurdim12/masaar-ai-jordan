import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Locale = "en" | "ar";
export type UserType = "traveller" | "investor" | "business" | null;

export interface TravellerProfile {
  nationality?: string;
  interests: string[];
  groupSize?: string;
  budget?: string;
  dateFrom?: string;
  dateTo?: string;
}
export interface InvestorProfile {
  focus?: string;
  capital?: string;
  region?: string;
}
export interface BusinessProfile {
  type?: string;
  location?: string;
  rooms?: number;
  capacity?: number;
  minPrice?: number;
  maxPrice?: number;
  name?: string;
  description?: string;
  photo?: string;
}

export interface FlashOffer {
  id: string;
  businessName: string;
  governorateId: string;
  roomType: string;
  rooms: number;
  originalPrice: number;
  offerPrice: number;
  duration: string;
  date: string;
  descAr?: string;
  descEn?: string;
  emergency?: boolean;
  views: number;
  createdAt: number;
}

interface AppCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (ar: string, en: string) => string;
  userType: UserType;
  setUserType: (u: UserType) => void;
  clearUserType: () => void;
  travellerProfile: TravellerProfile;
  setTravellerProfile: (p: TravellerProfile) => void;
  investorProfile: InvestorProfile;
  setInvestorProfile: (p: InvestorProfile) => void;
  businessProfile: BusinessProfile;
  setBusinessProfile: (p: BusinessProfile) => void;
  offers: FlashOffer[];
  addOffer: (o: FlashOffer) => void;
  notifications: { id: string; titleAr: string; titleEn: string; time: number }[];
  pushNotification: (n: { titleAr: string; titleEn: string }) => void;
  geminiKey: string;
  setGeminiKey: (k: string) => void;
  notifyTenders: string[];
  toggleNotifyTender: (id: string) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleRaw] = useState<Locale>(() => (localStorage.getItem("masaar.locale") as Locale) || "en");
  const [userType, setUserTypeRaw] = useState<UserType>(() => (localStorage.getItem("masaar.userType") as UserType) || null);
  const [travellerProfile, setTravellerProfile] = useState<TravellerProfile>(() => {
    try { return JSON.parse(localStorage.getItem("masaar.tp") || '{"interests":[]}'); } catch { return { interests: [] }; }
  });
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile>(() => {
    try { return JSON.parse(localStorage.getItem("masaar.ip") || "{}"); } catch { return {}; }
  });
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    try { return JSON.parse(localStorage.getItem("masaar.bp") || "{}"); } catch { return {}; }
  });
  const [offers, setOffers] = useState<FlashOffer[]>(() => {
    try { return JSON.parse(localStorage.getItem("masaar.offers") || "[]"); } catch { return []; }
  });
  const [notifications, setNotifications] = useState<AppCtx["notifications"]>([]);
  const [geminiKey, setGeminiKeyRaw] = useState<string>(() => localStorage.getItem("masaar.gemini") || "");
  const [notifyTenders, setNotifyTenders] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("masaar.tenders") || "[]"); } catch { return []; }
  });

  // Seed a few demo offers if empty so traveller/business screens look alive
  useEffect(() => {
    if (offers.length === 0) {
      const seed: FlashOffer[] = [
        {
          id: "seed-1", businessName: "Bait Ali Camp", governorateId: "wadi_rum", roomType: "tent",
          rooms: 3, originalPrice: 80, offerPrice: 55, duration: "24h",
          date: new Date().toISOString().slice(0,10),
          descAr: "ليلة سحرية تحت نجوم وادي رم — خيمة بدوية فاخرة بإطلالة على الجبال الحمراء.",
          descEn: "A magical night under Wadi Rum's stars — luxury Bedouin tent with mountain views.",
          views: 124, createdAt: Date.now() - 3600000,
        },
        {
          id: "seed-2", businessName: "Mövenpick Petra", governorateId: "petra", roomType: "double",
          rooms: 2, originalPrice: 180, offerPrice: 120, duration: "12h",
          date: new Date().toISOString().slice(0,10),
          descAr: "غرفة مزدوجة على بُعد خطوات من بوابة البتراء — مع إفطار بوفيه.",
          descEn: "Double room steps from Petra's gate — buffet breakfast included.",
          views: 287, createdAt: Date.now() - 7200000,
        },
      ];
      setOffers(seed);
    }
  }, []); // eslint-disable-line

  useEffect(() => { localStorage.setItem("masaar.locale", locale); document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { if (userType) localStorage.setItem("masaar.userType", userType); }, [userType]);
  useEffect(() => { localStorage.setItem("masaar.tp", JSON.stringify(travellerProfile)); }, [travellerProfile]);
  useEffect(() => { localStorage.setItem("masaar.ip", JSON.stringify(investorProfile)); }, [investorProfile]);
  useEffect(() => { localStorage.setItem("masaar.bp", JSON.stringify(businessProfile)); }, [businessProfile]);
  useEffect(() => { localStorage.setItem("masaar.offers", JSON.stringify(offers)); }, [offers]);
  useEffect(() => { localStorage.setItem("masaar.gemini", geminiKey); }, [geminiKey]);
  useEffect(() => { localStorage.setItem("masaar.tenders", JSON.stringify(notifyTenders)); }, [notifyTenders]);

  const t = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const setLocale = (l: Locale) => setLocaleRaw(l);
  const setUserType = (u: UserType) => setUserTypeRaw(u);
  const clearUserType = () => { localStorage.removeItem("masaar.userType"); setUserTypeRaw(null); };
  const setGeminiKey = (k: string) => setGeminiKeyRaw(k);
  const addOffer = (o: FlashOffer) => setOffers(prev => [o, ...prev]);
  const pushNotification = (n: { titleAr: string; titleEn: string }) =>
    setNotifications(prev => [{ id: crypto.randomUUID(), time: Date.now(), ...n }, ...prev].slice(0, 30));
  const toggleNotifyTender = (id: string) =>
    setNotifyTenders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <Ctx.Provider value={{
      locale, setLocale, t, userType, setUserType, clearUserType,
      travellerProfile, setTravellerProfile,
      investorProfile, setInvestorProfile,
      businessProfile, setBusinessProfile,
      offers, addOffer, notifications, pushNotification,
      geminiKey, setGeminiKey, notifyTenders, toggleNotifyTender,
    }}>
      {children}
    </Ctx.Provider>
  );
};

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
};
