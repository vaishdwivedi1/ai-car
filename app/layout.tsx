import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Common/Header";
import { Toaster } from "sonner";
import Footer from "@/components/Common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vheql",
  description: "Find your Dream Car",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Toaster richColors />
        <Footer />
      </body>
    </html>
  );
}
