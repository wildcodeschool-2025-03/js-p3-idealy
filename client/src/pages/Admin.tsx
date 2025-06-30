import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import IdeaCard from "../components/IdeaCard";
import { useLogin } from "../context/AuthContext";

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

interface User {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  password: string;
  picture: string;
  service_id: number;
}

function Admin() {
  const { user } = useLogin();

  const [recentIdeas, setRecentIdeas] = useState<Idea[]>([]);
  const [justifs, setJustifs] = useState<{ [id: number]: string }>({});
  const [confirmAction, setConfirmAction] = useState<{
    id: number;
    action: "valider" | "refuser" | "supprimer" | null;
  } | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [showUsers, setShowUsers] = useState(false);

  const [showHistory, setShowHistory] = useState(false);
  const [historyIdeas, setHistoryIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas?toValidate=1`)
      .then((response) => response.json())
      .then((data: Idea[]) => {
        setRecentIdeas(data);
      });
  }, []);

  if (!user || !user.isAdmin) {
    return (
      <main>
        <h1>Accès refusé</h1>
        <p>Cette page est réservée à l’administrateur.</p>
      </main>
    );
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then((res) => res.json())
      .then((data: User[]) => {
        setUsers(data);
      });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas/history`)
      .then((res) => res.json())
      .then((data: Idea[]) => setHistoryIdeas(data));
  }, []);

  const handleDecision = async (
    id: number,
    action: "valider" | "refuser" | "supprimer",
  ) => {
    const idea = recentIdeas.find((i) => i.id === id);
    if (!idea) return;

    const justification = justifs[id];
    // Justification obligatoire pour valider ou refuser
    if (
      (action === "valider" ||
        action === "refuser" ||
        action === "supprimer") &&
      (!justification || justification.trim() === "")
    ) {
      alert("Merci de saisir une justification avant de continuer.");
      return;
    }

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

  const handleDeleteUser = async (id: number) => {
    const confirm = window.confirm(
      "Attention, vous allez supprimer cet utilisateur. Continuer ?",
    );
    if (!confirm) return;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/${id}`,
      {
        method: "DELETE",
      },
    );
    if (response.status === 204) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      alert("Erreur lors de la suppression !");
    }
  };

  // Carousel mobile
  const slides = recentIdeas.map((idea) => ({
    id: idea.id.toString(),
    content: (
      <div className=" p-4 flex flex-col gap-4">
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
          <textarea
            rows={2}
            maxLength={150}
            placeholder="Justification"
            value={justifs[idea.id] || ""}
            onChange={(e) =>
              setJustifs({ ...justifs, [idea.id]: e.target.value })
            }
            className="w-full border rounded px-2 py-1 my-2"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {`${(justifs[idea.id] || "").length}/150 caractères`}
            {(justifs[idea.id] || "").length >= 150 && (
              <span className="text-red-500 ml-2">Limite atteinte</span>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() =>
                setConfirmAction({ id: idea.id, action: "valider" })
              }
              className="text-green-600 text-2xl"
              title="Valider"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() =>
                setConfirmAction({ id: idea.id, action: "refuser" })
              }
              className="text-red-600 text-2xl"
              title="Refuser"
            >
              X
            </button>
            <button
              type="button"
              onClick={() =>
                setConfirmAction({ id: idea.id, action: "supprimer" })
              }
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
    <div className=" bg-greyBackground">
      <main className=" min-h-[80vh]  p-2 md:p-8 max-w-5xl mx-auto">
        {/*gestion des idees*/}
        <h1 className="text-xl md:text-3xl font-bold mb-4 text-center">
          Administrateur
        </h1>

        <h2 className="text-xl font-bold mt-10 mb-4 cursor-pointer select-none">
          Valider, refuser, supprimer une idée
        </h2>

        {confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
              <p className="mb-4 text-lg font-bold">
                Êtes-vous sûr de vouloir {confirmAction.action} cette
                idée&nbsp;?
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => {
                    if (confirmAction.action) {
                      handleDecision(confirmAction.id, confirmAction.action);
                    }
                    setConfirmAction(null);
                  }}
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setConfirmAction(null)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Carousel mobile */}
        <div className="block md:hidden w-full mb-6">
          <Carousel slides={slides} />
        </div>

        {/* Tableau desktop */}
        <div className="hidden md:block">
          <table className="w-full rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Idées</th>
                <th className="p-2 border">Justifications</th>
                <th className="p-2 border">Décisions</th>
              </tr>
            </thead>
            <tbody>
              {recentIdeas.map((idea) => (
                <tr key={idea.id} className="border-t">
                  <td className="p-2 text-center font-bold border">
                    {idea.id}
                    <br />
                    <span className="block text-xs font-normal">
                      {idea.firstname} {idea.lastname}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <IdeaCard idea={idea} />
                    <div className="flex flex-row gap-2 mt-4 mb-4 md:mt-6">
                      <button
                        type="button"
                        onClick={() =>
                          window.open(`/detail/${idea.id}`, "_blank")
                        }
                        className="bg-blackBackground w-2/5 h-8 rounded-full flex flex-row items-center justify-center gap-2 text-white"
                      >
                        Afficher
                      </button>
                      <a
                        href={`mailto:${idea.email}`}
                        className=" bg-blackBackground w-2/5 h-8 rounded-full flex items-center justify-center gap-2 text-white"
                      >
                        Contacter
                      </a>
                    </div>
                  </td>

                  <td className="p-2 align-top border">
                    <textarea
                      rows={16}
                      maxLength={250}
                      placeholder="Justification"
                      value={justifs[idea.id] || ""}
                      onChange={(e) =>
                        setJustifs({ ...justifs, [idea.id]: e.target.value })
                      }
                      className="w-full border rounded px-2 py-2 min-h-[120px] resize-y"
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {`${(justifs[idea.id] || "").length}/250 caractères`}
                      {(justifs[idea.id] || "").length >= 250 && (
                        <span className="text-red-500 ml-2">
                          Limite atteinte
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 align-top border">
                    <div className="flex flex-col gap-2 items-center">
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmAction({ id: idea.id, action: "valider" })
                        }
                        className="text-green-600 text-2xl"
                        title="Valider"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmAction({ id: idea.id, action: "refuser" })
                        }
                        className="text-red-600 text-2xl"
                        title="Refuser"
                      >
                        ✗
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmAction({ id: idea.id, action: "supprimer" })
                        }
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

        {/* gestion des users */}
        <button
          type="button"
          className="text-xl font-bold mt-10 mb-4 cursor-pointer select-none"
          onClick={() => setShowUsers((prev) => !prev)}
        >
          Gestion des utilisateurs{" "}
          <span className="ml-2">{showUsers ? "▲" : "▼"}</span>
        </button>
        {showUsers && (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[350px] w-full bg-white rounded-lg shadow mb-8 text-xs text-center md:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Nom</th>
                  <th className="p-2 border">Prénom</th>

                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => u.id !== user.id)
                  .map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-2 text-center border">{user.id}</td>
                      <td className="p-2 border">{user.lastname}</td>
                      <td className="p-2 border">{user.firstname}</td>
                      <td className="p-2 text-center border">
                        <button
                          type="button"
                          className="text-red-600 font-bold"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* gestion de l historique avec modification */}
        <button
          type="button"
          className="text-xl font-bold mt-4 mb-4 cursor-pointer select-none md:flex"
          onClick={() => setShowHistory((prev) => !prev)}
        >
          Historique des idées
          <span className="ml-2">{showHistory ? "▲" : "▼"}</span>
        </button>
        {showHistory && (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[350px] w-full bg-white rounded-lg shadow mb-8 text-xs text-center md:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Idée</th>

                  <th className="p-2 border">Statut</th>
                  <th className="p-2 border">Modifier</th>
                </tr>
              </thead>
              <tbody>
                {historyIdeas.map((idea) => (
                  <tr key={idea.id} className="border-t">
                    <td className="p-2 text-center border">{idea.id}</td>
                    <td className="p-2 border">{idea.title}</td>

                    <td className="p-2 border">
                      {idea.statut_id === 2 && (
                        <span className="text-green-600">Validée</span>
                      )}
                      {idea.statut_id === 3 && (
                        <span className="text-red-600">Refusée</span>
                      )}
                    </td>
                    <td className="p-2 border">
                      <select
                        value={idea.statut_id}
                        onChange={async (e) => {
                          const newStatut = Number(e.target.value);
                          await fetch(
                            `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}`,
                            {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                ...idea,
                                statut_id: newStatut,
                              }),
                            },
                          );
                          setHistoryIdeas((prev) =>
                            prev.map((i) =>
                              i.id === idea.id
                                ? { ...i, statut_id: newStatut }
                                : i,
                            ),
                          );
                        }}
                        className="border rounded px-2 py-1"
                      >
                        <option value={2}>Validée</option>
                        <option value={3}>Refusée</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
