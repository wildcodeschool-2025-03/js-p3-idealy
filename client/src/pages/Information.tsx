// client/src/pages/Information.tsx

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import IdeaCard from "../components/IdeaCard";
import "react-toastify/dist/ReactToastify.css";
import Statistiques from "../components/Statistiques";
<Statistiques />;
import Carousel from "../components/Carousel";
import { authFetch } from "../utils/authFetch";

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

function Information() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // Récupération des idées enrichies (catégories, créateur, votes)
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas`)
      .then((res) => res.json())
      .then(async (data: Idea[]) => {
        const enrichedIdeas = await Promise.all(
          data.map(async (idea) => {
            const [catRes, creatorRes, voteRes] = await Promise.all([
              authFetch(
                `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/categories`,
              ),
              authFetch(
                `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/creator`,
              ),
              authFetch(
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
      .catch((err) => toast.error("Erreur de récupération des idées :", err));
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

  const validSlides = recentValidIdeas.map((idea) => ({
    id: idea.id.toString(),
    content: (
      <IdeaCard idea={idea} showVotes={false} showStatusOverlay={false} />
    ),
  }));

  const refusedSlides = recentRefusedIdeas.map((idea) => ({
    id: idea.id.toString(),
    content: (
      <IdeaCard idea={idea} showVotes={false} showStatusOverlay={false} />
    ),
  }));

  return (
    <section className="bg-greyBackground flex flex-col items-center justify-center min-h-lvh gap-10 px-2 py-6">
      <article className="w-full max-w-6xl px-2 md:px-8 mt-10">
        <button
          type="button"
          aria-label="Statistiques"
          className="block mx-auto bg-yellowButton rounded-3xl px-6 py-2 text- xl md:text-2xl cursor-default"
        >
          Statistiques
        </button>
        {/* appel du composant Statistiques */}
        <Statistiques />
      </article>

      <article className="w-full max-w-6xl px-2 md:px-8">
        <button
          type="button"
          aria-label="Idées récemment validées"
          className="block mx-auto bg-greenButton rounded-3xl px-6 py-2 text- xl md:text-2xl  cursor-default mt-10"
        >
          Idées récemment validées
        </button>
        {/* Mobile : Carrousel */}
        <div className="block md:hidden w-full mt-10">
          <Carousel slides={validSlides} />
        </div>
        {/* Desktop : Cards en ligne */}
        <div className="hidden md:flex md:flex-row md:justify-center items-stretch mt-10 gap-4">
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

      <article className="w-full max-w-6xl px-2 md:px-8 mb-10">
        <button
          type="button"
          aria-label="Idées récemment refusées"
          className="block mx-auto bg-redButton rounded-3xl px-6 py-2 text- xl md:text-2xl  cursor-default mt-10"
        >
          Idées récemment refusées
        </button>
        {/* Mobile : Carrousel */}
        <div className="block md:hidden w-full mt-10">
          <Carousel slides={refusedSlides} />
        </div>
        {/* Desktop : Cards en ligne */}
        <div className="hidden md:flex md:flex-row md:justify-center items-stretch mt-10 gap-4">
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
