export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white print:bg-white min-h-screen">
      {children}
    </div>
  );
}
