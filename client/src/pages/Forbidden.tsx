// client/src/pages/Forbidden.tsx

import { Link } from "react-router";

function Forbidden() {
  return (
    <section className="flex flex-col bg-greyBackground items-center justify-center text-center mx-auto text-xl md:text-2xl">
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 mb-10 gap-10 w-full">
        <img src="/404.png" alt="403 Forbidden" className="w-1/3" />

        <div className="flex flex-col md:flex-row font-bold rounded-3xl p-2 lg:p-4 bg-card shadow-md">
          <p>
            OUPS
            <br />
            Vous n’avez pas les droits d’accès !
            <br />
            Erreur 403
          </p>
        </div>
      </div>

      <Link
        to="/principal"
        aria-label="Retour à l'accueil"
        className="bg-yellowButton py-2 px-6 rounded-full hover:bg-yellow-300 transition duration-300 mx-auto block mb-10"
      >
        Retour à l'accueil
      </Link>
    </section>
  );
}

export default Forbidden;
