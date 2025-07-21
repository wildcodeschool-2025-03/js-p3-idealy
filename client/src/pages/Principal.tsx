// client/src/pages/Principal.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router";
import Carousel from "../components/Carousel";
import IdeaCard from "../components/IdeaCard";
import { useLogin } from "../context/AuthContext";
import { authFetch } from "../utils/authFetch";

interface Idea {
  id: number;
  title: string;
  description: string;
  deadline: string;
  timestamp: string;
  statut_id: number;
}

function Principal() {
  const [recentIdeas, setRecentIdeas] = useState<Idea[]>([]);
  const [userIdeas, setUserIdeas] = useState<Idea[]>([]);
  const [validatedIdeas, setValidatedIdeas] = useState<Idea[]>([]);

  const { user } = useLogin();

  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas?sort=recent`)
      .then((response) => response.json())
      .then((data: Idea[]) => {
        setRecentIdeas(data);
      });
  }, []);

  useEffect(() => {
    if (!user) return; // Si l'utilisateur n'est pas connecté, on ne fait pas la requête
    authFetch(
      `${import.meta.env.VITE_API_URL}/api/ideas?user_id=${user.id}&sort=recent`,
    )
      .then((res) => res.json())
      .then(setUserIdeas);
  }, [user]);

  // Idées validées
  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas?statut=2&sort=recent`)
      .then((res) => res.json())
      .then(setValidatedIdeas);
  }, []);

  const recentSlides = recentIdeas.map((idea) => ({
    id: idea.id.toString(),
    content: <IdeaCard idea={idea} />,
  }));

  const userSlides = userIdeas.map((idea) => ({
    id: idea.id.toString(),
    content: <IdeaCard idea={idea} />,
  }));

  const validatedSlides = validatedIdeas.map((idea) => ({
    id: idea.id.toString(),
    content: <IdeaCard idea={idea} />,
  }));

  return (
    <main className="flex bg-greyBackground flex-col items-center justify-center font-[atkinson] pb-4 pt-4 md:px-8 md:py-8 md:pb-8 md:pt-8 ">
      <Link
        to="/parcourir?sort=chrono"
        className="text-1xl md:text-2xl  font-[atkinson] hover:cursor-pointer mt-6 mb-6 bg-[#ff5f57] rounded-3xl px-6 py-2 text-center w-fit mx-auto"
      >
        Idées les plus récentes
      </Link>

      {/* Carousel mobile uniquement */}
      <div className="block md:hidden w-full mb-6">
        <Carousel slides={recentSlides} />
      </div>

      {/* Liste classique pour desktop */}
      <ul className="hidden md:flex md:flex-row md:gap-6 md:p-4">
        {recentIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </ul>

      <Link
        to={`/parcourir?search=${encodeURIComponent(`${user?.firstname} ${user?.lastname}`)}`}
        className="text-1xl md:text-2xl font-[atkinson] hover:cursor-pointer mt-6 mb-6 bg-[#ffbd2e] rounded-3xl px-6 py-2 text-center w-fit mx-auto"
      >
        Vos idées
      </Link>

      {userIdeas.length === 0 ? (
        <div>
          <p>Vous n’avez pas encore proposé d’idée.</p>

          <Link to="/soumettre">Soumettre une idée</Link>
        </div>
      ) : (
        <>
          <div className="block md:hidden w-full mb-6">
            <Carousel slides={userSlides} />
          </div>
          <ul className="hidden md:flex md:flex-row md:gap-6 md:p-4">
            {userIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </ul>
        </>
      )}

      <Link
        to="/parcourir?statut=2"
        className="text-1xl md:text-2xl font-[atkinson] hover:cursor-pointer mt-6 mb-6 bg-[#28c940] rounded-3xl px-6 py-2 text-center w-fit mx-auto"
      >
        Idées validées
      </Link>

      {/* Carousel mobile uniquement */}
      <div className="block md:hidden w-full mb-6">
        <Carousel slides={validatedSlides} />
      </div>

      <ul className="hidden md:flex md:flex-row md:gap-6 md:p-4">
        {validatedIdeas.length === 0 ? (
          <li>Aucune idée validée.</li>
        ) : (
          validatedIdeas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)
        )}
      </ul>
    </main>
  );
}

export default Principal;
