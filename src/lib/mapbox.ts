// Mapbox configuration + custom HTML marker factories
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

export const DARK_STYLE = "mapbox://styles/mapbox/dark-v11";
export const WARM_STYLE = "mapbox://styles/mapbox/outdoors-v12";

export const JORDAN_CENTER: [number, number] = [36.5, 31.2];
export const JORDAN_ZOOM = 6.6;

export const OPP_COLOR: Record<string, string> = {
  high: "#C17B5C",
  medium: "#EEC058",
  low: "#2D9E7F",
};

export const CROWD_COLOR: Record<string, string> = {
  high: "#C17B5C",
  medium: "#EEC058",
  low: "#2D9E7F",
};

export function createInvestorMarker(score: number, opp: string): HTMLElement {
  const size = Math.max(30, Math.min(64, score * 5));
  const color = OPP_COLOR[opp] || "#C8A882";
  const textColor = opp === "medium" ? "#0D1B2A" : "#ffffff";

  const el = document.createElement("div");
  el.style.cssText = `
    width: ${size}px; height: ${size}px;
    background: ${color};
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: ${size > 40 ? 13 : 11}px;
    font-weight: 600;
    color: ${textColor};
    cursor: pointer;
    border: 2px solid rgba(255,255,255,0.20);
    box-shadow: 0 4px 16px rgba(0,0,0,0.55);
    transition: transform 0.2s ease;
  `;
  el.textContent = String(score);
  el.addEventListener("mouseenter", () => { el.style.transform = "scale(1.12)"; });
  el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });
  return el;
}

export function createTravellerMarker(crowd: string, label: string): HTMLElement {
  const color = CROWD_COLOR[crowd] || "#C8A882";
  const wrap = document.createElement("div");
  wrap.style.cssText = `position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;`;

  const dot = document.createElement("div");
  dot.style.cssText = `
    width: 26px; height: 26px;
    background: ${color};
    border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,0.92);
    box-shadow: 0 3px 10px rgba(0,0,0,0.35);
    transition: transform 0.2s ease;
  `;

  const chip = document.createElement("div");
  chip.style.cssText = `
    margin-top: 5px;
    background: rgba(255,255,255,0.96);
    border-radius: 6px;
    padding: 2px 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 600;
    color: #1A120A;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0,0,0,0.18);
    pointer-events: none;
  `;
  chip.textContent = label;

  wrap.appendChild(dot);
  wrap.appendChild(chip);
  wrap.addEventListener("mouseenter", () => { dot.style.transform = "scale(1.15)"; });
  wrap.addEventListener("mouseleave", () => { dot.style.transform = "scale(1)"; });
  return wrap;
}
