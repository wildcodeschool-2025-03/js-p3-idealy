import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { FiPaperclip } from "react-icons/fi";
import { useParams } from "react-router";
import CommentModal from "../components/CommentModal";
import MediaModal from "../components/MediaModal";
import WorkflowModal from "../components/WorkflowModal";
import WorkflowSidebar from "../components/WorkflowSideBar";
import { categoryColors } from "../constants/categoryColors";
import { useLogin } from "../context/AuthContext";
import { authFetch } from "../utils/authFetch";

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

interface Category {
  category: string;
}

interface Comment {
  id: number;
  created_at: string;
  content: string;
  idea_id: number;
  user_id: number;
}

interface UserVote {
  agree: boolean;
  disagree: boolean;
}

interface UserVoteData {
  agree_count: number;
  disagree_count: number;
  user_vote?: UserVote;
}

interface VoteInfo {
  agree_count: number;
  disagree_count: number;
}

interface Media {
  id: number;
  url: string;
  type: string;
  created_at: string;
}

function Detail() {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [creator, setCreator] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentUsers, setCommentUsers] = useState<{ [key: number]: User }>({});
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const { user } = useLogin();
  const [voteInfo, setVoteInfo] = useState<VoteInfo | null>(null);
  const [userVoteData, setUserVoteData] = useState<UserVoteData>({
    agree_count: 0,
    disagree_count: 0,
  });
  const [medias, setMedias] = useState<Media[]>([]);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const handleOpenCommentModal = () => {
    setIsCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  const handleOpenWorkflowModal = () => {
    setIsWorkflowModalOpen(true);
  };

  const handleCloseWorkflowModal = () => {
    setIsWorkflowModalOpen(false);
  };

  const { id } = useParams<{ id: string }>(); // extrait l'id de l'URL et le stock dans la variable id

  // Récupère les données principales de l'idée (titre, description, deadline, etc.)
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setIdea(data); // stock la réponse de l'API
      })
      .catch((error) => {
        console.error("Error fetching idea:", error);
      });
  }, [id]);

  // Récupère les informations du créateur de l'idée (nom, prénom, photo)
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/creator`)
      .then((response) => response.json())
      .then((data) => {
        setCreator(data); // stock la réponse de l'API
      })
      .catch((error) => {
        console.error("Error fetching creator:", error);
      });
  }, [id]); // quand l'ID change, va chercher le nouveau créateur

  // Récupère les catégories associées à l'idée
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, [id]);

  // Récupère les commentaires ET les infos des utilisateurs qui ont commenté
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/comments`)
      .then((response) => response.json())
      .then(async (data) => {
        setComments(data);

        // Après avoir récupéré les commentaires, on récupère les infos des utilisateurs
        for (const comment of data) {
          try {
            const userResponse = await authFetch(
              `${import.meta.env.VITE_API_URL}/api/users/${comment.user_id}`,
            );
            const userData = await userResponse.json();

            setCommentUsers((prev) => ({
              ...prev,
              [comment.user_id]: userData,
            }));
          } catch (error) {
            console.error(`Error fetching user ${comment.user_id}:`, error);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [id]);

  // Récupère les totaux de votes (pour WorkflowModal uniquement)
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/votes`)
      .then((response) => response.json())
      .then((data) => {
        setVoteInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching votes:", error);
      });
  }, [id]);

  // Fonction pour rafraîchir les commentaires après ajout
  const refreshComments = () => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/comments`)
      .then((response) => response.json())
      .then(async (data) => {
        setComments(data);

        // Récupère les infos utilisateurs pour chaque commentaire (notamment pour le premier commentaire)
        for (const comment of data) {
          try {
            const userResponse = await authFetch(
              `${import.meta.env.VITE_API_URL}/api/users/${comment.user_id}`,
            );
            const userData = await userResponse.json();

            setCommentUsers((prev) => ({
              ...prev,
              [comment.user_id]: userData,
            }));
          } catch (error) {
            console.error(`Error fetching user ${comment.user_id}:`, error);
          }
        }
      });
  };

  // Récupère les données de vote avec l'état de l'utilisateur connecté (pour les boutons interactifs)
  useEffect(() => {
    if (!user?.id) return;

    authFetch(
      `${import.meta.env.VITE_API_URL}/api/ideas/${id}/votes?user_id=${user.id}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setUserVoteData(data);
      })
      .catch((error) => {
        console.error("Error fetching user votes", error);
      });
  }, [id, user]);

  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/medias`)
      .then((response) => response.json())
      .then((data) => {
        setMedias(data);
      })
      .catch((error) => {
        console.error("Error fetching medias", error);
      });
  }, [id]);

  const handleLike = async () => {
    try {
      const voteData = {
        idea_id: Number(id),
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
        `${import.meta.env.VITE_API_URL}/api/ideas/${id}/votes?user_id=${user?.id}`,
      );
      const voteDataUpdated = await voteRes.json();
      console.log("Vote info updated:", voteDataUpdated);
      setUserVoteData(voteDataUpdated);
    } catch (error) {
      console.error("Erreur de création :", error);
      alert("Une erreur est survenue lors du vote.");
    }
  };

  const handleDislike = async () => {
    try {
      const voteData = {
        idea_id: Number(id),
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
        `${import.meta.env.VITE_API_URL}/api/ideas/${id}/votes?user_id=${user?.id}`,
      );
      const voteDataUpdated = await voteRes.json();
      console.log("Vote info updated:", voteDataUpdated);
      setUserVoteData(voteDataUpdated);
    } catch (error) {
      console.error("Erreur de création :", error);
      alert("Une erreur est survenue lors du vote.");
    }
  };

  // Calcul du délai de vote autorisé
  const isVoteAllowed = (() => {
    if (!idea?.deadline || !idea?.timestamp) return true;
    const created = new Date(idea.timestamp).getTime();
    const deadline = new Date(idea.deadline).getTime();
    const now = Date.now();
    const allowedDuration = (deadline - created) * (2 / 3);
    return now - created <= allowedDuration;
  })();

  const isCommentAllowed = (() => {
    if (!idea?.deadline || !idea.timestamp) return true;
    const created = new Date(idea.timestamp).getTime();
    const deadline = new Date(idea.deadline).getTime();
    const now = Date.now();
    const allowedDuration = (deadline - created) * (1 / 3);
    return now - created <= allowedDuration;
  })();

  return (
    <>
      <div className="flex flex-col md:flex-row bg-greyBackground md:min-h-[calc(100vh-200px)]">
        <div className="flex flex-col p-8 gap-8 md:w-2/3">
          <button
            onClick={handleOpenWorkflowModal}
            className="bg-yellowButton rounded-3xl py-1 cursor-pointer md:hidden"
            type="button"
          >
            Afficher le Workflow
          </button>

          <div className="bg-card rounded-3xl p-4 shadow-md">
            {/* Photo + Titre */}
            <section className="flex items-center mb-4">
              <img
                className="rounded-full w-10 mr-5"
                src={
                  creator?.picture?.startsWith("http")
                    ? creator.picture
                    : `${import.meta.env.VITE_API_URL}${creator?.picture}`
                }
                alt="profil du créateur"
              />
              <h1>{idea?.title}</h1>
              {medias.length > 0 && (
                <FiPaperclip
                  className="ml-2 text-gray-600 cursor-pointer text-lg hover:text-gray-800"
                  title={`${medias.length} fichier(s) joint(s)`}
                  onClick={() => setIsMediaModalOpen(true)}
                />
              )}
            </section>

            {/* Catégories */}
            <section className="flex items-center gap-2 mb-4">
              {categories.map((cat) => (
                <span
                  key={cat.category}
                  title={cat.category}
                  className={`block h-2 w-1/5 rounded-md ${categoryColors[cat.category] || "bg-gray-300"}`}
                />
              ))}
            </section>

            {/* Description */}
            <div className="prose prose-sm max-w-none break-words">
              {idea?.description && parse(idea.description)}
            </div>

            {/* Nom / Prénom */}
            <p className="text-right font-bold mb-8 mt-6">
              {creator?.firstname} {creator?.lastname}
            </p>

            <section className="flex items-center justify-center gap-6">
              {isVoteAllowed ? (
                <>
                  <button
                    type="button"
                    onClick={handleLike}
                    className="bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white cursor-pointer"
                  >
                    <span className="inline-block text-center w-6">
                      {userVoteData.agree_count}
                    </span>
                    <i
                      className={
                        userVoteData.user_vote?.agree
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
                      {userVoteData.disagree_count}
                    </span>
                    <i
                      className={
                        userVoteData.user_vote?.disagree
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
          </div>

          {isCommentAllowed ? (
            <button
              onClick={handleOpenCommentModal}
              className="bg-greenButton rounded-3xl py-1 cursor-pointer"
              type="button"
            >
              Ajouter un commentaire
            </button>
          ) : (
            <button
              className="bg-gray-400 rounded-3xl py-1 cursor-not-allowed opacity-60"
              title="Le délai de commentaire est dépassé"
              type="button"
              disabled
            >
              Délai de commentaire dépassé
            </button>
          )}

          <div className="hidden md:flex md:flex-col gap-4">
            {comments?.map((comment) => (
              <section key={comment.id} className="bg-card rounded-3xl p-4">
                {/* Date */}
                <p className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString("fr-FR")}
                </p>

                {/* Nom de l'auteur */}
                <p className="font-bold mt-1">
                  {commentUsers[comment.user_id]?.firstname}{" "}
                  {commentUsers[comment.user_id]?.lastname}
                </p>

                {/* Contenu */}
                <p className="mt-2 break-words">{comment.content}</p>
              </section>
            ))}
          </div>
        </div>

        <div className="hidden md:flex md:w-1/3 p-4">
          {idea && voteInfo && (
            <WorkflowSidebar idea={idea} voteData={voteInfo} />
          )}
        </div>
      </div>

      <div className="flex flex-col p-4 gap-4 bg-greyBackground md:hidden">
        {comments?.map((comment) => (
          <section key={comment.id} className="bg-card rounded-3xl p-4">
            {/* Date */}
            <p className="text-sm text-gray-500">
              {new Date(comment.created_at).toLocaleDateString("fr-FR")}
            </p>

            {/* Nom de l'auteur */}
            <p className="font-bold mt-1">
              {commentUsers[comment.user_id]?.firstname}{" "}
              {commentUsers[comment.user_id]?.lastname}
            </p>

            {/* Contenu */}
            <p className="mt-2 break-words">{comment.content}</p>
          </section>
        ))}
      </div>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={handleCloseCommentModal}
        ideaId={Number(id)}
        onCommentAdded={refreshComments}
      />
      {idea && voteInfo && (
        <WorkflowModal
          isOpen={isWorkflowModalOpen}
          onClose={handleCloseWorkflowModal}
          idea={idea}
          voteData={voteInfo}
        />
      )}
      <MediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        medias={medias}
      />
    </>
  );
}

export default Detail;
