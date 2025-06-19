import { useState } from "react";
// client/src/components/Header.tsx
import { MdAccountCircle } from "react-icons/md";
import { Link } from "react-router";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between mt-4 px-4 relative items-center md:justify-center z-10">
        <Link to="/compte">
          <MdAccountCircle className="text-4xl md:hidden" />
        </Link>
        <Link to="/principal">
          <h1 className="text-center text-4xl font-bold font-kalam">Idealy</h1>
        </Link>
        <div className="flex items-center space-x-2 md:absolute md:right-4">
          <Link
            to="/admin"
            className="bg-blackBackground text-white rounded-2xl py-1 px-2 hidden md:block"
          >
            Administration
          </Link>
          <Link to="/compte">
            <MdAccountCircle className="text-4xl hidden md:block" />
          </Link>
          <Link
            to="/soumettre"
            className="bg-blackBackground text-white rounded-2xl text-sm px-3 md:hidden mr-4"
          >
            Ajout +
          </Link>

          <button
            type="button"
            className="flex flex-col space-y-1 md:hidden"
            onClick={() => setOpen(!open)}
          >
            <span className="block w-6 h-1 bg-blackBackground" />
            <span className="block w-6 h-1 bg-blackBackground" />
            <span className="block w-6 h-1 bg-blackBackground" />
          </button>
        </div>

        <div
          className={`md:hidden space-y-3 text-center absolute top-full right-0 py-3 px-2 bg-greyBackground shadow-2xl rounded-lg transition-all duration-300 ${
            open
              ? "transform translate-x-0 opacity-100"
              : "transform translate-x-full opacity-0"
          }`}
        >
          <Link
            to="/admin"
            className="block py-1 px-2 bg-blackBackground rounded-2xl text-sm text-white"
            onClick={() => setOpen(false)}
          >
            Administration
          </Link>
          <Link
            to="/parcourir"
            className="block py-1 px-2 bg-blackBackground rounded-2xl text-sm text-white "
            onClick={() => setOpen(false)}
          >
            Parcourir les idées
          </Link>
          <Link
            to="/informations"
            className="block py-1 px-2 bg-blackBackground rounded-2xl text-sm text-white "
            onClick={() => setOpen(false)}
          >
            Informations
          </Link>
          <Link
            to="/contact"
            className="block py-1 px-2 bg-blackBackground rounded-2xl text-sm text-white "
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/a-propos"
            className="block py-1 px-2 bg-blackBackground rounded-2xl text-sm text-white "
            onClick={() => setOpen(false)}
          >
            A propos
          </Link>
        </div>
      </div>

      <nav className="hidden md:flex justify-center items-center space-x-6 mt-4">
        <Link
          to="/soumettre"
          className="px-4 py-2 bg-blackBackground text-white rounded-full text-sm"
        >
          Soumettre une idée
        </Link>
        <Link
          to="/parcourir"
          className="px-4 py-2 bg-blackBackground text-white rounded-full text-sm"
        >
          Parcourir les idées
        </Link>
        <Link
          to="/informations"
          className="px-4 py-2 bg-blackBackground text-white rounded-full text-sm"
        >
          Informations
        </Link>
        <Link
          to="/contact"
          className="px-4 py-2 bg-blackBackground text-white rounded-full text-sm"
        >
          Contact
        </Link>
        <Link
          to="/a-propos"
          className="px-4 py-2 bg-blackBackground text-white rounded-full text-sm"
        >
          A Propos
        </Link>
      </nav>
    </>
  );
}

export default Header;
