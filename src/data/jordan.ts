export type Crowd = "high" | "medium" | "low";
export type GovernorateType = "cultural" | "nature" | "coastal" | "religious" | "medical" | "adventure" | "food";

export interface Governorate {
  id: string;
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
  crowd: Crowd;
  type: GovernorateType[];
  visitors: number;
  occupancy: number;
  bestTime: string;
  bestTimeAr: string;
  altTime: string;
  altTimeAr: string;
  avgNight: number;
  rating: number;
  growth: number;
  bedGap: number;
  image: string;
  description: { ar: string; en: string };
  // Investment dimension: opportunity (red=high opp, gold=medium, jade=low/saturated)
  opportunity: "high" | "medium" | "low";
  opportunityType: { ar: string; en: string };
  priorityScore: number;
  recommendation: { ar: string; en: string };
  suggestedInvestments: { ar: string; en: string }[];
}

export const governorates: Governorate[] = [
  {
    id: "petra", nameAr: "البتراء", nameEn: "Petra",
    lat: 30.3285, lng: 35.4444, crowd: "high", type: ["cultural", "adventure"],
    visitors: 847000, occupancy: 82, bestTime: "Mar–May", bestTimeAr: "مارس–مايو",
    altTime: "Sep–Oct", altTimeAr: "سبتمبر–أكتوبر",
    avgNight: 65, rating: 4.7, growth: 12, bedGap: 800,
    image: "https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?w=1200&q=80",
    description: { ar: "مدينة وردية محفورة في الصخر", en: "Rose-red city carved into rock" },
    opportunity: "medium", opportunityType: { ar: "فنادق بوتيك تراثية", en: "Heritage boutique hotels" },
    priorityScore: 8.4,
    recommendation: { ar: "توسع في الإقامة الفاخرة قرب البوابة الرئيسية", en: "Expand premium lodging near main gate" },
    suggestedInvestments: [
      { ar: "فندق بوتيك", en: "Boutique hotel" },
      { ar: "تجارب فاخرة", en: "Premium experiences" },
      { ar: "مطاعم تراثية", en: "Heritage dining" },
    ],
  },
  {
    id: "wadi_rum", nameAr: "وادي رم", nameEn: "Wadi Rum",
    lat: 29.5832, lng: 35.4197, crowd: "medium", type: ["nature", "adventure"],
    visitors: 312000, occupancy: 71, bestTime: "Oct–Mar", bestTimeAr: "أكتوبر–مارس",
    altTime: "Apr–May", altTimeAr: "أبريل–مايو",
    avgNight: 90, rating: 4.8, growth: 22, bedGap: 1400,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    description: { ar: "صحراء خلابة ذات تجارب بيئية فريدة", en: "Desert wilderness with unique eco experiences" },
    opportunity: "high", opportunityType: { ar: "فجوة إيكو لودج", en: "Eco-lodge gap" },
    priorityScore: 9.2,
    recommendation: { ar: "إقامة بيئية فاخرة — الطلب يفوق العرض بشكل كبير", en: "Premium eco-stays — demand far exceeds supply" },
    suggestedInvestments: [
      { ar: "إيكو لودج فاخر", en: "Luxury eco-lodge" },
      { ar: "تجارب صحراوية", en: "Desert experiences" },
      { ar: "خيام فلكية", en: "Stargazing camps" },
    ],
  },
  {
    id: "aqaba", nameAr: "العقبة", nameEn: "Aqaba",
    lat: 29.5320, lng: 35.0063, crowd: "medium", type: ["coastal", "medical"],
    visitors: 1240000, occupancy: 78, bestTime: "Mar–Nov", bestTimeAr: "مارس–نوفمبر",
    altTime: "Dec–Feb", altTimeAr: "ديسمبر–فبراير",
    avgNight: 110, rating: 4.5, growth: 14, bedGap: 1800,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80",
    description: { ar: "نافذة الأردن على البحر الأحمر", en: "Jordan's window to the Red Sea" },
    opportunity: "high", opportunityType: { ar: "منتجعات شاطئية متوسطة", en: "Mid-tier beachfront resorts" },
    priorityScore: 8.7,
    recommendation: { ar: "منتجعات للعائلات بأسعار متوسطة", en: "Mid-priced family resorts" },
    suggestedInvestments: [
      { ar: "منتجع شاطئي", en: "Beach resort" },
      { ar: "مركز غوص", en: "Diving center" },
      { ar: "كروز نهري", en: "Coastal cruises" },
    ],
  },
  {
    id: "dead_sea", nameAr: "البحر الميت", nameEn: "Dead Sea",
    lat: 31.5590, lng: 35.4732, crowd: "low", type: ["medical", "nature"],
    visitors: 680000, occupancy: 61, bestTime: "Year-round", bestTimeAr: "طوال السنة",
    altTime: "Oct–Apr", altTimeAr: "أكتوبر–أبريل",
    avgNight: 140, rating: 4.6, growth: 18, bedGap: 2400,
    image: "https://images.unsplash.com/photo-1544550285-f813152fb2fd?w=1200&q=80",
    description: { ar: "أخفض نقطة على وجه الأرض وأشهر وجهة علاجية", en: "Lowest point on Earth and premier wellness destination" },
    opportunity: "high", opportunityType: { ar: "مراكز علاجية متخصصة", en: "Specialized wellness centers" },
    priorityScore: 9.0,
    recommendation: { ar: "مراكز علاج جلدي وسبا طبي — السوق العالمي ينمو 15% سنوياً", en: "Dermatology & medical spas — global market growing 15% YoY" },
    suggestedInvestments: [
      { ar: "منتجع علاجي", en: "Wellness resort" },
      { ar: "عيادات جلدية", en: "Dermatology clinics" },
      { ar: "مركز سبا طبي", en: "Medical spa" },
    ],
  },
  {
    id: "amman", nameAr: "عمّان", nameEn: "Amman",
    lat: 31.9539, lng: 35.9106, crowd: "medium", type: ["cultural", "food"],
    visitors: 2100000, occupancy: 74, bestTime: "Mar–May, Sep–Oct", bestTimeAr: "مارس–مايو، سبتمبر–أكتوبر",
    altTime: "Nov–Feb", altTimeAr: "نوفمبر–فبراير",
    avgNight: 85, rating: 4.4, growth: 9, bedGap: 600,
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=80",
    description: { ar: "عاصمة المملكة وبوابتها للعالم", en: "Capital and gateway of the kingdom" },
    opportunity: "low", opportunityType: { ar: "سوق مشبع — تنويع الخدمات", en: "Saturated market — service diversification" },
    priorityScore: 6.2,
    recommendation: { ar: "تجارب طعام وثقافة متخصصة", en: "Curated food & culture experiences" },
    suggestedInvestments: [
      { ar: "مطاعم تجريبية", en: "Experiential dining" },
      { ar: "جولات ثقافية", en: "Cultural tours" },
    ],
  },
  {
    id: "jerash", nameAr: "جرش", nameEn: "Jerash",
    lat: 32.2761, lng: 35.8997, crowd: "low", type: ["cultural"],
    visitors: 420000, occupancy: 44, bestTime: "Mar–May", bestTimeAr: "مارس–مايو",
    altTime: "Sep–Nov", altTimeAr: "سبتمبر–نوفمبر",
    avgNight: 55, rating: 4.6, growth: 16, bedGap: 900,
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80",
    description: { ar: "روما الشرق — أعظم مدينة رومانية خارج إيطاليا", en: "Rome of the East — greatest Roman city outside Italy" },
    opportunity: "high", opportunityType: { ar: "فنادق تراثية", en: "Heritage hotels" },
    priorityScore: 8.1,
    recommendation: { ar: "إقامة قريبة من المدينة الأثرية مفقودة تماماً", en: "Stay options near the ruins are virtually missing" },
    suggestedInvestments: [
      { ar: "فندق تراثي", en: "Heritage hotel" },
      { ar: "بيت ضيافة", en: "Guesthouse" },
    ],
  },
  {
    id: "madaba", nameAr: "مادبا", nameEn: "Madaba",
    lat: 31.7175, lng: 35.7931, crowd: "low", type: ["cultural", "religious"],
    visitors: 290000, occupancy: 52, bestTime: "Mar–May", bestTimeAr: "مارس–مايو",
    altTime: "Oct–Nov", altTimeAr: "أكتوبر–نوفمبر",
    avgNight: 50, rating: 4.5, growth: 11, bedGap: 500,
    image: "https://images.unsplash.com/photo-1609776876099-5a3e50a8c0cf?w=1200&q=80",
    description: { ar: "مدينة الفسيفساء والتراث المسيحي", en: "City of mosaics and Christian heritage" },
    opportunity: "medium", opportunityType: { ar: "سياحة دينية منظمة", en: "Organized religious tourism" },
    priorityScore: 7.0,
    recommendation: { ar: "حزم سياحة دينية مع جبل نيبو", en: "Faith-based tour packages with Mount Nebo" },
    suggestedInvestments: [
      { ar: "بيت ضيافة عائلي", en: "Family guesthouse" },
      { ar: "ورشة فسيفساء", en: "Mosaic workshop" },
    ],
  },
  {
    id: "karak", nameAr: "الكرك", nameEn: "Karak",
    lat: 31.1795, lng: 35.7045, crowd: "low", type: ["cultural", "religious"],
    visitors: 185000, occupancy: 38, bestTime: "Mar–Nov", bestTimeAr: "مارس–نوفمبر",
    altTime: "Year-round", altTimeAr: "طوال السنة",
    avgNight: 45, rating: 4.3, growth: 24, bedGap: 700,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    description: { ar: "قلعة تاريخية شامخة فوق جبال الكرك", en: "Historic crusader castle overlooking the highlands" },
    opportunity: "high", opportunityType: { ar: "وجهة ناشئة — فرصة الدخول المبكر", en: "Emerging destination — first-mover advantage" },
    priorityScore: 7.8,
    recommendation: { ar: "بيوت تراثية وتجارب محلية أصيلة", en: "Heritage stays and authentic local experiences" },
    suggestedInvestments: [
      { ar: "بيت تراثي", en: "Heritage house" },
      { ar: "مطعم محلي", en: "Local restaurant" },
    ],
  },
];

export const filterTypes: { id: GovernorateType | "all"; ar: string; en: string; icon: string }[] = [
  { id: "all", ar: "الكل", en: "All", icon: "apps" },
  { id: "cultural", ar: "تاريخي", en: "Cultural", icon: "account_balance" },
  { id: "nature", ar: "طبيعة", en: "Nature", icon: "forest" },
  { id: "coastal", ar: "شاطئ", en: "Coastal", icon: "beach_access" },
  { id: "religious", ar: "ديني", en: "Religious", icon: "mosque" },
  { id: "medical", ar: "علاجي", en: "Wellness", icon: "spa" },
  { id: "adventure", ar: "مغامرة", en: "Adventure", icon: "hiking" },
];

export const interestChips = [
  { id: "cultural", ar: "🏛 تاريخ وثقافة", en: "🏛 History & Culture" },
  { id: "nature", ar: "🌿 طبيعة ومغامرة", en: "🌿 Nature & Adventure" },
  { id: "coastal", ar: "🏖 شاطئ", en: "🏖 Coastal" },
  { id: "religious", ar: "🕌 سياحة دينية", en: "🕌 Religious Tourism" },
  { id: "medical", ar: "💆 سياحة علاجية", en: "💆 Medical & Wellness" },
  { id: "food", ar: "🍽 مطبخ وطعام", en: "🍽 Food & Cuisine" },
];

export const tenders = [
  { id: "t1", titleAr: "مشروع منتجع سياحي في وادي رم", titleEn: "Wadi Rum Eco-Resort Development", authority: { ar: "وزارة السياحة", en: "Ministry of Tourism" }, location: { ar: "وادي رم", en: "Wadi Rum" }, deadline: "2025-06-30", budget: "500K – 2M JD", type: "hotel" },
  { id: "t2", titleAr: "مركز علاجي متكامل بالبحر الميت", titleEn: "Dead Sea Wellness Center", authority: { ar: "هيئة المنطقة الاقتصادية الخاصة", en: "Special Economic Zone Authority" }, location: { ar: "البحر الميت", en: "Dead Sea" }, deadline: "2025-07-15", budget: "1M – 5M JD", type: "medical" },
  { id: "t3", titleAr: "تطوير الواجهة البحرية في العقبة", titleEn: "Aqaba Waterfront Development", authority: { ar: "سلطة منطقة العقبة الاقتصادية", en: "Aqaba Special Economic Zone Authority" }, location: { ar: "العقبة", en: "Aqaba" }, deadline: "2025-08-01", budget: "2M – 10M JD", type: "entertainment" },
  { id: "t4", titleAr: "فندق تراثي في جرش", titleEn: "Heritage Hotel in Jerash", authority: { ar: "وزارة السياحة", en: "Ministry of Tourism" }, location: { ar: "جرش", en: "Jerash" }, deadline: "2025-05-30", budget: "200K – 800K JD", type: "hotel" },
  { id: "t5", titleAr: "تطوير الينابيع الحرارية في الزرقاء", titleEn: "Zarqa Thermal Springs Development", authority: { ar: "وزارة الصحة", en: "Ministry of Health" }, location: { ar: "الزرقاء", en: "Zarqa" }, deadline: "2025-09-15", budget: "300K – 1M JD", type: "medical" },
];

export const aiTips = [
  { ar: "✨ البتراء مزدحمة في مايو — أبريل أهدأ وأرخص", en: "✨ Petra is busy in May — April is quieter and cheaper" },
  { ar: "✨ وادي رم: أكتوبر–مارس أفضل لطقس مريح", en: "✨ Wadi Rum: best Oct–Mar for comfortable temperatures" },
  { ar: "✨ البحر الميت: العلاج الجلدي متاح طوال السنة", en: "✨ Dead Sea: dermatology treatments available year-round" },
  { ar: "✨ جرش هادئة الآن — فرصة رائعة للزيارة", en: "✨ Jerash is quiet now — a perfect time to visit" },
];

// Forecast data for Investor flow
export const forecastData: Record<string, { month: string; visitors: number | null; forecast: number | null }[]> = {
  "Wadi Rum": [
    { month: "Jan", visitors: 18000, forecast: null },
    { month: "Feb", visitors: 15000, forecast: null },
    { month: "Mar", visitors: 28000, forecast: null },
    { month: "Apr", visitors: 38000, forecast: null },
    { month: "May", visitors: 41000, forecast: null },
    { month: "Jun", visitors: 29000, forecast: null },
    { month: "Jul", visitors: 22000, forecast: null },
    { month: "Aug", visitors: 35000, forecast: null },
    { month: "Sep", visitors: 38000, forecast: null },
    { month: "Oct", visitors: 31000, forecast: 31000 },
    { month: "Nov", visitors: null, forecast: 34000 },
    { month: "Dec", visitors: null, forecast: 38000 },
    { month: "Jan+", visitors: null, forecast: 42000 },
  ],
  "Petra": [
    { month: "Jan", visitors: 42000, forecast: null },
    { month: "Feb", visitors: 38000, forecast: null },
    { month: "Mar", visitors: 71000, forecast: null },
    { month: "Apr", visitors: 89000, forecast: null },
    { month: "May", visitors: 95000, forecast: null },
    { month: "Jun", visitors: 67000, forecast: null },
    { month: "Jul", visitors: 55000, forecast: null },
    { month: "Aug", visitors: 88000, forecast: null },
    { month: "Sep", visitors: 91000, forecast: null },
    { month: "Oct", visitors: 76000, forecast: 76000 },
    { month: "Nov", visitors: null, forecast: 82000 },
    { month: "Dec", visitors: null, forecast: 91000 },
    { month: "Jan+", visitors: null, forecast: 98000 },
  ],
  "Dead Sea": [
    { month: "Jan", visitors: 62000, forecast: null },
    { month: "Feb", visitors: 58000, forecast: null },
    { month: "Mar", visitors: 71000, forecast: null },
    { month: "Apr", visitors: 74000, forecast: null },
    { month: "May", visitors: 69000, forecast: null },
    { month: "Jun", visitors: 52000, forecast: null },
    { month: "Jul", visitors: 44000, forecast: null },
    { month: "Aug", visitors: 55000, forecast: null },
    { month: "Sep", visitors: 67000, forecast: null },
    { month: "Oct", visitors: 61000, forecast: 61000 },
    { month: "Nov", visitors: null, forecast: 65000 },
    { month: "Dec", visitors: null, forecast: 70000 },
    { month: "Jan+", visitors: null, forecast: 68000 },
  ],
  "Aqaba": [
    { month: "Jan", visitors: 88000, forecast: null },
    { month: "Feb", visitors: 79000, forecast: null },
    { month: "Mar", visitors: 98000, forecast: null },
    { month: "Apr", visitors: 112000, forecast: null },
    { month: "May", visitors: 118000, forecast: null },
    { month: "Jun", visitors: 104000, forecast: null },
    { month: "Jul", visitors: 95000, forecast: null },
    { month: "Aug", visitors: 119000, forecast: null },
    { month: "Sep", visitors: 115000, forecast: null },
    { month: "Oct", visitors: 103000, forecast: 103000 },
    { month: "Nov", visitors: null, forecast: 110000 },
    { month: "Dec", visitors: null, forecast: 118000 },
    { month: "Jan+", visitors: null, forecast: 125000 },
  ],
  "Jerash": [
    { month: "Jan", visitors: 24000, forecast: null },
    { month: "Feb", visitors: 21000, forecast: null },
    { month: "Mar", visitors: 44000, forecast: null },
    { month: "Apr", visitors: 58000, forecast: null },
    { month: "May", visitors: 62000, forecast: null },
    { month: "Jun", visitors: 41000, forecast: null },
    { month: "Jul", visitors: 32000, forecast: null },
    { month: "Aug", visitors: 51000, forecast: null },
    { month: "Sep", visitors: 54000, forecast: null },
    { month: "Oct", visitors: 46000, forecast: 46000 },
    { month: "Nov", visitors: null, forecast: 52000 },
    { month: "Dec", visitors: null, forecast: 58000 },
    { month: "Jan+", visitors: null, forecast: 65000 },
  ],
};

export const forecastInsights: Record<string, { ar: string; en: string }> = {
  "Wadi Rum": {
    ar: "الطلب متوقع أن ينمو 22% بحلول الموسم القادم. الطاقة الاستيعابية للإيكو لودج تلبي 68% فقط من الطلب — إشارة استثمارية قوية.",
    en: "Demand projected to grow 22% by next season. Eco-lodge capacity meets only 68% of forecasted demand — strong investment signal.",
  },
  "Petra": {
    ar: "ذروة الموسم (مارس–مايو) متوقع تجاوز مستويات 2024 بـ 15%. نقص الأسرة سيتفاقم بدون توسعة فورية.",
    en: "Peak season (Mar-May) demand expected to exceed 2024 levels by 15%. Bed shortage will worsen without immediate capacity expansion.",
  },
  "Dead Sea": {
    ar: "السياحة العلاجية تدفع طلباً مستقراً طوال السنة. التوقعات تظهر نمواً 12% مدفوعاً بسياح الصحة الأوروبيين.",
    en: "Medical & wellness tourism driving steady year-round demand. Forecast shows 12% growth driven by European health tourists.",
  },
  "Aqaba": {
    ar: "مسار نمو مستقر بمعدل 9% سنوياً. التوقعات تشير لفجوة في الإقامة المتوسطة 80–120 د.أ/ليلة.",
    en: "Stable growth trajectory at 9% annually. Forecast suggests mid-tier accommodation gap in the 80-120 JD/night segment.",
  },
  "Jerash": {
    ar: "أسرع موقع تراثي نمواً في الأردن بـ 14% سنوياً. نقص حاد في الإقامة — 890 غرفة فقط لـ 420 ألف زائر سنوياً.",
    en: "Fastest growing heritage site in Jordan at 14% YoY. Severe accommodation shortage — only 890 rooms for 420K annual visitors.",
  },
};

// Forecast data for Business flow (next 12 weeks)
export const businessForecast = [
  { week: "W1 Jan", demand: 45 },
  { week: "W2 Jan", demand: 42 },
  { week: "W3 Jan", demand: 38 },
  { week: "W4 Jan", demand: 35 },
  { week: "W1 Feb", demand: 40 },
  { week: "W2 Feb", demand: 48 },
  { week: "W3 Feb", demand: 55 },
  { week: "W4 Feb", demand: 62 },
  { week: "W1 Mar", demand: 72 },
  { week: "W2 Mar", demand: 85 },
  { week: "W3 Mar", demand: 91 },
  { week: "W4 Mar", demand: 88 },
];
