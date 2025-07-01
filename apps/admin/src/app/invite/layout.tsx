import React from "react";

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {children}
    </div>
  );
}
