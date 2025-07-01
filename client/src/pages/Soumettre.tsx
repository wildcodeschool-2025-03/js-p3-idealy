// client/src/pages/Soumettre.tsx

import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import TextEditor from "../components/TextEditor";
import DeadlineModal from "../components/ui/DeadlineModal";
import PieceJointeButton from "../components/ui/PieceJointeButton";
import SoumissionFeedback from "../components/ui/SoumissionFeedback";
import { categoryColors } from "../constants/categoryColors";
import { useLogin } from "../context/AuthContext";
import { authFetch } from "../utils/authFetch";

type Category = { id: number; category: string };
type Participant = { id: number; firstname: string; lastname: string };

const Soumettre = () => {
  const { user } = useLogin();
  const excludedIds = [1, user?.id].filter(Boolean);
  const navigate = useNavigate();
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [deadlineDates, setDeadlineDates] = useState<{
    creation: string;
    comment: string;
    vote: string;
    decision: string;
  } | null>(null);
  const [participantDropdownOpen, setParticipantDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const participantDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<number[]>([]);
  const [participants, setParticipants] = useState<number[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [participantOptions, setParticipantOptions] = useState<Participant[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        participantDropdownRef.current &&
        !participantDropdownRef.current.contains(event.target as Node)
      ) {
        setParticipantDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategoryOptions(data));

    authFetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setParticipantOptions(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deadlineDates) {
      setFeedback({
        type: "error",
        message: "Les dates de deadline ne sont pas définies.",
      });
      return;
    }

    if (!user?.id) {
      setFeedback({
        type: "error",
        message: "Vous devez être connecté pour soumettre une idée.",
      });
      return;
    }

    const rawHtml = editorRef.current?.innerHTML.trim() || "";
    const description = DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
    });

    if (!description || description === "<br>") {
      setFeedback({
        type: "error",
        message: "La description ne peut pas être vide.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("deadline", deadlineDates.decision);
    formData.append("timestamp", deadlineDates.creation);
    formData.append("statut_id", "1");
    formData.append("creator_id", String(user.id));

    for (const file of files) {
      formData.append("files", file);
    }

    for (const catId of categories) {
      formData.append("categories", String(catId));
    }

    for (const participantId of participants) {
      formData.append("participants", String(participantId));
    }

    try {
      setIsLoading(true);
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/ideas`, {
        method: "POST",
        body: formData,
      });
      setIsLoading(false);

      if (res.ok) {
        setTitle("");
        setFiles([]);
        setCategories([]);
        setParticipants([]);
        setDeadlineDates(null);
        if (editorRef.current) editorRef.current.innerHTML = "";
        setFeedback({
          type: "success",
          message: "Votre idée a été soumise avec succès.",
        });
      } else {
        setFeedback({
          type: "error",
          message: "Veuillez réessayer plus tard.",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Erreur de soumission :", error);
      setFeedback({
        type: "error",
        message: "Veuillez réessayer plus tard.",
      });
    }
  };

  if (feedback) {
    return (
      <SoumissionFeedback
        type={feedback.type}
        message={feedback.message}
        onClose={() => {
          if (feedback.type === "success") {
            navigate("/principal");
          } else {
            setFeedback(null);
          }
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellowButton border-t-transparent" />
        <p className="mt-4 text-lg font-medium">Envoi en cours...</p>
      </div>
    );
  }

  return (
    <div className="bg-greyBackground pt-10 pb-10">
      <h1 className="flex justify-center text-center text-2xl font-bold">
        Partagez vos idées
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mt-8"
        encType="multipart/form-data"
      >
        <div className="flex flex-col items-center gap-6 bg-card border p-4 rounded-lg shadow-lg md:w-1/2 mx-1.5 md:mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Sélecteur de participants */}
            <div className="relative w-full" ref={participantDropdownRef}>
              <button
                type="button"
                onClick={() => setParticipantDropdownOpen((prev) => !prev)}
                className="border rounded w-full bg-card text-left h-[50px] px-2"
              >
                {participants.length > 0
                  ? `${participants.length} participant(s)`
                  : "Ajoutez un participant"}
              </button>

              {participantDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-card border rounded shadow-lg max-h-60 overflow-auto">
                  {participantOptions
                    .filter((p) => !excludedIds.includes(p.id))
                    .map((p) => (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={participants.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setParticipants((prev) => [...prev, p.id]);
                            } else {
                              setParticipants((prev) =>
                                prev.filter((id) => id !== p.id),
                              );
                            }
                          }}
                        />
                        {p.firstname} {p.lastname}
                      </label>
                    ))}
                </div>
              )}

              {/* Badges des participants sélectionnés */}
              {participants.length > 0 && (
                <div className="flex flex-row flex-wrap w-full gap-2 mt-2">
                  {participants.map((id) => {
                    const user = participantOptions.find((p) => p.id === id);
                    if (!user) return null;

                    const handleRemove = () => {
                      setParticipants((prev) =>
                        prev.filter((pid) => pid !== id),
                      );
                    };

                    return (
                      <span
                        key={id}
                        className="flex items-center bg-yellowButton text-black px-3 py-1 rounded-full text-sm"
                      >
                        {user.firstname} {user.lastname}
                        <button
                          type="button"
                          onClick={handleRemove}
                          className="ml-2 text-black hover:text-red-600 font-bold"
                          aria-label={`Retirer ${user.firstname} ${user.lastname}`}
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Input Titre */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'idée"
              className="placeholder-black border rounded w-full h-[50px] px-2"
              required
            />

            {/* Select Catégorie */}
            <div className="relative w-full" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                className="border rounded w-full bg-card text-left h-[50px] px-2"
              >
                {categories.length > 0
                  ? `${categories.length} catégorie(s)`
                  : "Catégories"}
              </button>

              {categoryDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-card border rounded shadow-lg max-h-60 overflow-auto">
                  {categoryOptions.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={categories.includes(c.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCategories((prev) => [...prev, c.id]);
                          } else {
                            setCategories((prev) =>
                              prev.filter((id) => id !== c.id),
                            );
                          }
                        }}
                      />
                      {c.category}
                    </label>
                  ))}
                </div>
              )}

              {/* Badges des catégories sélectionnées */}
              {categories.length > 0 && (
                <div className="flex flex-row flex-wrap w-full gap-2 mt-2">
                  {categories.map((id) => {
                    const category = categoryOptions.find((c) => c.id === id);
                    if (!category) return null;

                    const handleRemove = () => {
                      setCategories((prev) => prev.filter((cid) => cid !== id));
                    };

                    const bgColor =
                      categoryColors[category.category] || "bg-gray-200";

                    return (
                      <span
                        key={id}
                        className={`flex items-center ${bgColor} text-black px-3 py-1 rounded-full text-sm`}
                      >
                        {category.category}
                        <button
                          type="button"
                          onClick={handleRemove}
                          className="ml-2 text-black hover:text-red-600 font-bold"
                          aria-label={`Retirer ${category.category}`}
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Description + PJ */}
          <div className="flex flex-col w-11/12 md:w-1/2 lg:w-1/3 gap-2">
            <TextEditor ref={editorRef} />
            <PieceJointeButton
              multiple
              onChange={(e) => {
                const newFiles = Array.from(e.target.files ?? []);
                setFiles((prev) => [...prev, ...newFiles]);
              }}
              onDropFiles={(droppedFiles) => {
                setFiles((prev) => {
                  const existingNames = new Set(prev.map((file) => file.name));
                  const uniqueNewFiles = droppedFiles.filter(
                    (file) => !existingNames.has(file.name),
                  );
                  return [...prev, ...uniqueNewFiles];
                });
              }}
            />

            {/* Affichage des fichiers sélectionnés */}
            <div className="mt-2 space-y-1">
              {files.map((file, index) => (
                <div
                  key={file.name}
                  className="flex justify-between items-center border rounded px-2 py-1 bg-card text-sm"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="text-red-600 font-bold hover:text-red-800"
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informations */}
        <div className=" bg-card p-4 mx-auto border rounded shadow w-11/12 md:w-1/2 lg:w-1/3 gap-2">
          <h2 className="text-red-600 font-extrabold text-lg mb-2">
            ⚠️ Avant de soumettre votre idée, lisez attentivement :
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              Les champs <strong>Titre</strong>, <strong>Description</strong> et{" "}
              <strong>Catégorie</strong> sont obligatoires.
            </li>
            <li>
              Vous pouvez ajouter des <strong>participants</strong> à votre
              idée.
            </li>
            <li>
              La pièce jointe est <strong>facultative</strong>.
            </li>
            <li className="text-red-500 font-semibold">
              ⚠️ Attention : La soumission d'une idée est{" "}
              <strong>définitive</strong> et ne peut pas être modifiée par la
              suite.
            </li>
            <li className="text-red-500 font-semibold">
              🔒 Important : Assurez-vous que votre idée respecte les{" "}
              <strong>règles de la communauté</strong> avant de la soumettre.
            </li>
            <li className="text-red-500 font-semibold">
              📝 Note : La soumission d'une idée ne garantit pas son{" "}
              <strong>acceptation</strong> ou sa <strong>publication</strong>.
            </li>
            <li className="text-red-500 font-semibold">
              🚫 Avertissement : Toute idée soumise peut être{" "}
              <strong>examinée</strong> par les modérateurs et{" "}
              <strong>rejetée</strong> si elle ne respecte pas les règles de la
              communauté.
            </li>
          </ul>
        </div>

        {/* Bouton deadline + Bouton de soumission */}
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-redButton px-4 py-2 rounded mr-4"
            onClick={() => setIsDeadlineModalOpen(true)}
          >
            Deadline prise de décision
          </button>
          <DeadlineModal
            isOpen={isDeadlineModalOpen}
            onClose={() => setIsDeadlineModalOpen(false)}
            onSubmit={(dates) => {
              setDeadlineDates(dates);
              setIsDeadlineModalOpen(false);
            }}
          />
          <button type="submit" className="bg-yellowButton px-4 py-2 rounded">
            Soumettre
          </button>
        </div>
        {deadlineDates && (
          <div className=" text-sm text-gray-700 text-center mt-2">
            <p>
              🟠 <strong>Commentaire :</strong>{" "}
              {new Date(deadlineDates.comment).toLocaleDateString()}
            </p>
            <p>
              🟢 <strong>Vote :</strong>{" "}
              {new Date(deadlineDates.vote).toLocaleDateString()}
            </p>
            <p>
              ⚪ <strong>Prise de décision :</strong>{" "}
              {new Date(deadlineDates.decision).toLocaleDateString()}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Soumettre;
