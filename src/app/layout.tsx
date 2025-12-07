import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./AuthProvider";
import { ChatWidget } from "@/components/ChatWidget";
import { Header } from "@/components/Header";
import { PageBackground } from "@/components/PageBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EntreNousCours | Cours entre étudiants et professeurs tunisiens",
  description:
    "EntreNousCours est une plateforme tunisienne de mise en relation pour des cours en ligne (Google Meet) et en présentiel entre étudiants et enseignants.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#EFECE3] text-black`}
      >
        <AuthProvider>
          <Header />
          <PageBackground>
            {children}
          </PageBackground>
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
