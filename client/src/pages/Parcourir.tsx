// client/src/pages/Parcourir

import { useEffect, useState } from "react";
import IdeaCard from "../components/IdeaCard";
import IdeaFilter from "../components/IdeaFilter";

interface Idea {
  id: number;
  title: string;
  description: string;
  categories: string[];
  statut_id: number;
  deadline: string;
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

  // Récupère la liste des idées depuis l'API au chargement du composant
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas`)
      .then((response) => response.json())
      .then(async (data: Idea[]) => {
        // Récupère les catégories et créateur pour chaque idée
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
            const creator = await creatorRes.json();

            return {
              ...idea,
              categories: catData.map((c) => c.category),
              creator,
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

  // Filtre les idées en fonction des filtres sélectionnée (appelé à chaque re-render du composant c.a.d à chaque changement d'un state quelconque)
  const filteredIdeas = ideas.filter((idea) => {
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

  return (
    <section className="bg-greyBackground min-h-lvh">
      {/* composant de filtre pour les idées */}
      <IdeaFilter
        categories={categories}
        selectedCategories={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatut={selectedStatut}
        onStatutChange={setSelectedStatut}
        selectedDeadline={selectedDeadline}
        onDeadlineChange={setSelectedDeadline}
      />

      {/* Affichage des idées filtrées */}
      <section className="gap-10 flex flex-col items-center md:flex-row flex-wrap justify-center">
        {filteredIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </section>
    </section>
  );
}

export default Parcourir;
