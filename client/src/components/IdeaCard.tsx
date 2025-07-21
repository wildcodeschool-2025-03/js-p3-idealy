// client/src/components/IdeaCard.tsx

import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useLogin } from "../context/AuthContext";
import { authFetch } from "../utils/authFetch";
import { sanitizeAndTruncate } from "../utils/sanitizeAndTruncate";
import "react-toastify/dist/ReactToastify.css";

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
  deadline: string;
  timestamp: string;
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  picture: string;
}

interface VoteInformation {
  agree_count: number;
  disagree_count: number;
  user_vote?: {
    agree: boolean;
    disagree: boolean;
  };
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
  const { user } = useLogin();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/detail/${idea.id}`);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const voteData = {
        idea_id: idea.id,
        user_id: user?.id,
        agree: true,
        disagree: false,
      };

      const response = await authFetch(
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
      const voteRes = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/votes?user_id=${user?.id}`,
      );
      const voteDataUpdated = await voteRes.json();
      toast.success("Vote enregistré avec succès !");
      setVoteInfo(voteDataUpdated);
    } catch (error) {
      toast.error("Erreur lors du vote");
    }
  };

  const handleDislike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const voteData = {
        idea_id: idea.id,
        user_id: user?.id,
        agree: false,
        disagree: true,
      };

      const response = await authFetch(
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
      const voteRes = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/votes?user_id=${user?.id}`,
      );
      const voteDataUpdated = await voteRes.json();
      toast.success("Vote enregistré avec succès !");
      setVoteInfo(voteDataUpdated);
    } catch (error) {
      toast.error("Erreur lors du vote");
    }
  };

  // Info créateur de l'idée
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/creator`)
      .then((response) => response.json())
      .then((data: User) => {
        if (user && data.id === user.id && !user.isAdmin) {
          // si le créateur de l'idée est l'utilisateur connecté et n'est pas admin
          setCreator({
            ...data, // garde les infos du créateur
            picture: user.picture, // utilise la photo depuis le contexte
          });
        } else {
          setCreator(data); // sinon utilisés les données de l'API
        }
      })
      .catch((err) => {
        console.error("Erreur lors du fetch du créateur :", err);
      });
  }, [idea, user]); // se déclenche quand user change (après refreshUser)

  // Info nb de votes
  useEffect(() => {
    if (!user?.id) return;

    authFetch(
      `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/votes?user_id=${user.id}`,
    )
      .then((response) => response.json())
      .then((data: VoteInformation) => {
        setVoteInfo(data);
      });
  }, [idea, user]);

  // Récupère juste les catégories existantes
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/categories`)
      .then((response) => response.json())
      .then((data: Category[]) => {
        setCategories(data);
      });
  }, [idea]);

  // Calcul du délai de vote autorisé
  const isVoteAllowed = (() => {
    if (!idea.deadline || !idea.timestamp) return true;
    const created = new Date(idea.timestamp).getTime();
    const deadline = new Date(idea.deadline).getTime();
    const now = Date.now();
    const allowedDuration = (deadline - created) * (2 / 3);
    return now - created <= allowedDuration;
  })();

  // Fonction pour tronquer le texte (des descriptions pour assurer une taille cohérente) en s'arrêtant au dernier espaces
  //function truncateText remplacé par utils/sanitizeAndTruncate.ts pour affichage des balises de l'editeur de texte.

  const { html, isTruncated } = sanitizeAndTruncate(idea.description, 255);
  return (
    <article
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "") {
          handleCardClick();
        }
      }}
      className="bg-card rounded-3xl w-[370px] py-5 px-5 relative shadow-md flex flex-col justify-between min-h-[23rem] md:h-[23rem] max-w-full cursor-pointer"
    >
      {/* Haut de la carte */}
      <div>
        {/* Avatar et titre */}
        <section className="flex items-center mb-4">
          <img
            className="rounded-full w-10 mr-5 flex-shrink-0"
            src={
              creator.picture?.startsWith("http") // est-ce que l'url de la photo commence "http" ?
                ? creator.picture // oui = renvoi l'url complète
                : `${import.meta.env.VITE_API_URL}${creator.picture}` // non = renvoi l'url de base
            }
            alt="profil du créateur"
          />
          <p className="font-bold break-words overflow-wrap-anywhere flex-1 min-w-0 idea-title">
            {idea.title}
          </p>
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
        <div
          className={`relative mt-6 text-justify break-words overflow-hidden ${
            isTruncated ? "max-h-[12rem]" : ""
          }`}
        >
          <div className="prose prose-sm max-w-none idea-truncate break-words">
            {parse(html)}
          </div>
          {isTruncated && (
            <span className="absolute bottom-1 right-2 text-gray-500 text-sm font-semibold">
              [...]
            </span>
          )}
        </div>
      </div>

      {/* Bas de la carte : auteur + votes */}
      <div>
        <p className="text-right font-bold mb-4">
          {creator.firstname} {creator.lastname}
        </p>
        {showVotes && (
          <section className="flex items-center justify-center gap-6">
            {isVoteAllowed ? (
              <>
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
                      voteInfo.user_vote?.agree
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
                      voteInfo.user_vote?.disagree
                        ? "bi bi-hand-thumbs-down-fill"
                        : "bi bi-hand-thumbs-down"
                    }
                  />
                </button>
              </>
            ) : (
              <div
                className="bg-blackBackground w-4/5 h-8 rounded-full flex items-center justify-center text-white opacity-60 cursor-not-allowed"
                title="Le délai de vote est dépassé"
              >
                Délai de vote dépassé
              </div>
            )}
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
