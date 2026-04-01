"use client";

import { useAdmin } from "@/providers/admin-provider";
import { usePathname } from "next/navigation";

interface AdminContentWrapperProps {
  children: React.ReactNode;
  isAdmin: boolean;
}

export function AdminContentWrapper({ children, isAdmin }: AdminContentWrapperProps) {
  const { sidebarOpen } = useAdmin();
  const pathname = usePathname();

  // No margin shift for non-admins or on the admin page itself
  if (!isAdmin || pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div
      className="transition-[margin-left] duration-200 ease-out"
      style={{
        marginLeft: sidebarOpen ? 260 : 0,
      }}
    >
      {children}
    </div>
  );
}
