// client/src/pages/Parcourir

import { useEffect, useState } from "react";
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
  const [ideas, setIdeas] = useState([] as Idea[]);
  const [categories, setCategories] = useState([] as string[]);

  const [selectedCategory, setSelectedCategory] = useState([] as string[]);
  const [selectedStatut, setSelectedStatut] = useState([] as number[]); // On va filtrer sur le number status_id plutôt que sur le string du statut en jointure
  const [selectedDeadline, setSelectedDeadline] = useState<string[]>([]);

  const [selectedSorting, setSelectedSorting] = useState(""); // State de l'ordonnement

  const [search, setSearch] = useState(""); // State de la barre de recherche

  // Etape 0 : Récupérer la liste complète des idées depuis l'API au chargement du composant
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas`)
      .then((response) => response.json())
      .then(async (data: Idea[]) => {
        // Récupère les catégories, créateur, votes pour chaque idée
        // A cause des filtres de cette page : ces missions de fetch sont déja faites par le composant lui-même vu qu'il doit être réutilisable partout
        const ideasWithCategories = await Promise.all(
          data.map(async (idea) => {
            // Fetch des catégories de l'idée
            const catRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/categories`,
            );
            const catData: { category: string }[] = await catRes.json();

            // Fetch du créateur de l'idée
            const creatorRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/creator`,
            );
            let creator = { firstname: "Inconnu", lastname: "" };
            if (creatorRes.ok) {
              creator = await creatorRes.json();
            }

            // Fetch du nombre de likes et dislikes de l'idée
            const voteRes = await fetch(
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

  // Récupère la liste des catégories existantes depuis l'API (pour transmettre l'info au composant de filtre enfant)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.map((category: Category) => category.category));
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Etape 1 : Afficher les idées en fonction de la barre de recherche
  const searchedIdeas = ideas.filter((idea) =>
    [
      idea.creator.firstname,
      idea.creator.lastname,
      idea.title,
      idea.description,
    ].some((field) => field.toLowerCase().includes(search.toLowerCase())),
  );

  // Etape 2 : Filtrer les idées en fonction des filtres sélectionnée (appelé à chaque re-render du composant c.a.d à chaque changement d'un state quelconque)
  const filteredIdeas = searchedIdeas.filter((idea) => {
    // Filtre catégorie
    const categoryOk =
      selectedCategory.length === 0 ||
      idea.categories?.some((cat) => selectedCategory.includes(cat));

    // Filtre statut
    const statutOk =
      selectedStatut.length === 0 || selectedStatut.includes(idea.statut_id);

    // Filtre Deadline
    let deadlineOk = true;
    const now = new Date();
    if (selectedDeadline.length > 0) {
      const deadline = new Date(idea.deadline);
      deadlineOk = selectedDeadline.some((period) => {
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
    return categoryOk && statutOk && deadlineOk;
  });

  // Etape 3 : ordonner les idées filtrées en fonction du tri sélectionné
  const sortedIdeas = [...filteredIdeas];
  if (selectedSorting === "alpha") {
    sortedIdeas.sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedSorting === "chrono") {
    sortedIdeas.sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    );
  } else if (selectedSorting === "most") {
    sortedIdeas.sort((a, b) => b.agree_count - a.agree_count);
  } else if (selectedSorting === "least") {
    sortedIdeas.sort((a, b) => b.disagree_count - a.disagree_count);
  }

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
          selectedDeadline={selectedDeadline}
          onDeadlineChange={setSelectedDeadline}
        />

        <IdeaSorter
          selectedSorting={selectedSorting}
          onSortingChange={setSelectedSorting}
        />
      </section>

      {/* Affichage des idées filtrées */}
      <section className="gap-10 flex flex-col items-center md:flex-row flex-wrap justify-center">
        {sortedIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </section>
    </section>
  );
}

export default Parcourir;
