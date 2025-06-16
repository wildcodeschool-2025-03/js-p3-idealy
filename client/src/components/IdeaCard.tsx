// client/src/components/IdeaCard.tsx

import { useEffect, useState } from "react";

interface IdeaProp {
  idea: Idea;
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

function IdeaCard({ idea }: IdeaProp) {
  // State pour les compteurs de like et dislike
  const [likeCount, setLikeCount] = useState(14);
  const [dislikeCount, setDislikeCount] = useState(8);
  const [creator, setCreator] = useState({} as User);

  const handleLike = async () => {
    // Logique de requête à l'API
    setLikeCount((prev) => prev + 1);
  };

  const handleDislike = async () => {
    // Logique de requête à l'API
    setDislikeCount((prev) => prev + 1);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}/creator`)
      .then((response) => response.json())
      .then((data: User) => {
        setCreator(data);
      });
  }, [idea]);

  return (
    <article className="bg-card rounded-3xl max-w-[370px] py-5 px-5 relative shadow-md flex flex-col">
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
        <span className="block bg-redButton h-2 w-1/5 rounded-md" />
        <span className="block bg-yellowButton h-2 w-1/5 rounded-md" />
        <span className="block bg-greenButton h-2 w-1/5 rounded-md" />
      </section>

      {/* Contenu de l'idée */}
      <p className="text-justify mt-6">{idea.description}</p>
      <p className="text-right font-bold mt-2 mb-4">
        {" "}
        {creator.firstname} {creator.lastname}
      </p>

      {/* Boutons de vote */}
      <section className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={handleLike}
          className=" bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white"
        >
          <span>{likeCount}</span>
          <i className="bi bi-hand-thumbs-up" />
        </button>
        <button
          type="button"
          onClick={handleDislike}
          className=" bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white"
        >
          <span>{dislikeCount}</span>
          <i className="bi bi-hand-thumbs-down" />
        </button>
      </section>

      {/* Surimpression résultat décision */}
      {idea.statut_id === 2 && (
        <i className="bi bi-check-circle absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-50 pointer-events-none text-[200px] text-greenButton" />
      )}
      {idea.statut_id === 3 && (
        <i className="bi bi-x-circle absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-50 pointer-events-none text-[200px] text-redButton" />
      )}
    </article>
  );
}

export default IdeaCard;
