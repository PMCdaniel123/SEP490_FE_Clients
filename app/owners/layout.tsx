import "../globals.css";
import { Montserrat } from "next/font/google";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { Providers } from "@/stores/Providers";
import Sidebar from "@/components/layout/sidebar";
import TopNav from "@/components/layout/top-nav";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WorkHive Owners",
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
          <div className="flex h-screen bg-third p-4 gap-4">
            <Sidebar />
            <main className="flex-1">
              <TopNav />
              {children}
            </main>
          </div>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
