import { ReactNode, useEffect, useState } from "react";
import { MapSkeleton } from "./Skeletons";

/**
 * Renders a MapSkeleton briefly, then mounts the real map after first paint.
 * Prevents the layout flash while leaflet tiles load and gives users an obvious loading state.
 */
export const MapMount = ({ children, height }: { children: ReactNode; height?: number }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 250);
    return () => window.clearTimeout(id);
  }, []);
  if (!ready) return <MapSkeleton height={height} />;
  return <>{children}</>;
};
