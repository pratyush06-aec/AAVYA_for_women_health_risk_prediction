import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ChatbotDrawer } from "@/components/chat/ChatbotDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAVYA | Women's Endocrine & Health Intelligence",
  description:
    "AI-assisted multi-generational PCOS risk estimation, clinical symptom intelligence, and trusted specialist connectivity.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#9D4744",
          colorBackground: "#FCFAF6",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html lang="en">
        <body className="antialiased selection:bg-[oklch(0.894_0.073_32)] selection:text-[oklch(0.389_0.108_22)]">
          {children}
          <ChatbotDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}
