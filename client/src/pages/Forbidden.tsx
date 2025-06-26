// client/src/pages/Forbidden.tsx

import { Link } from "react-router";

function Forbidden() {
  return (
    <section className="flex flex-col bg-greyBackground items-center justify-center text-center mx-auto text-xl md:text-2xl font-bold">
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 mb-10 gap-10 w-full">
        <img src="/404.png" alt="403 Forbidden" className="w-1/3" />

        <div className="flex flex-col md:flex-row rounded-lg p-2 lg:p-4 bg-card shadow-lg">
          {/* Desktop */}
          <p className="hidden md:block">
            OUPS
            <br />
            Vous n’avez pas les droits d’accès !
          </p>

          {/* Mobile */}
          <p className="md:hidden">
            OUPS
            <br />
            Vous n’avez pas
            <br />
            les droits d’accès !
            <br />
            Erreur 403
          </p>
        </div>
      </div>

      <Link
        to="/principal"
        className="bg-yellowButton py-4 px-10 rounded-full hover:bg-yellow-600 transition duration-300 mx-auto block mb-10"
      >
        Retour
        <br />à l'accueil
      </Link>
    </section>
  );
}

export default Forbidden;
