import React, { useEffect, useState } from "react";
import IdeaCardPlaceholder from "./IdeaCardPlaceholder";

function ParcourirPlaceHolder() {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const numberOfDisplayMobile = 3;
  const numberOfDisplayDesktop = 9;

  // Détecte si on est sur un format d'écran "desktop" ou "mobile" pour la pagination des idées
  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(
        window.innerWidth < 768
          ? numberOfDisplayMobile
          : numberOfDisplayDesktop,
      );
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  //-------------------------------DISPLAY-----------------------------------------------------------------------------------------

  return (
    <section className="bg-greyBackground py-6 md:pt-10">
      <section className="flex items-center justify-center gap-1 md:gap-4 pb-6 md:pb-8 max-w-[370px] md:max-w-8/10 lg:max-w-5/10 mx-auto">
        {/* Barre de recherche */}
        <section className="relative w-full">
          <input
            type="text"
            placeholder="Rechercher un titre, un auteur..."
            maxLength={30}
            className="w-full px-4 py-2 rounded-3xl shadow-md bg-white text-center focus:outline-0"
          />
        </section>
      </section>

      {/* Affichage des idées filtrées */}
      <section className="gap-10 flex flex-col items-center md:flex-row flex-wrap justify-center">
        {Array.from({ length: itemsPerPage }).map(() => (
          <IdeaCardPlaceholder key={crypto.randomUUID()} />
        ))}
      </section>
    </section>
  );
}

export default React.memo(ParcourirPlaceHolder);
