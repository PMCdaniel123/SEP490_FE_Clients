import "./globals.css";
import { Montserrat } from "next/font/google";
import { Providers } from "../stores/Providers";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WorkHive",
  description:
    "WorkHive was developed as a groundbreaking solution for managing and booking coworking spaces. This platform is designed to provide a professional, centralized, and convenient system, optimizing the management of bookings, organizing information, and supporting events for coworking spaces. WorkHive not only benefits users of these services but also effectively supports coworking space owners in enhancing service quality and expanding their market presence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>
          <div>
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
