// client/src/pages/Information.tsx

import { useEffect, useState } from "react";
import IdeaCard from "../components/IdeaCard";

import Statistiques from "../components/Statistiques";
<Statistiques />;

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

function Information() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // Récupération des idées enrichies (catégories, créateur, votes)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas`)
      .then((res) => res.json())
      .then(async (data: Idea[]) => {
        const enrichedIdeas = await Promise.all(
          data.map(async (idea) => {
            const [catRes, creatorRes, voteRes] = await Promise.all([
              fetch(
                `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/categories`,
              ),
              fetch(
                `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/creator`,
              ),
              fetch(
                `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/votes`,
              ),
            ]);

            const categories = await catRes.json();
            const creator = creatorRes.ok
              ? await creatorRes.json()
              : { firstname: "Inconnu", lastname: "" };
            const votes = await voteRes.json();

            return {
              ...idea,
              categories: categories.map(
                (c: { category: string }) => c.category,
              ),
              creator,
              agree_count: votes.agree_count,
              disagree_count: votes.disagree_count,
            };
          }),
        );
        setIdeas(enrichedIdeas);
      })
      .catch((err) => console.error("Erreur de récupération des idées :", err));
  }, []);

  // Idées validées et refusées, triées par date décroissante
  const recentValidIdeas = ideas
    .filter((idea) => idea.statut_id === 2)
    .sort(
      (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime(),
    )
    .slice(0, 3);

  const recentRefusedIdeas = ideas
    .filter((idea) => idea.statut_id === 3)
    .sort(
      (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime(),
    )
    .slice(0, 3);

  return (
    <section className="bg-greyBackground flex flex-col items-center justify-center min-h-lvh gap-8 px-4 py-8">
      <article className="w-full max-w-6xl px-2 md:px-8">
        <button
          type="button"
          aria-label="Statistiques"
          className="block mx-auto bg-yellowButton rounded-full p-2 font-semibold text-lg cursor-default"
        >
          Statistiques
        </button>
        {/* appel du composant Statitiques */}
        <Statistiques />
      </article>

      <article className="w-full max-w-6xl px-2 md:px-8">
        <button
          type="button"
          aria-label="Idées récemment validées"
          className="block mx-auto bg-greenButton rounded-full p-2 font-semibold text-lg cursor-default"
        >
          Idées récemment validées
        </button>
        <div className="flex flex-col md:flex-row md:justify-center items-stretch mt-4 gap-4">
          {recentValidIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              showVotes={false}
              showStatusOverlay={false}
            />
          ))}
        </div>
      </article>

      <article className="w-full max-w-6xl px-2 md:px-8">
        <button
          type="button"
          aria-label="Idées récemment refusées"
          className="block mx-auto bg-redButton rounded-full p-2 font-semibold text-lg cursor-default"
        >
          Idées récemment refusées
        </button>
        <div className="flex flex-col md:flex-row md:justify-center items-stretch mt-4 gap-4">
          {recentRefusedIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              showVotes={false}
              showStatusOverlay={false}
            />
          ))}
        </div>
      </article>
    </section>
  );
}

export default Information;
