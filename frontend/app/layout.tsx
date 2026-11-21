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
          colorPrimary: "#BD737D",
          colorBackground: "#F8D8CE",
          borderRadius: "20px",
        },
      }}
    >
      <html lang="en">
        <body className="antialiased selection:bg-[#E99196] selection:text-[#352326]">
          {children}
          <ChatbotDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}
