import "../styles/globals.css";

export default function AppLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body className="fill-black">{children}</body>
      </html>
    </>
  );
}
