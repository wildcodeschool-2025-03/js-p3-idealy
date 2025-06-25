import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import IdeaCard from "../components/IdeaCard";

interface Idea {
  id: number;
  title: string;
  description: string;
  deadline: string;
  timestamp: string;
  statut_id: number;
  firstname: string;
  lastname: string;
  email: string;
  user_id: number;
}

function Admin() {
  const [recentIdeas, setRecentIdeas] = useState<Idea[]>([]);
  const [justifs, setJustifs] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas?toValidate=1`)
      .then((response) => response.json())
      .then((data: Idea[]) => {
        setRecentIdeas(data);
      });
  }, []);

  const handleDecision = async (
    id: number,
    action: "valider" | "refuser" | "supprimer",
  ) => {
    const idea = recentIdeas.find((i) => i.id === id);
    if (!idea) return;

    const justification = justifs[id];

    if (action === "supprimer") {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.status === 204) {
        setRecentIdeas((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert("Erreur lors de la suppression !");
      }
    } else {
      const nouveauStatut = action === "valider" ? 2 : 3;
      await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          deadline: idea.deadline,
          statut_id: nouveauStatut,
          justification,
        }),
      }).then((response) => {
        if (response.status === 204) {
          setRecentIdeas((prev) => prev.filter((i) => i.id !== id));
        }
      });
    }
  };

  // Carousel mobile
  const slides = recentIdeas.map((idea) => ({
    id: idea.id.toString(),
    content: (
      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
        <div className="font-bold flex flex-col items-center mb-2">
          <span>IDEE {idea.id}</span>
          <span>
            {idea.firstname} {idea.lastname}
          </span>
        </div>
        <IdeaCard idea={idea} />

        <div className="flex flex-col gap-2 items-center">
          <button
            type="button"
            onClick={() => window.open(`/detail/${idea.id}`, "_blank")}
            className=" bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white"
          >
            Afficher
          </button>
          <a
            href={`mailto:${idea.email}`}
            className=" bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white"
          >
            Contacter
          </a>
          <input
            type="text"
            placeholder="Justification"
            value={justifs[idea.id] || ""}
            onChange={(e) =>
              setJustifs({ ...justifs, [idea.id]: e.target.value })
            }
            className="w-full border rounded px-2 py-1 my-2"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleDecision(idea.id, "valider")}
              className="text-green-600 text-2xl"
              title="Valider"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => handleDecision(idea.id, "refuser")}
              className="text-red-600 text-2xl"
              title="Refuser"
            >
              X
            </button>
            <button
              type="button"
              onClick={() => handleDecision(idea.id, "supprimer")}
              className="text-gray-600 text-2xl"
              title="Supprimer"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <main className="p-2 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-xl md:text-3xl font-bold mb-4 text-center">
        Gestionnaire
      </h1>

      {/* Carousel mobile */}
      <div className="block md:hidden w-full mb-6">
        <Carousel slides={slides} />
      </div>

      {/* Tableau desktop */}
      <div className="hidden md:block">
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Idées</th>
              <th className="p-2">Justifications</th>
              <th className="p-2">Décisions</th>
            </tr>
          </thead>
          <tbody>
            {recentIdeas.map((idea) => (
              <tr key={idea.id} className="border-t">
                <td className="p-2 text-center font-bold">
                  {idea.id}
                  <br />
                  <span className="block text-xs font-normal">
                    {idea.firstname} {idea.lastname}
                  </span>
                </td>
                <td className="p-2">
                  <IdeaCard idea={idea} />
                  <button
                    type="button"
                    onClick={() => window.open(`/detail/${idea.id}`, "_blank")}
                    className="bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white"
                  >
                    Afficher
                  </button>
                  <a
                    href={`mailto:${idea.email}`}
                    className=" bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white"
                  >
                    Contacter
                  </a>
                </td>
                <td className="p-2 align-top">
                  <input
                    type="text"
                    placeholder="Justification"
                    value={justifs[idea.id] || ""}
                    onChange={(e) =>
                      setJustifs({ ...justifs, [idea.id]: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2 align-top">
                  <div className="flex flex-col gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => handleDecision(idea.id, "valider")}
                      className="text-green-600 text-2xl"
                      title="Valider"
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(idea.id, "refuser")}
                      className="text-red-600 text-2xl"
                      title="Refuser"
                    >
                      ✗
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(idea.id, "supprimer")}
                      className="text-gray-600 text-2xl"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Admin;
