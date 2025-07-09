// client/src/components/Footer.tsx

import { Link } from "react-router";

function Footer() {
  return (
    <footer className="text-white bg-[#1d1d1f] font-[atkinson] py-4 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between flex-wrap gap-4">
        <div className="flex flex-col text-sm space-y-1 text-center sm:text-left">
          <Link to="/contact" className="hover:underline cursor-pointer">
            Contact
          </Link>
          <Link to="/a-propos" className="hover:underline cursor-pointer">
            A Propos
          </Link>
          <Link to="/legal" className="hover:underline cursor-pointer">
            Mentions Légales
          </Link>
        </div>

        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com"
            className="cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/Facebook.svg" alt="Facebook" className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com"
            className="cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/Instagram.svg" alt="Instagram" className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com"
            className="cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/Linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
          </a>
        </div>

        <div className="text-center text-sm w-full sm:w-auto">
          <p>Copyright © 2025</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
