import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import type { Booking } from "@/context/AppContext";

const FLAG: Record<string, string> = { SA: "🇸🇦", AE: "🇦🇪", UK: "🇬🇧", JO: "🇯🇴", US: "🇺🇸", DE: "🇩🇪", FR: "🇫🇷" };

function statusColor(s: Booking["status"]): { bg: string; color: string; label: { ar: string; en: string } } {
  if (s === "pending")    return { bg: "hsl(37 100% 52% / 0.15)",  color: "hsl(37 100% 52%)",  label: { ar: "معلق",         en: "Pending" } };
  if (s === "accepted")   return { bg: "hsl(211 100% 52% / 0.15)", color: "hsl(211 100% 62%)", label: { ar: "مقبول",        en: "Accepted" } };
  if (s === "checked_in") return { bg: "hsl(141 63% 50% / 0.15)",  color: "hsl(141 63% 50%)",  label: { ar: "مسجل الدخول",  en: "Checked In" } };
  if (s === "completed")  return { bg: "hsl(0 0% 40% / 0.15)",     color: "hsl(0 0% 55%)",     label: { ar: "مكتمل",        en: "Completed" } };
  return                        { bg: "hsl(3 100% 61% / 0.15)",    color: "hsl(3 100% 61%)",   label: { ar: "مرفوض",        en: "Declined" } };
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function nights(b: Booking) {
  try { return Math.max(1, Math.round((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / 86400000)); }
  catch { return 1; }
}

type Tab = "inbox" | "calendar" | "guests" | "revenue";

export default function BusinessBookings() {
  const { t, bookings, updateBooking } = useApp();
  const [tab, setTab] = useState<Tab>("inbox");

  const sorted = [...bookings].sort((a, b) => b.createdAt - a.createdAt);
  const pending = sorted.filter(b => b.status === "pending");
  const active  = sorted.filter(b => b.status === "checked_in" || b.status === "accepted");
  const done    = sorted.filter(b => b.status === "completed");

  const totalRevenue = [...active, ...done].reduce((s, b) => s + b.totalPrice, 0);
  const totalNights  = done.reduce((s, b) => s + nights(b), 0);
  const adr          = totalNights > 0 ? Math.round(totalRevenue / totalNights) : 0;
  const pendingValue = pending.reduce((s, b) => s + b.totalPrice, 0);

  const TABS: { id: Tab; ar: string; en: string }[] = [
    { id: "inbox",    ar: "الوارد",    en: "Inbox"    },
    { id: "calendar", ar: "التقويم",   en: "Calendar" },
    { id: "guests",   ar: "النزلاء",   en: "Guests"   },
    { id: "revenue",  ar: "الإيراد",   en: "Revenue"  },
  ];

  return (
    <AppShell>
      <AppHeader title={t("الحجوزات", "Bookings")} />
      <div className="px-4 pt-3">

        {/* Tab bar */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 mb-4">
          {TABS.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors"
              style={{
                background: tab === tb.id ? "hsl(211 100% 52%)" : "hsl(240 2% 24%)",
                color: tab === tb.id ? "#fff" : "hsl(0 0% 62%)",
              }}>
              {t(tb.ar, tb.en)}
              {tb.id === "inbox" && pending.length > 0 && (
                <span className="ms-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "hsl(37 100% 52%)", color: "#000" }}>
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── INBOX ── */}
        {tab === "inbox" && (
          <div className="space-y-3 animate-fade-in">
            {pending.length === 0 && active.length === 0 && done.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-4xl mb-3">📭</div>
                <p>{t("لا توجد حجوزات بعد", "No bookings yet")}</p>
              </div>
            )}
            {pending.length > 0 && (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t("طلبات معلقة", "Pending Requests")}</h3>
                {pending.map(b => <BookingCard key={b.id} b={b} onAccept={() => updateBooking(b.id, "accepted")} onDecline={() => updateBooking(b.id, "declined")} />)}
              </>
            )}
            {active.length > 0 && (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-2">{t("نشطة", "Active")}</h3>
                {active.map(b => <BookingCard key={b.id} b={b} />)}
              </>
            )}
            {done.length > 0 && (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-2">{t("مكتملة", "Completed")}</h3>
                {done.map(b => <BookingCard key={b.id} b={b} />)}
              </>
            )}
          </div>
        )}

        {/* ── CALENDAR ── */}
        {tab === "calendar" && (
          <div className="animate-fade-in space-y-4">
            <CalendarView bookings={sorted} t={t} />
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: { ar: "الليالي المحجوزة", en: "Booked Nights" }, value: totalNights },
                { label: { ar: "الإشغال", en: "Occupancy" }, value: `${Math.min(100, Math.round(totalNights / 30 * 100))}%` },
                { label: { ar: "متوسط السعر", en: "ADR" }, value: `${adr} JD` },
              ].map((k, i) => (
                <div key={i} className="card-masaar text-center !p-3">
                  <div className="text-lg font-bold">{k.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{t(k.label.ar, k.label.en)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GUESTS ── */}
        {tab === "guests" && (
          <div className="space-y-3 animate-fade-in">
            {Array.from(new Map(sorted.map(b => [b.guestEmail, b])).values()).map(b => {
              const stays = sorted.filter(x => x.guestEmail === b.guestEmail);
              const spent = stays.reduce((s, x) => s + x.totalPrice, 0);
              const { bg, color, label } = statusColor(b.status);
              return (
                <div key={b.guestEmail} className="card-masaar flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-[13px]"
                    style={{ background: "hsl(211 100% 52% / 0.2)", color: "hsl(211 100% 62%)" }}>
                    {initials(b.guestName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{b.guestName}</span>
                      <span className="text-base">{FLAG[b.nationality || ""] || "🌍"}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: bg, color }}>{t(label.ar, label.en)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{stays.length} {t("إقامات", "stays")} · {spent} JD {t("إجمالي", "total")}</p>
                    <div className="flex gap-2 mt-2">
                      <a href={`mailto:${b.guestEmail}`}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: "hsl(240 2% 24%)", color: "hsl(0 0% 80%)" }}>
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        {t("مراسلة", "Email")}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── REVENUE ── */}
        {tab === "revenue" && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: { ar: "إجمالي الإيراد", en: "Total Revenue" }, value: `${totalRevenue} JD`, color: "hsl(141 63% 50%)" },
                { label: { ar: "الليالي المحجوزة", en: "Total Nights" }, value: totalNights, color: "hsl(211 100% 62%)" },
                { label: { ar: "متوسط السعر اليومي", en: "ADR" }, value: `${adr} JD`, color: "hsl(37 100% 52%)" },
                { label: { ar: "قيمة المعلقة", en: "Pending Value" }, value: `${pendingValue} JD`, color: "hsl(37 100% 52%)" },
              ].map((k, i) => (
                <div key={i} className="card-masaar !p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">{t(k.label.ar, k.label.en)}</div>
                  <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>
            <h3 className="font-display text-base">{t("أعلى الحجوزات", "Top Bookings")}</h3>
            <div className="space-y-2">
              {[...done, ...active].sort((a, b) => b.totalPrice - a.totalPrice).slice(0, 8).map(b => {
                const { bg, color, label } = statusColor(b.status);
                return (
                  <div key={b.id} className="card-masaar flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{b.guestName}</div>
                      <div className="text-xs text-muted-foreground">{b.checkIn} → {b.checkOut}</div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: bg, color }}>{t(label.ar, label.en)}</span>
                    <span className="font-bold text-sm flex-shrink-0">{b.totalPrice} JD</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </AppShell>
  );
}

function BookingCard({ b, onAccept, onDecline }: { b: Booking; onAccept?: () => void; onDecline?: () => void }) {
  const { t } = useApp();
  const { bg, color, label } = statusColor(b.status);
  const n = nights(b);
  return (
    <div className="card-masaar space-y-3 animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{b.guestName}</span>
            <span className="text-base">{FLAG[b.nationality || ""] || "🌍"}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{b.roomType || t("غرفة", "Room")} · {b.guests} {t("نزيل", "guest")} · {n} {t("ليلة", "nights")}</p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: bg, color }}>{t(label.ar, label.en)}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>📅 {b.checkIn} → {b.checkOut}</span>
        <span className="font-semibold text-foreground">{b.totalPrice} JD</span>
      </div>
      {b.notes && <p className="text-xs italic text-muted-foreground">{b.notes}</p>}
      {b.status === "pending" && onAccept && onDecline && (
        <div className="flex gap-2 pt-1">
          <button onClick={onAccept} className="flex-1 py-2 rounded-full text-sm font-semibold" style={{ background: "hsl(141 63% 50%)", color: "#000" }}>{t("قبول", "Accept")}</button>
          <button onClick={onDecline} className="flex-1 py-2 rounded-full text-sm font-semibold" style={{ background: "hsl(3 100% 61% / 0.15)", color: "hsl(3 100% 61%)", border: "0.5px solid hsl(3 100% 61% / 0.3)" }}>{t("رفض", "Decline")}</button>
        </div>
      )}
    </div>
  );
}

function CalendarView({ bookings, t }: { bookings: Booking[]; t: (ar: string, en: string) => string }) {
  const now = new Date(2026, 3, 1); // April 2026
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0

  const dotColor = (day: number): string | null => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    for (const b of bookings) {
      if (b.checkIn <= dateStr && dateStr <= b.checkOut) {
        if (b.status === "checked_in") return "hsl(141 63% 50%)";
        if (b.status === "accepted")   return "hsl(211 100% 62%)";
        if (b.status === "pending")    return "hsl(37 100% 52%)";
      }
    }
    return null;
  };

  const DOW = ["M","T","W","T","F","S","S"];

  return (
    <div className="card-masaar">
      <h3 className="font-display text-base mb-3">
        {new Date(year, month).toLocaleString("en", { month: "long" })} {year}
      </h3>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DOW.map((d, i) => <div key={i} className="text-center text-[10px] text-muted-foreground py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dot = dotColor(day);
          const isToday = day === 24;
          return (
            <div key={day} className="flex flex-col items-center py-1">
              <span className="text-[12px]" style={{ color: isToday ? "hsl(211 100% 62%)" : "hsl(0 0% 80%)", fontWeight: isToday ? 700 : 400 }}>{day}</span>
              {dot ? <span className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: dot }} /> : <span className="w-1.5 h-1.5 mt-0.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
