"use client";

export default function SettingsLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-8 py-6">{children}</div>;
}
