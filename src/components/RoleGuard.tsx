import { Navigate, useLocation } from "react-router-dom";
import { useApp, UserType } from "@/context/AppContext";
import { ReactNode } from "react";

const homeFor = (u: UserType) =>
  u === "traveller" ? "/traveller/discover"
  : u === "investor" ? "/investor/map"
  : u === "business" ? "/business/dashboard"
  : "/path";

export const RoleGuard = ({ allow, children }: { allow: Exclude<UserType, null>; children: ReactNode }) => {
  const { userType } = useApp();
  const loc = useLocation();
  if (!userType) return <Navigate to="/path" replace state={{ from: loc.pathname }} />;
  if (userType !== allow) return <Navigate to={homeFor(userType)} replace />;
  return <>{children}</>;
};
