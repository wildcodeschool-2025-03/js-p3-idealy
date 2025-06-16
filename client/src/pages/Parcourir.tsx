// client/src/pages/Parcourir

import { useEffect, useState } from "react";
import IdeaCard from "../components/IdeaCard";

interface Idea {
  id: number;
  title: string;
  description: string;
  statut_id: number;
}

function Parcourir() {
  const [ideas, setIdeas] = useState([] as Idea[]);

  // Récupère la liste des idées depuis l'API au chargement du composant
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas`)
      .then((response) => response.json())
      .then((data) => {
        setIdeas(data);
        console.log("Fetched ideas:", data);
      })
      .catch((error) => {
        console.error("Error fetching ideas:", error);
      });
  }, []);

  return (
    <section className="bg-greyBackground pt-20 pb-20 md:w-[90rem] m-auto gap-10 flex flex-col items-center">
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </section>
  );
}

export default Parcourir;
