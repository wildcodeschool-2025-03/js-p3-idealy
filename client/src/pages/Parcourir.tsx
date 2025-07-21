// client/src/pages/Parcourir

import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { authFetch } from "../utils/authFetch";

import IdeaCard from "../components/IdeaCard";
import IdeaFilter from "../components/IdeaFilter";
import IdeaSorter from "../components/IdeaSorter";

interface Idea {
  id: number;
  title: string;
  description: string;
  categories: string[];
  statut_id: number;
  deadline: string;
  timestamp: string;
  agree_count: number;
  disagree_count: number;
  creator: {
    firstname: string;
    lastname: string;
  };
}

interface Category {
  category: string;
}

function Parcourir() {
  //-----------------------------------------VARIABLES----------------------------------------------------------------------------------------

  const location = useLocation(); // Pour la transmission d'info (par le header ici)
  const { firstname, lastname, t } = location.state || {};

  // Affichage des idées
  const [ideas, setIdeas] = useState([] as Idea[]);
  const [categories, setCategories] = useState([] as string[]);

  // States des tris, filtres et recherches
  const [selectedCategory, setSelectedCategory] = useState([] as string[]);
  const [selectedStatut, setSelectedStatut] = useState([] as number[]); // On va filtrer sur le number status_id plutôt que sur le string du statut en jointure
  const [selectedTimestamp, setSelectedTimestamp] = useState<string[]>([]);
  const [selectedSorting, setSelectedSorting] = useState(""); // State de l'ordonnement
  const [search, setSearch] = useState("");

  // Système de pagination des idées
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const numberOfDisplayMobile = 6;
  const numberOfDisplayDesktop = 12;

  //------------------------------------------FONCTIONS---------------------------------------------------------------------------------------------------------------------------------

  // biome-ignore lint/correctness/useExhaustiveDependencies: contrairement à ce que dit biome, t est ABSOLUMENT NECESSAIRE ici pour forcer le reset de la recherche lors de la navigation
  useEffect(() => {
    if (firstname || lastname) {
      setSearch([firstname, lastname].filter(Boolean).join(" "));
      // Reset tous les filtres et tris quand on clique sur "mes idées"
      setSelectedCategory([]);
      setSelectedStatut([]);
      setSelectedTimestamp([]);
      setSelectedSorting("");
    } else {
      setSearch("");
    }
  }, [firstname, lastname, t]);

  // Récupère la liste des catégories existantes depuis l'API (pour transmettre l'info au composant de filtre enfant)
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.map((category: Category) => category.category));
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

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

  // Renvoie en haut de la fenêtre lors du changement de page
  // biome-ignore lint/correctness/useExhaustiveDependencies: désolé biome, mais je t'assure qu'on a besoin de cette dépendance
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Remet la page à 1 quand les critères de recherche changent
  // biome-ignore lint/correctness/useExhaustiveDependencies: ces dépendances sont nécessaires pour remettre la page à 1 lors des changements de filtres
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedCategory,
    selectedStatut,
    selectedTimestamp,
    selectedSorting,
  ]);

  // Etape 0 : Récupérer la liste complète des idées depuis l'API au chargement du composant
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas`)
      .then((response) => response.json())
      .then(async (data: Idea[]) => {
        // Récupère les catégories, créateur, votes pour chaque idée
        // A cause des filtres de cette page : ces missions de fetch sont déja faites par le composant lui-même vu qu'il doit être réutilisable partout
        const ideasWithCategories = await Promise.all(
          data.map(async (idea) => {
            // Fetch des catégories de l'idée
            const catRes = await authFetch(
              `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/categories`,
            );
            const catData: { category: string }[] = await catRes.json();

            // Fetch du créateur de l'idée
            const creatorRes = await authFetch(
              `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/creator`,
            );
            let creator = { firstname: "Inconnu", lastname: "" };
            if (creatorRes.ok) {
              creator = await creatorRes.json();
            }

            // Fetch du nombre de likes et dislikes de l'idée
            const voteRes = await authFetch(
              `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/votes`,
            );
            const voteData = await voteRes.json();
            return {
              ...idea,
              categories: catData.map((c) => c.category),
              creator,
              agree_count: voteData.agree_count,
              disagree_count: voteData.disagree_count,
            };
          }),
        );
        setIdeas(ideasWithCategories);
      })
      .catch((error) => {
        console.error("Error fetching ideas or categories:", error);
      });
  }, []);

  // pour lire les redirections de la page principale

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Tri idées récentes
    const sort = params.get("sort");
    if (sort) setSelectedSorting(sort);

    // Statut validé de l idée
    const statut = params.get("statut");
    if (statut) setSelectedStatut([Number(statut)]);

    // User : les idées de l utilisateur
    const searchParam = params.get("search");
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [location.search]);

  // Etape 1 : Afficher les idées en fonction de la barre de recherche
  const searchedIdeas = ideas.filter((idea) => {
    const searchableText = [
      idea.creator.firstname,
      idea.creator.lastname,
      idea.title,
      idea.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  // Etape 2 : Filtrer les idées en fonction des filtres sélectionnée (appelé à chaque re-render du composant c.a.d à chaque changement d'un state quelconque)
  const filteredIdeas = searchedIdeas.filter((idea) => {
    // Filtre catégorie
    const categoryOk =
      selectedCategory.length === 0 ||
      idea.categories?.some((cat) => selectedCategory.includes(cat));

    // Filtre statut
    const statutOk =
      selectedStatut.length === 0 || selectedStatut.includes(idea.statut_id);

    // Filtre timestamp
    let timestampOk = true;
    const now = new Date();
    if (selectedTimestamp.length > 0) {
      const deadline = new Date(idea.timestamp);
      timestampOk = selectedTimestamp.some((period) => {
        if (period === "week") {
          const lastWeek = new Date(now);
          lastWeek.setDate(now.getDate() - 7);
          return deadline >= lastWeek && deadline < now;
        }
        if (period === "month") {
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          return deadline >= lastMonth && deadline < now;
        }
        if (period === "year") {
          const lastYear = new Date(now);
          lastYear.setFullYear(now.getFullYear() - 1);
          return deadline >= lastYear && deadline < now;
        }
        return false;
      });
    }
    return categoryOk && statutOk && timestampOk;
  });

  // Fonction pour vérifier si le vote est encore autorisé (identique à IdeaCard)
  const isVoteAllowed = (idea: Idea) => {
    if (!idea.deadline || !idea.timestamp) return true;
    const created = new Date(idea.timestamp).getTime();
    const deadline = new Date(idea.deadline).getTime();
    const now = Date.now();
    const allowedDuration = (deadline - created) * (2 / 3);
    return now - created <= allowedDuration;
  };

  // Etape 3 : ordonner les idées filtrées en fonction du tri sélectionné
  const sortedIdeas = [...filteredIdeas];
  if (selectedSorting === "alpha") {
    sortedIdeas.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedSorting === "chrono") {
    sortedIdeas.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  } else if (selectedSorting === "most") {
    // Filtrer d'abord les idées dont le délai de vote n'est pas dépassé
    const votableIdeas = sortedIdeas.filter(isVoteAllowed);
    const nonVotableIdeas = sortedIdeas.filter((idea) => !isVoteAllowed(idea));

    // Trier les idées votables par nombre de likes décroissant
    votableIdeas.sort((a, b) => b.agree_count - a.agree_count);

    // Concaténer : idées votables triées + idées non-votables à la fin
    sortedIdeas.splice(
      0,
      sortedIdeas.length,
      ...votableIdeas,
      ...nonVotableIdeas,
    );
  } else if (selectedSorting === "least") {
    // Filtrer d'abord les idées dont le délai de vote n'est pas dépassé
    const votableIdeas = sortedIdeas.filter(isVoteAllowed);
    const nonVotableIdeas = sortedIdeas.filter((idea) => !isVoteAllowed(idea));

    // Trier les idées votables par nombre de dislikes décroissant
    votableIdeas.sort((a, b) => b.disagree_count - a.disagree_count);

    // Concaténer : idées votables triées + idées non-votables à la fin
    sortedIdeas.splice(
      0,
      sortedIdeas.length,
      ...votableIdeas,
      ...nonVotableIdeas,
    );
  }

  // Découpe des idées à afficher
  const totalPages = Math.ceil(sortedIdeas.length / itemsPerPage);
  const paginatedIdeas = sortedIdeas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  //-------------------------------DISPLAY-----------------------------------------------------------------------------------------

  return (
    <section className="bg-greyBackground min-h-lvh py-6 md:pt-10">
      <section className="flex items-center justify-center gap-1 md:gap-4 pb-6 md:pb-8 max-w-[370px] md:max-w-8/10 lg:max-w-5/10 mx-auto">
        {/* Barre de recherche */}
        <section className="relative w-full">
          <input
            type="text"
            placeholder="Rechercher un titre, un auteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxLength={30}
            className="w-full px-4 py-2 rounded-3xl shadow-md bg-white text-center focus:outline-0"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blackBackground text-lg"
              aria-label="Effacer la recherche"
            >
              <i className="bi bi-x-circle" />
            </button>
          )}
        </section>

        {/* Filtre et Ordre */}

        <IdeaFilter
          categories={categories}
          selectedCategories={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatut={selectedStatut}
          onStatutChange={setSelectedStatut}
          selectedTimestamp={selectedTimestamp}
          onTimestampChange={setSelectedTimestamp}
        />

        <IdeaSorter
          selectedSorting={selectedSorting}
          onSortingChange={setSelectedSorting}
        />
      </section>

      {/* Boutons de pagination */}
      <section className="flex justify-center items-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blackBackground text-white w-14 py-1 rounded-full disabled:opacity-50"
        >
          <i className="bi bi-chevron-left" />
        </button>
        <span className="w-10 text-center">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-blackBackground text-white w-14 py-1 rounded-full disabled:opacity-50"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </section>

      {/* Affichage des idées filtrées */}
      <section className="gap-10 flex flex-col items-center md:flex-row flex-wrap justify-center">
        {paginatedIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </section>

      {/* Boutons de pagination */}
      <section className="flex justify-center items-center gap-4 mt-8">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blackBackground text-white w-26 py-1 rounded-full disabled:opacity-50 cursor-pointer"
        >
          Précédent
        </button>
        <span className="w-24 text-center">
          Page {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-blackBackground text-white w-26 py-1 rounded-full disabled:opacity-50 cursor-pointer"
        >
          Suivant
        </button>
      </section>
    </section>
  );
}

export default Parcourir;
