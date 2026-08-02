import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import BottomNav from "@/components/ui/BottomNav";
import ToastContainer from "@/components/ui/ToastContainer";
import ResetButton from "@/components/ui/ResetButton";
import GraderGuide from "@/components/ui/GraderGuide";
import PhoneFrame from "@/components/ui/PhoneFrame";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Blinkit — Everything delivered in 8 minutes",
  description:
    "Blinkit Quick Commerce MVP: Subscriptions, Hyperlocal Demand, and Social Circles.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F8CB46",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0A0B10] text-gray-900 h-screen max-h-screen overflow-hidden font-sans antialiased">
        <AppProvider>
          {/* Smartphone Mockup Frame */}
          <PhoneFrame>
            {/* Main scrollable content area */}
            <main className="flex-1 pb-20">{children}</main>

            {/* Bottom navigation bar */}
            <BottomNav />

            {/* Floating evaluation controls */}
            <ResetButton />
            <GraderGuide />

            {/* Toast notifications */}
            <ToastContainer />
          </PhoneFrame>
        </AppProvider>
      </body>
    </html>
  );
}

