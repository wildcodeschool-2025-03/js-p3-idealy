import { useState } from "react";
// client/src/components/Header.tsx
import { MdAccountCircle } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../context/AuthContext";

function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useLogin();

  // Navigation du bouton "mes idées" => Nécessaire car on veut passer à la page parcourir les infos de l'user actuel
  const handleMyIdeas = () => {
    setOpen(false);
    if (user) {
      const firstname = user.firstname || "";
      const lastname = user.lastname || "";
      // Ajoute un champ unique pour forcer le changement de state (navigation depuis la même page)
      navigate("/parcourir", { state: { firstname, lastname, t: Date.now() } });
    }
  };

  // Probablement robustifier ça (en faisant une requete SQL pour aller chercher l'info par exemple)
  const handleAdmin = () => {
    setOpen(false);
    if (user?.isAdmin === true) {
      navigate("/admin");
    }
  };

  return (
    <>
      <div className="flex bg-greyBackground justify-between pt-2 px-4 relative items-center md:justify-center z-10">
        <Link to="/compte">
          <MdAccountCircle className="text-4xl md:hidden" />
        </Link>

        <Link to="/principal">
          <h1 className="text-center text-4xl font-bold font-kalam">Idealy</h1>
        </Link>
        <div className="flex items-center space-x-2 md:absolute md:right-4">
          <Link to="/admin">
            <button
              type="button"
              onClick={handleAdmin}
              className="bg-blackBackground text-white rounded-2xl py-1 px-2 hidden md:block cursor-pointer"
            >
              Administration
            </button>
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
          className={`md:hidden space-y-3 text-center absolute top-full right-0 py-3 px-2 bg-greyBackground shadow-md rounded-b-3xl transition-all duration-300 ${
            open
              ? "transform translate-x-0 opacity-100"
              : "transform translate-x-full opacity-0"
          }`}
        >
          <Link
            to="/admin"
            className="block py-1 px-3 w-full bg-blackBackground rounded-2xl text-sm text-white "
            onClick={() => setOpen(false)}
          >
            Administration
          </Link>
          <Link
            to="/parcourir"
            className="block py-1 px-3 w-full bg-blackBackground rounded-2xl text-sm text-white "
            onClick={() => setOpen(false)}
          >
            Parcourir tout
          </Link>
          <button
            type="button"
            onClick={handleMyIdeas}
            className="block w-full py-1 bg-blackBackground text-white rounded-2xl text-sm cursor-pointer"
          >
            Mes idées
          </button>
          <Link
            to="/informations"
            className="block py-1 w-full bg-blackBackground rounded-2xl text-sm text-white "
            onClick={() => setOpen(false)}
          >
            Informations
          </Link>
          <Link
            to="/contact"
            className="block py-1 w-full bg-blackBackground rounded-2xl text-sm text-white "
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/a-propos"
            className="block py-1 w-full bg-blackBackground rounded-2xl text-sm text-white "
            onClick={() => setOpen(false)}
          >
            A propos
          </Link>
        </div>
      </div>

      <nav className="hidden bg-greyBackground md:flex justify-center items-center space-x-6 pt-4">
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
        <button
          type="button"
          onClick={handleMyIdeas}
          className="px-8 py-2 bg-blackBackground text-white rounded-full text-sm cursor-pointer"
        >
          Mes idées
        </button>
        <Link
          to="/informations"
          className="px-6 py-2 bg-blackBackground text-white rounded-full text-sm"
        >
          Informations
        </Link>
      </nav>
    </>
  );
}

export default Header;
