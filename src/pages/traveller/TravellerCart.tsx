import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "sonner";
import type { CartItem } from "@/components/AddToTripButton";

const CART_KEY = "masaar.cart";
const BOOKINGS_KEY = "masaar.bookings";

interface BookingRecord {
  id: string;
  guestName: string;
  guestEmail: string;
  businessName: string;
  governorateId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending";
  createdAt: number;
  notes: string;
}

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function readBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? (JSON.parse(raw) as BookingRecord[]) : [];
  } catch {
    return [];
  }
}

export default function TravellerCart() {
  const { t } = useApp();
  const nav = useNavigate();

  // ── Cart state ──────────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(readCart());
  }, []);

  const removeItem = (id: string) => {
    const updated = cart.filter((c) => c.id !== id);
    setCart(updated);
    localStorage.setItem(CART_KEY, JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  };

  // ── Checkout form state ──────────────────────────────────────
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  // ── Submit ───────────────────────────────────────────────────
  const handleBook = () => {
    if (!guestName.trim() || !guestEmail.trim()) {
      toast.error(t("الاسم والبريد الإلكتروني مطلوبان", "Name and email are required"));
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error(t("تاريخ الوصول والمغادرة مطلوبان", "Check-in and check-out dates are required"));
      return;
    }
    if (cart.length === 0) {
      toast.error(t("سلة رحلتك فارغة", "Your trip cart is empty"));
      return;
    }

    const nights = Math.max(
      1,
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
    );

    const newBookings: BookingRecord[] = cart.map((item) => ({
      id: crypto.randomUUID(),
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      businessName: item.name,
      governorateId: item.governorateId,
      checkIn,
      checkOut,
      guests: Number(guests),
      totalPrice: item.price ? item.price * nights : 0,
      status: "pending",
      createdAt: Date.now(),
      notes: "",
    }));

    const existing = readBookings();
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([...existing, ...newBookings]));

    // Clear cart
    localStorage.removeItem(CART_KEY);
    setCart([]);

    toast.success(t("تم إرسال الحجز! تحقق من صندوق الأعمال.", "Booking sent! Check business inbox."));
    nav("/traveller/discover");
  };

  // ── Input shared style ───────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(200,168,130,0.25)",
    background: "rgba(255,255,255,0.05)",
    color: "inherit",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    marginBottom: "4px",
    color: "var(--muted-foreground, #888)",
  };

  // ── Empty state ──────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <AppShell>
        <AppHeader title={t("رحلتي", "My Trip")} showBack />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 24px",
            gap: "16px",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "56px", lineHeight: 1 }}>🧳</span>
          <p style={{ fontSize: "16px", fontWeight: 600 }}>
            {t("سلة رحلتك فارغة", "Your trip cart is empty")}
          </p>
          <p style={{ fontSize: "13px", color: "var(--muted-foreground, #888)", maxWidth: "240px" }}>
            {t(
              "ابدأ بإضافة وجهات أو عروض إلى رحلتك",
              "Start by adding destinations or offers to your trip"
            )}
          </p>
          <button
            onClick={() => nav("/traveller/discover")}
            className="btn-primary"
            style={{ marginTop: "8px" }}
          >
            {t("اكتشف الوجهات", "Discover Destinations")}
          </button>
        </div>
      </AppShell>
    );
  }

  // ── Main layout ──────────────────────────────────────────────
  return (
    <AppShell>
      <AppHeader title={t("رحلتي / My Trip", "رحلتي / My Trip")} showBack />

      <div style={{ padding: "16px 16px 32px" }}>

        {/* ── Cart items ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700 }}>
            {t("عناصر الرحلة", "Trip Items")}
            <span style={{ marginInlineStart: "6px", fontSize: "12px", color: "var(--muted-foreground, #888)", fontWeight: 400 }}>
              ({cart.length})
            </span>
          </h2>
          <button
            onClick={clearCart}
            style={{
              fontSize: "11px",
              color: "#ff453a",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            {t("مسح الكل", "Clear All")}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: "14px",
                border: "1px solid rgba(200,168,130,0.18)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.name}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "1px 7px",
                      borderRadius: "999px",
                      fontWeight: 600,
                      background: item.type === "destination" ? "rgba(10,132,255,0.15)" : "rgba(255,159,10,0.15)",
                      color: item.type === "destination" ? "#0a84ff" : "#ff9f0a",
                    }}
                  >
                    {item.type === "destination"
                      ? t("وجهة", "Destination")
                      : t("عرض", "Offer")}
                  </span>
                  {item.price != null && (
                    <span style={{ fontSize: "12px", color: "var(--muted-foreground, #888)" }}>
                      {item.price.toLocaleString()} {t("د.أ / ليلة", "JOD / night")}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                aria-label={t("إزالة", "Remove")}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,69,58,0.3)",
                  background: "rgba(255,69,58,0.1)",
                  color: "#ff453a",
                  fontSize: "16px",
                  lineHeight: 1,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* ── Checkout form ── */}
        <div
          style={{
            padding: "20px 16px",
            borderRadius: "16px",
            border: "1px solid rgba(200,168,130,0.2)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>
            {t("حجز رحلتك", "Book Your Trip")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Guest Name */}
            <div>
              <label style={labelStyle}>{t("الاسم الكامل", "Full Name")}</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={t("الاسم الكامل", "Full Name")}
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>{t("البريد الإلكتروني", "Email")}</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder={t("البريد الإلكتروني", "Email")}
                style={inputStyle}
              />
            </div>

            {/* Check-in / Check-out */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={labelStyle}>{t("تاريخ الوصول", "Check-in")}</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t("تاريخ المغادرة", "Check-out")}</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label style={labelStyle}>{t("عدد المسافرين", "Guests")}</label>
              <input
                type="number"
                min={1}
                max={8}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                style={{ ...inputStyle, width: "100px" }}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleBook}
              className="btn-primary"
              style={{ marginTop: "8px", width: "100%" }}
            >
              {t("احجز رحلتك", "Book This Trip")}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
