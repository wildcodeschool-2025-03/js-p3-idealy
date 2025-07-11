import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import IdeaCard from "../components/IdeaCard";
import { useLogin } from "../context/AuthContext";
import { authFetch } from "../utils/authFetch";
import "bootstrap-icons/font/bootstrap-icons.css";

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
  justification?: string;
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
  const [confirmUserDelete, setConfirmUserDelete] = useState<number | null>(
    null,
  );

  const [showHistory, setShowHistory] = useState(false);
  const [historyIdeas, setHistoryIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas?toValidate=1`)
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
    authFetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then((res) => res.json())
      .then((data: User[]) => {
        setUsers(data);
      });
  }, []);

  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/history`)
      .then((res) => res.json())
      .then((data: Idea[]) => setHistoryIdeas(data));
  }, []);

  const fetchRecentIdeas = async () => {
    const res = await authFetch(
      `${import.meta.env.VITE_API_URL}/api/ideas?toValidate=1`,
    );
    const data = await res.json();
    setRecentIdeas(data);
  };

  const fetchHistoryIdeas = async () => {
    const res = await authFetch(
      `${import.meta.env.VITE_API_URL}/api/ideas/history`,
    );
    const data = await res.json();
    setHistoryIdeas(data);
  };

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
      (!justification || justification.trim().length < 5)
    ) {
      alert("Merci de justifier avec au minimum 5 caractères.");
      return;
    }

    if (action === "supprimer") {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.status === 204) {
        fetchRecentIdeas();
        fetchHistoryIdeas();
      } else {
        alert("Erreur lors de la suppression !");
      }
    } else {
      const nouveauStatut = action === "valider" ? 2 : 3;
      await authFetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}`, {
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
          fetchRecentIdeas();
          fetchHistoryIdeas();
        }
      });
    }
  };

  const handleDeleteUser = async (id: number) => {
    // La confirmation est déjà gérée par la pop-up, donc rien à faire ici

    try {
      // Transfer ideas to user_id=2
      await authFetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/transfer-to-user-2`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: id }),
        },
      );

      // Transfer comments to user_id=2
      await authFetch(
        `${import.meta.env.VITE_API_URL}/api/comments/transfer-to-user-2`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: id }),
        },
      );

      // Delete user votes
      await authFetch(
        `${import.meta.env.VITE_API_URL}/api/votes/delete-user-votes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: id }),
        },
      );

      // Finally, delete the user
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/users/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.status === 204) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        alert(
          "Utilisateur supprimé et ses données transférées à au user à l'id n°2 !",
        );
      } else {
        alert("Erreur lors de la suppression de l'utilisateur !");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de l'utilisateur !");
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

        <div className="flex flex-col gap-2 items-center cursor-pointer">
          <button
            type="button"
            onClick={() => window.open(`/detail/${idea.id}`, "_blank")}
            className=" bg-blackBackground w-2/5 h-8 rounded-full flex cursor-pointer items-center justify-center gap-2 text-white"
          >
            Afficher
          </button>
          <a
            href={`mailto:${idea.email}?subject=${encodeURIComponent(`À propos de votre idée n°${idea.id}`)}&body=${encodeURIComponent(justifs[idea.id] || "")}`}
            className="bg-blackBackground w-2/5 h-8 rounded-full flex cursor-pointer items-center justify-center gap-2 text-white"
          >
            Contacter
          </a>

          <textarea
            rows={2}
            maxLength={150}
            placeholder="Justification obligatoire min 5 caractères"
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
              <i className="bi bi-check-circle" />
            </button>
            <button
              type="button"
              onClick={() =>
                setConfirmAction({ id: idea.id, action: "refuser" })
              }
              className="text-red-600 text-2xl"
              title="Refuser"
            >
              <i className="bi bi-x-circle" />
            </button>
            <button
              type="button"
              onClick={() =>
                setConfirmAction({ id: idea.id, action: "supprimer" })
              }
              className="text-gray-600 text-2xl"
              title="Supprimer"
            >
              <i className="bi bi-trash" />
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
        <h1 className="text-1xl md:text-3xl font-bold mb-4 text-center">
          Administrateur
        </h1>

        <h2 className="text-1xl md:text-2xl  font-[atkinson] hover:cursor-pointer mt-6 mb-6 bg-[#ff5f57] rounded-3xl px-6 py-2 text-center w-fit mx-auto">
          Valider, refuser, supprimer une idée
        </h2>

        {confirmAction && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
              <p className="mb-4 text-lg font-bold">
                Êtes-vous sûr de vouloir {confirmAction.action} cette
                idée&nbsp;?
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="bg-[#28c940] rounded-3xl  px-4 py-2 "
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
                  className="bg-gray-400  px-4 py-2 rounded-3xl"
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
                <th className="p-2 border">
                  {" "}
                  Justification <span className="text-red-500">*</span>
                </th>
                <th className="p-2 border">Décisions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(recentIdeas) &&
                recentIdeas.map((idea) => (
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
                          className="bg-blackBackground w-2/5 h-8 rounded-full flex flex-row cursor-pointer items-center justify-center gap-2 text-white"
                        >
                          Afficher
                        </button>
                        <a
                          href={`mailto:${idea.email}?subject=${encodeURIComponent(`À propos de votre idée n°${idea.id}`)}&body=${encodeURIComponent(justifs[idea.id] || "")}`}
                          className="bg-blackBackground w-2/5 h-8 rounded-full flex cursor-pointer items-center justify-center gap-2 text-white"
                        >
                          Contacter
                        </a>
                      </div>
                    </td>

                    <td className="p-2 align-top border">
                      <label
                        htmlFor={`justification-${idea.id}`}
                        className="block text-xs font-semibold mb-1"
                      >
                        Justification
                      </label>
                      <textarea
                        id={`justification-${idea.id}`}
                        rows={16}
                        maxLength={250}
                        placeholder="Justification obligatoire min 5 caractères"
                        value={justifs[idea.id] || ""}
                        onChange={(e) =>
                          setJustifs({ ...justifs, [idea.id]: e.target.value })
                        }
                        className="w-full  rounded px-2 py-2 min-h-[120px] resize-y outline-none "
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
                          onClick={() => {
                            if (
                              !justifs[idea.id] ||
                              justifs[idea.id].trim().length < 5
                            ) {
                              alert(
                                "Merci de justifier avec au minimum 5 caractères.",
                              );
                              return;
                            }
                            setConfirmAction({
                              id: idea.id,
                              action: "valider",
                            });
                          }}
                          className="text-green-600 text-2xl"
                          title="Valider"
                        >
                          <i className="bi bi-check-circle" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              !justifs[idea.id] ||
                              justifs[idea.id].trim().length < 5
                            ) {
                              alert(
                                "Merci de justifier avec au minimum 5 caractères.",
                              );
                              return;
                            }
                            setConfirmAction({
                              id: idea.id,
                              action: "refuser",
                            });
                          }}
                          className="text-red-600 text-2xl"
                          title="Refuser"
                        >
                          <i className="bi bi-x-circle" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              !justifs[idea.id] ||
                              justifs[idea.id].trim().length < 5
                            ) {
                              alert(
                                "Merci de justifier avec au minimum 5 caractères.",
                              );
                              return;
                            }
                            setConfirmAction({
                              id: idea.id,
                              action: "supprimer",
                            });
                          }}
                          className="text-gray-600 text-2xl"
                          title="Supprimer"
                        >
                          <i className="bi bi-trash" />
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
          className="text-1xl md:text-2xl font-[atkinson] flex hover:cursor-pointer mt-6 mb-6 bg-[#ffbd2e] rounded-3xl px-6 py-2 text-center w-fit mx-auto md:flex"
          onClick={() => setShowUsers((prev) => !prev)}
        >
          Gestion des utilisateurs{" "}
          <span className="ml-2">{showUsers ? "▲" : "▼"}</span>
        </button>
        {confirmUserDelete !== null && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
              <p className="mb-4 text-lg font-bold text-center">
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?<br />
                Ses idées et commentaires seront transférés à l'utilisateur avec
                l'ID 2.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="bg-[#28c940] rounded-3xl px-4 py-2"
                  onClick={async () => {
                    await handleDeleteUser(confirmUserDelete);
                    setConfirmUserDelete(null);
                  }}
                >
                  Confirmer
                </button>
                <button
                  type="button"
                  className="bg-gray-400 px-4 py-2 rounded-3xl"
                  onClick={() => setConfirmUserDelete(null)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
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
                {Array.isArray(users) &&
                  users
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
                            onClick={() => setConfirmUserDelete(user.id)}
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
          className="text-1xl md:text-2xl font-[atkinson] flex hover:cursor-pointer mt-6 mb-6 bg-[#28c940] rounded-3xl px-6 py-2 text-center w-fit mx-auto md:flex"
          onClick={() => setShowHistory((prev) => !prev)}
        >
          Historique des idées
          <span className="ml-2">{showHistory ? "▲" : "▼"}</span>
        </button>
        {showHistory && (
          <div className="w-full overflow-x-auto">
            <table className="min-w-max w-full bg-white rounded-lg shadow mb-8 text-xs text-center md:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border w-4">ID</th>
                  <th className="p-2 border w-24">Idée</th>
                  <th className="p-2 border w-8">Statut</th>
                  <th className="p-2 border w-20">Justification</th>
                  <th className="p-2 border w-20">Modifier</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(historyIdeas) &&
                  historyIdeas.map((idea) => (
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
                      <td className="p-2 border max-w-[100px] align-top">
                        <div className="max-h-16 overflow-y-auto whitespace-pre-line break-words text-xs">
                          {idea.justification}
                        </div>
                      </td>
                      <td className="p-2 border">
                        <select
                          value={idea.statut_id}
                          onChange={async (e) => {
                            const newStatut = Number(e.target.value);
                            await authFetch(
                              `${import.meta.env.VITE_API_URL}/api/ideas/${idea.id}`,
                              {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  title: idea.title,
                                  description: idea.description,
                                  deadline: idea.deadline,
                                  statut_id: newStatut,
                                  justification:
                                    "Changement de statut via l'historique",
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
