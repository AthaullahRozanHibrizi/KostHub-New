import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "KostHub – Temukan Kost Impian Anda",
    template: "%s | KostHub",
  },
  description:
    "Platform terbaik untuk mencari dan menyewakan kost di seluruh Indonesia. Temukan kost pilihan dengan harga terjangkau dan fasilitas lengkap.",
  keywords: ["kost", "sewa kost", "cari kost", "kost murah", "boarding house"],
  openGraph: {
    title: "KostHub – Temukan Kost Impian Anda",
    description: "Platform terbaik untuk mencari dan menyewakan kost di seluruh Indonesia.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <SessionProvider session={session}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1f2937",
                color: "#f9fafb",
                border: "1px solid #374151",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
