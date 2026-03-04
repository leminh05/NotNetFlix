import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 1. Khai báo nạp file Bebas Neue
const bebasNeue = localFont({
  src: "./fonts/BebasNeue-Regular.ttf",
  variable: "--font-bebas", // Tạo một biến CSS tên là --font-bebas
  display: "swap",
});

export const metadata: Metadata = {
  title: "NotNetflix",
  description: "A Netflix Clone using Spring Boot & Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. Nhúng biến font vào thẻ body */}
      <body className={`${bebasNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}