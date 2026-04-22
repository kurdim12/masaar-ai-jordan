import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export const AppShell = ({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) => (
  <div className="min-h-screen bg-background">
    <div className="max-w-md mx-auto min-h-screen relative pb-20">
      {children}
    </div>
    {!hideNav && <BottomNav />}
  </div>
);
