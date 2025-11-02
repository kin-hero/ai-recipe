import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChefGPT - AI Recipe Generator",
  description: "Transform ingredients into culinary magic with AI-powered recipe generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#FF6347",
          colorBackground: "#1C1C1E",
          colorInputBackground: "#2C2C2E",
          colorInputText: "#FFFFFF",
          colorText: "#FFFFFF",
          colorTextSecondary: "#8E8E93",
          colorDanger: "#FF4500",
          borderRadius: "12px",
        },
        elements: {
          card: "bg-[#2C2C2E] border border-[#FF6347]/20",
          headerTitle: "text-white",
          headerSubtitle: "text-[#8E8E93]",
          socialButtonsBlockButton: "bg-[#2C2C2E] border border-[#FF6347]/20 text-white hover:bg-[#FF6347]/10",
          formButtonPrimary: "bg-gradient-to-r from-[#FF6347] to-[#FF9500] hover:shadow-lg hover:shadow-[#FF6347]/50",
          footerActionLink: "text-[#FF6347] hover:text-[#FF9500]",
          formFieldInput: "bg-[#2C2C2E] border-[#8E8E93]/30 text-white focus:border-[#FF6347]",
          formFieldLabel: "text-[#8E8E93]",
          identityPreviewText: "text-white",
          identityPreviewEditButton: "text-[#FF6347]",
        },
      }}
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
