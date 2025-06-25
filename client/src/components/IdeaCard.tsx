// client/src/components/IdeaCard.tsx

import { useEffect, useState } from "react";
import { useLogin } from "../context/AuthContext";

interface IdeaCardProps {
  idea: Idea;
  showVotes?: boolean;
  showStatusOverlay?: boolean;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  statut_id: number;
}

interface User {
  firstname: string;
  lastname: string;
  picture: string;
}

interface VoteInformation {
  agree_count: number;
  disagree_count: number;
}

interface Category {
  category: string;
}

// Couleurs des catégories pour les blocs
const categoryColors: Record<string, string> = {
  Amélioration: "bg-redButton",
  Innovation: "bg-yellowButton",
  "Conditions de travail": "bg-greenButton",
  "Relation client": "bg-[#007aff]",
  "Optimisation des coûts": "bg-[#af52de]",
  "Développement durable": "bg-[#5ac8fa]",
  "Vie d'équipe": "bg-[#ff9500]",
};

function IdeaCard({
  idea,
  showVotes = true,
  showStatusOverlay = true,
}: IdeaCardProps) {
  const [creator, setCreator] = useState({} as User);
  const [voteInfo, setVoteInfo] = useState({} as VoteInformation);
  const [categories, setCategories] = useState([] as Category[]);
  const [userVote, setUserVote] = useState<{
    agree: boolean;
    disagree: boolean;
  } | null>(null);
  const { user } = useLogin();

  const handleLike = async () => {
    try {
      const voteData = {
        idea_id: idea.id,
        user_id: user?.id,
        agree: true,
        disagree: false,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/votes/upsert`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(voteData),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors du vote.");
      }

      // Refetch les votes pour avoir le bon total
      const voteRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/votes`,
      );
      const voteDataUpdated = await voteRes.json();
      setVoteInfo(voteDataUpdated);
      setUserVote({ agree: true, disagree: false });
    } catch (error) {
      console.error("Erreur de création :", error);
      alert("Une erreur est survenue lors du vote.");
    }
  };

  const handleDislike = async () => {
    try {
      const voteData = {
        idea_id: idea.id,
        user_id: user?.id,
        agree: false,
        disagree: true,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/votes/upsert`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(voteData),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors du vote.");
      }

      // Refetch les votes pour avoir le bon total
      const voteRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/votes`,
      );
      const voteDataUpdated = await voteRes.json();
      setVoteInfo(voteDataUpdated);
      setUserVote({ agree: false, disagree: true });
    } catch (error) {
      console.error("Erreur de création :", error);
      alert("Une erreur est survenue lors du vote.");
    }
  };

  // Info créateur de l'idée
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/creator`)
      .then((response) => response.json())
      .then((data: User) => {
        setCreator(data);
      });
  }, [idea]);

  // Info nb de votes
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/votes`)
      .then((response) => response.json())
      .then((data: VoteInformation) => {
        setVoteInfo(data);
      });
  }, [idea]);

  // Récupère juste les catégories existantes
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/categories`)
      .then((response) => response.json())
      .then((data: Category[]) => {
        setCategories(data);
        console.log("Fetched categories:", data);
      });
  }, [idea]);

  // Récupère l'info si l'utilisateur avait voté pour ou contre
  useEffect(() => {
    if (user?.id) {
      fetch(
        `${import.meta.env.VITE_API_URL}/api/votes?idea_id=${idea.id}&user_id=${user.id}`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setUserVote({
              agree: !!data[0].agree,
              disagree: !!data[0].disagree,
            });
          } else {
            setUserVote(null);
          }
        });
    }
  }, [idea, user]);

  // Fonction pour tronquer le texte (des descriptions pour assurer une taille cohérente) en s'arrêtant au dernier espaces
  function truncateText(text: string, maxLength: number) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return `${lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated} [...]`;
  }

  return (
    <article className="bg-card rounded-3xl w-[370px] py-5 px-5 relative shadow-md flex flex-col justify-between min-h-[23rem] md:h-[23rem] max-w-full">
      {/* Haut de la carte */}
      <div>
        {/* Avatar et titre */}
        <section className="flex items-center mb-4">
          <img
            className="rounded-full w-10 mr-5"
            src={creator.picture}
            alt="profil du créateur"
          />
          <p className="font-bold">{idea.title}</p>
        </section>

        {/* Blocs de catégorie */}
        <section className="flex items-center gap-2">
          {categories.map((cat) => (
            <span
              key={cat.category}
              title={cat.category}
              className={`block h-2 w-1/5 rounded-md ${categoryColors[cat.category] || "bg-gray-300"}`}
            />
          ))}
        </section>

        {/* Contenu de l'idée */}
        <p className="text-justify mt-6">
          "{truncateText(idea.description, 255)}"
        </p>
      </div>

      {/* Bas de la carte : auteur + votes */}
      <div>
        <p className="text-right font-bold mb-4">
          {creator.firstname} {creator.lastname}
        </p>
        {showVotes && (
          <section className="flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={handleLike}
              className="bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white cursor-pointer"
            >
              <span className="inline-block text-center w-6">
                {voteInfo.agree_count}
              </span>
              <i
                className={
                  userVote?.agree
                    ? "bi bi-hand-thumbs-up-fill"
                    : "bi bi-hand-thumbs-up"
                }
              />
            </button>
            <button
              type="button"
              onClick={handleDislike}
              className="bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white cursor-pointer"
            >
              <span className="inline-block text-center w-6">
                {voteInfo.disagree_count}
              </span>
              <i
                className={
                  userVote?.disagree
                    ? "bi bi-hand-thumbs-down-fill"
                    : "bi bi-hand-thumbs-down"
                }
              />
            </button>
          </section>
        )}
      </div>

      {/* Surimpression résultat décision */}
      {showStatusOverlay && idea.statut_id === 2 && (
        <i className="bi bi-check-circle absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-50 pointer-events-none text-[200px] text-greenButton" />
      )}
      {showStatusOverlay && idea.statut_id === 3 && (
        <i className="bi bi-x-circle absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-50 pointer-events-none text-[200px] text-redButton" />
      )}
    </article>
  );
}

export default IdeaCard;
