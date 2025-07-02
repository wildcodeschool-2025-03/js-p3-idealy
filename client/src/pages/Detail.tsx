import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { categoryColors } from "../constants/categoryColors";
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

interface Comment {
  id: number;
  created_at: string;
  content: string;
  idea_id: number;
  user_id: number;
}

function Detail() {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [categories, setCategories] = useState([] as { category: string }[]);
  const [creator, setCreator] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentUsers, setCommentUsers] = useState<{ [key: number]: User }>({});

  const { id } = useParams<{ id: string }>(); // extrait l'id de l'URL et le stock dans la variable id

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

  return (
    <>
      <div className="flex flex-col justify-center p-8 gap-8 bg-greyBackground">
        <button
          className="bg-yellowButton rounded-3xl py-1 cursor-pointer"
          type="button"
        >
          Afficher le Workflow
        </button>

        <div className="bg-card rounded-3xl p-4">
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
          <p>{idea?.description}</p>

          {/* Nom / Prénom */}
          <p className="text-right font-bold mb-2 mt-6">
            {creator?.firstname} {creator?.lastname}
          </p>
        </div>

        <button
          className="bg-greenButton rounded-3xl py-1 cursor-pointer"
          type="button"
        >
          Ajouter un commentaire
        </button>
      </div>

      <div className="flex flex-col p-4 gap-4 bg-greyBackground">
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
            <p className="mt-2">{comment.content}</p>
          </section>
        ))}
      </div>
    </>
  );
}

export default Detail;
