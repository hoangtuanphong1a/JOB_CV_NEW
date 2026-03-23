"use client";

import {
  Crown,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const handleNavigation = (path: string) => {
    console.log("Navigate to:", path);
    // You can integrate with Next.js router here
  };

  const footerLinks = {
    "For Job Seekers": [
      { name: "Browse Jobs", action: () => handleNavigation("/jobs") },
      { name: "Career Advice", action: () => handleNavigation("/blog") },
      { name: "CV Builder", action: () => handleNavigation("/cv") },
      { name: "Salary Guide", action: () => handleNavigation("/blog") },
    ],
    "For Employers": [
      { name: "Post a Job", action: () => handleNavigation("/post-job") },
      { name: "Browse CVs", action: () => handleNavigation("/companies") },
      { name: "Pricing Plans", action: () => handleNavigation("/contact") },
    ],
    Company: [
      { name: "About Us", action: () => handleNavigation("/about") },
      { name: "Contact", action: () => handleNavigation("/contact") },
      { name: "Careers", action: () => handleNavigation("/jobs") },
    ],
    Support: [
      { name: "Help Center", action: () => handleNavigation("/contact") },
      { name: "Privacy Policy", action: () => handleNavigation("/privacy") },
      { name: "Terms of Service", action: () => handleNavigation("/terms") },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand and Newsletter */}
            <div className="lg:col-span-2">
              <button
                onClick={() => handleNavigation("/")}
                className="flex items-center mb-4 hover:opacity-80 transition-opacity"
              >
                <Crown className="h-8 w-8 text-orange-500" />
                <span className="ml-2 text-xl font-semibold">CVKing</span>
              </button>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Connecting talent with opportunity. Find your dream job or hire
                the perfect candidate with Vietnam's leading job portal.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-400">
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="flex items-center hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  contact@jobportal.vn
                </button>
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="flex items-center hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  +84 (0) 123 456 789
                </button>
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="flex items-center hover:text-white transition-colors"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Ho Chi Minh City, Vietnam
                </button>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-medium mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={link.action}
                        className="text-gray-400 hover:text-white transition-colors text-sm text-left"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 CVKing. All rights reserved.
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
