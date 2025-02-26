import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Separator } from "../ui/separator";

function Footer() {
  return (
    <footer className="bg-seventh">
      <div className="mx-auto px-4 py-16 sm:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-8">
          <div className="col-span-1 sm:col-span-2">
            <h2 className="text-5xl font-extrabold text-primary">WorkHive</h2>
            <p className="text-fifth text-sm mt-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex gap-4 mt-4">
              <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
                PlayStore
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">
                AppleStore
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-fourth">COMPANY</h3>
            <ul className="mt-4 font-base space-y-2 text-fourth">
              <li>Trang chủ</li>
              <li>Giới thiệu</li>
              <li>Không gian</li>
              <li>Workshop</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-fourth">HELP CENTER</h3>
            <ul className="mt-4 font-base space-y-2 text-fourth">
              <li>Find a Property</li>
              <li>How To Host?</li>
              <li>Why Us?</li>
              <li>FAQs</li>
              <li>Rental Guides</li>
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <h3 className="font-bold text-fourth">CONTACT INFO</h3>
            <ul className="mt-4 font-base space-y-2 text-fourth">
              <li>Phone: 1234567890</li>
              <li>Email: company@email.com</li>
              <li>Location: 100 Smart Street, LA, USA</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <Facebook className="text-fourth hover:text-gray-800" />
              <Twitter className="text-fourth hover:text-gray-800" />
              <Instagram className="text-fourth hover:text-gray-800" />
              <Linkedin className="text-fourth hover:text-gray-800" />
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-sixth" />

      <div className="bg-seventh text-center py-4 flex items-center justify-between px-20">
        <p className="text-fourth font-semibold">
          © 2025 SP25SE173 | All rights reserved
        </p>
        <p className="text-fourth font-semibold">
          Created with love by GSP25SE13
        </p>
      </div>
    </footer>
  );
}

export default Footer;
