import { Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

// Root: route based on whether the user has chosen a path before
export default function Index() {
  const { userType } = useApp();
  if (!userType) return <Navigate to="/splash" replace />;
  if (userType === "traveller") return <Navigate to="/traveller/discover" replace />;
  if (userType === "investor") return <Navigate to="/investor/map" replace />;
  return <Navigate to="/business/dashboard" replace />;
}
