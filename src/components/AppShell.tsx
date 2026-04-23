import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export const AppShell = ({
  children,
  hideNav = false,
  lightMode = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
  lightMode?: boolean;
}) => (
  <div className={`min-h-screen bg-background ${lightMode ? "light-mode" : ""}`}>
    <div className="max-w-md mx-auto min-h-screen relative pb-20">
      {children}
    </div>
    {!hideNav && <BottomNav />}
  </div>
);
