// client/src/pages/NotFound.tsx

function NotFound() {
  return (
    <section className="flex flex-col bg-greyBackground items-center justify-center text-center mx-auto text-xl md:text-2xl font-bold">
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 mb-10 gap-10 w-full">
        <img src="/404.png" alt="404 Not Found" className=" w-1/3" />

        <div className="flex flex-col md:flex-row rounded-lg p-2 lg:p-4 bg-card shadow-lg">
          {/* Desktop */}
          <p className="hidden md:block">
            OUPS
            <br />
            Cette page est introuvable !
          </p>

          {/* Mobile */}
          <p className="md:hidden">
            OUPS
            <br />
            Cette page est
            <br />
            introuvable !
            <br />
            Erreur 404
          </p>
        </div>
      </div>

      <a
        href="/"
        className="bg-yellowButton py-4 px-10 rounded-full hover:bg-yellow-600 transition duration-300 mx-auto block mb-10"
      >
        Retour
        <br />à l'accueil
      </a>
    </section>
  );
}
export default NotFound;
