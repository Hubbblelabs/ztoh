import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/ModalProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import LayoutContent from "@/components/layout/LayoutContent";
import Chatbot from "@/components/Chatbot";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Zero to Hero",
  description: "Join Zero to Hero for top-tier tutoring and mentorship. Transform your potential into success with our expert-led courses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-slate-50 font-sans antialiased flex flex-col",
          inter.variable,
          plusJakarta.variable
        )}
      >
        <ToastProvider>
          <AuthSessionProvider>
            <ModalProvider>
              <LayoutContent>
                {children}
              </LayoutContent>
            </ModalProvider>
          </AuthSessionProvider>
        </ToastProvider>
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
