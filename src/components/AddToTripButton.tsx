import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  type: "destination" | "offer";
  name: string;
  nameAr: string;
  governorateId: string;
  price?: number;
  image?: string;
}

interface AddToTripButtonProps {
  item: CartItem;
  className?: string;
}

const CART_KEY = "masaar.cart";
const LOCALE_KEY = "masaar.locale";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export const AddToTripButton = ({ item, className }: AddToTripButtonProps) => {
  const [inCart, setInCart] = useState(false);

  // Sync inCart state on mount (and whenever item.id changes)
  useEffect(() => {
    const cart = readCart();
    setInCart(cart.some((c) => c.id === item.id));
  }, [item.id]);

  const locale = localStorage.getItem(LOCALE_KEY) ?? "en";
  const isAr = locale === "ar";

  const handleClick = () => {
    const cart = readCart();
    const alreadyIn = cart.some((c) => c.id === item.id);

    if (alreadyIn) {
      // Remove from cart
      const updated = cart.filter((c) => c.id !== item.id);
      writeCart(updated);
      setInCart(false);
    } else {
      // Add to cart
      const updated = [...cart, item];
      writeCart(updated);
      setInCart(true);
      toast.success(isAr ? "تمت الإضافة للرحلة!" : "Added to trip!");
    }
  };

  const defaultStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid rgba(10,132,255,0.3)",
    background: "rgba(10,132,255,0.12)",
    color: "#0a84ff",
    transition: "opacity 0.15s",
    whiteSpace: "nowrap",
  };

  const addedStyle: React.CSSProperties = {
    ...defaultStyle,
    border: "1px solid rgba(48,209,88,0.3)",
    background: "rgba(48,209,88,0.12)",
    color: "#30d158",
  };

  return (
    <button
      onClick={handleClick}
      style={inCart ? addedStyle : defaultStyle}
      className={className}
      aria-label={inCart ? (isAr ? "إزالة من الرحلة" : "Remove from trip") : (isAr ? "أضف للرحلة" : "Add to trip")}
      type="button"
    >
      {inCart ? (
        <>
          <span>✓</span>
          <span>{isAr ? "في الرحلة ✓" : "In Trip ✓"}</span>
        </>
      ) : (
        <>
          <span>🧳</span>
          <span>{isAr ? "أضف للرحلة" : "Add to Trip"}</span>
        </>
      )}
    </button>
  );
};
