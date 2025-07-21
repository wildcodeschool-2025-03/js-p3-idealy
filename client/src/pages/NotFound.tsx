// client/src/pages/NotFound.tsx

import { Link } from "react-router";

function NotFound() {
  return (
    <section className="flex flex-col bg-greyBackground items-center justify-center text-center mx-auto text-xl md:text-2xl">
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 mb-10 gap-10 w-full">
        <img src="/404.png" alt="404 Not Found" className="w-1/3" />

        <div className="flex flex-col md:flex-row rounded-3xl font-bold p-2 lg:p-4 bg-card shadow-md">
          <p>
            OUPS
            <br />
            Cette page est introuvable !
            <br />
            Erreur 404
          </p>
        </div>
      </div>

      <Link
        to="/principal"
        aria-label="Retour à l'accueil"
        className="bg-yellowButton py-2 px-6 rounded-full hover:bg-yellow-3S00 transition duration-300 mx-auto block mb-10"
      >
        Retour à l'accueil
      </Link>
    </section>
  );
}

export default NotFound;
