import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import BottomNav from "@/components/ui/BottomNav";
import ToastContainer from "@/components/ui/ToastContainer";
import ResetButton from "@/components/ui/ResetButton";
import GraderGuide from "@/components/ui/GraderGuide";
import PersonaSwitcher from "@/components/ui/PersonaSwitcher";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QuickDash — AI-Powered Quick Commerce",
  description:
    "QuickDash MVP: An AI-native quick commerce platform driving cross-category product discovery through smart subscriptions, hyperlocal trends, and social commerce.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#051424",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-dash-bg text-dash-text-primary min-h-screen font-sans">
        <AppProvider>
          {/* Mobile container */}
          <div className="mx-auto max-w-[430px] min-h-screen relative pb-20">
            {/* Persona switcher header */}
            <PersonaSwitcher />

            {/* Main content */}
            <main>{children}</main>

            {/* Bottom navigation */}
            <BottomNav />

            {/* Floating controls */}
            <ResetButton />
            <GraderGuide />

            {/* Toast notifications */}
            <ToastContainer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
