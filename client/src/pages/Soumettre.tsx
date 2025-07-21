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
import { validateFiles } from "../utils/validateFiles";

type Category = { id: number; category: string };
type Participant = { id: number; firstname: string; lastname: string };
type FeedbackType = "success" | "error" | "confirm";

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
  const [editorContent, setEditorContent] = useState<string>("votre texte ici");
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
    type: FeedbackType;
    message: string;
  } | null>(null);
  const [savedHtml, setSavedHtml] = useState<string>("");
  const [titleFocused, setTitleFocused] = useState(false);

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

    const rawHtml = editorContent.trim();
    setSavedHtml(rawHtml);
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

    if (categories.length === 0) {
      setFeedback({
        type: "error",
        message: "Vous devez sélectionner au moins une catégorie.",
      });
      return;
    }

    setFeedback({
      type: "confirm",
      message:
        "⚠️ Avant de soumettre votre idée, veuillez vérifier les champs obligatoires et relire les avertissements. Cette action est définitive.",
    });
  };

  const sendForm = async () => {
    if (!deadlineDates || !user?.id) return;

    const rawHtml = editorContent.trim();
    const description = DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
    });

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
        setEditorContent(""); // Vide l'éditeur
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
            if (savedHtml) {
              setEditorContent(savedHtml); // Restaure le texte dans l'éditeur
            }
          }
        }}
        onConfirm={
          feedback.type === "confirm"
            ? () => {
                setFeedback(null);
                sendForm();
              }
            : undefined
        }
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

  const handleFocus = () => {
    if (editorContent === "votre texte ici") {
      setEditorContent("");
    }
  };

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
        <div className="flex flex-col items-center gap-6 bg-card border p-4 rounded-3xl shadow-md md:w-1/2 mx-1.5 md:mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Sélecteur de participants */}
            <div className="relative w-full" ref={participantDropdownRef}>
              <button
                type="button"
                aria-label="Sélectionner des participants"
                onClick={() => setParticipantDropdownOpen((prev) => !prev)}
                className="border rounded-3xl shadow-md w-full bg-card text-center h-[50px] px-2 cursor-pointer"
              >
                {participants.length > 0
                  ? `${participants.length} participant(s)`
                  : "Ajoutez un participant"}
              </button>

              {participantDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-card border rounded-3xl shadow-md max-h-60 overflow-auto">
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
            <div className="w-full">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
                aria-label="Titre de l'idée"
                placeholder="Titre de l'idée"
                className="placeholder-black border rounded-3xl shadow-md text-center w-full h-[50px] px-2"
                required
              />
              {(titleFocused || (title.length > 0 && title.length < 3)) && (
                <p className="text-xs text-gray-600 mt-1">
                  Minimum 3 caractères requis.
                </p>
              )}
            </div>

            {/* Select Catégorie */}
            <div className="relative w-full" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                aria-label="Sélectionner une catégorie"
                className="border rounded-3xl shadow-md w-full bg-card text-center h-[50px] px-2 cursor-pointer"
              >
                {categories.length > 0
                  ? `${categories.length} catégorie(s)`
                  : "Catégories"}
              </button>

              {categoryDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-card border rounded-3xl shadow-md max-h-60 overflow-auto">
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
            <TextEditor
              ref={editorRef}
              value={editorContent}
              onChange={setEditorContent}
              onFocus={handleFocus}
              minLength={10}
              aria-label="Éditeur de texte pour la description de l'idée"
            />
            <PieceJointeButton
              multiple
              aria-label="Ajouter des fichiers"
              onChange={(e) => {
                const inputFiles = Array.from(e.target.files ?? []);
                const { validFiles, errors } = validateFiles(inputFiles);
                if (errors.length) alert(errors.join("\n"));
                setFiles((prev) => [...prev, ...validFiles]);
              }}
              onDropFiles={(droppedFiles) => {
                const { validFiles, errors } = validateFiles(droppedFiles);
                if (errors.length) alert(errors.join("\n"));
                setFiles((prev) => {
                  const existingNames = new Set(prev.map((file) => file.name));
                  const uniqueNewFiles = validFiles.filter(
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
                  className="flex justify-between items-center border rounded-3xl shadow-md text-center px-2 py-1 bg-card text-sm"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    aria-label="Supprimer le fichier"
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
        <div className=" bg-card p-4 mx-auto border rounded-3xl shadow-md w-11/12 md:w-1/2 lg:w-1/3 gap-2">
          <h2 className="text-red-600 font-extrabold text-lg mb-2">
            ⚠️ Avant de soumettre votre idée, lisez attentivement :
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              Les champs <strong>Titre</strong> (min.{" "}
              <strong>3 caractères</strong>), <strong>Description</strong> (min.{" "}
              <strong>10 caractères</strong>), <strong>Catégorie</strong> et{" "}
              <strong>Deadline</strong> sont obligatoires.
            </li>
            <li>
              📝 La description peut contenir du <strong>texte enrichi</strong>{" "}
              (gras, italique, liens, etc.).
            </li>
            <li>
              🕒 La date de <strong>deadline</strong> doit être définie avant la
              soumission, et doit être postérieure à la date de création de
              l'idée.
            </li>
            <li>
              Vous pouvez ajouter des <strong>participants</strong> à votre
              idée.
            </li>
            <li>
              La pièce jointe est <strong>facultative</strong>.
            </li>
            <li>
              📎 Fichiers autorisés : <strong>PDF, JPG, PNG</strong> (max. 5 Mo
              par fichier)
            </li>
            <li>
              ⚠️ <strong>Attention</strong> : La soumission d'une idée est{" "}
              <strong>définitive</strong> et ne peut pas être modifiée par la
              suite.
            </li>
            <li>
              🔒 <strong>Important</strong> : Assurez-vous que votre idée
              respecte les <strong>règles de la communauté</strong> avant de la
              soumettre.
            </li>
            <li>
              📝 <strong>Note</strong> : La soumission d'une idée ne garantit
              pas son <strong>acceptation</strong> ou sa{" "}
              <strong>publication</strong>.
            </li>
            <li>
              🚫 <strong>Avertissement</strong> : Toute idée soumise peut être{" "}
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
            aria-label="Ouvrir le modal de deadline"
            className="bg-redButton hover:bg-red-600 px-6 py-2 rounded-full mr-4 cursor-pointer"
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
          <button
            type="submit"
            aria-label="Soumettre l'idée"
            className="bg-yellowButton hover:bg-yellow-300 px-6 py-2 rounded-full cursor-pointer"
          >
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
