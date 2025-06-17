// client/src/pages/Soumettre.tsx

import { useEffect, useRef, useState } from "react";
import PieceJointeButton from "../components/ui/PieceJointeButton";

type Category = { id: number; category: string };
type Participant = { id: number; firstname: string; lastname: string };

const excludedIds = [1]; // IDs à ignorer

const Soumettre = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<number | "">("");
  const [participants, setParticipants] = useState<number[]>([]);

  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [participantOptions, setParticipantOptions] = useState<Participant[]>(
    [],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategoryOptions(data));

    fetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setParticipantOptions(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);
    if (categories !== "") {
      formData.append("categories", String(categories));
    }
    for (const pId of participants) {
      formData.append("participants", String(pId));
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Idée soumise avec succès !");
      setTitle("");
      setDescription("");
      setFile(null);
      setCategories("");
      setParticipants([]);
    } else {
      alert("Erreur lors de l'envoi");
    }
  };

  return (
    <div className="bg-greyBackground pt-5 pb-5 mt-10 mb-10">
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
            <div className="relative w-full" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="border rounded w-full bg-card text-left h-[40px] px-2"
              >
                {participants.length > 0
                  ? `${participants.length} participant(s)`
                  : "Ajoutez un participant"}
              </button>

              {dropdownOpen && (
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
              className="placeholder-black border rounded w-full h-[40px] px-2"
              required
            />

            {/* Select Catégorie */}
            <select
              value={String(categories)}
              onChange={(e) => setCategories(Number(e.target.value))}
              className="border rounded w-full h-[40px] px-2"
            >
              <option disabled value="">
                Catégorie
              </option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          {/* Description + PJ */}
          <div className="flex flex-col w-11/12 md:w-1/2 lg:w-1/3 gap-2">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'idée"
              className="h-[40vh] w-full text-center placeholder-black p-4 focus:outline-none"
              required
            />
            <PieceJointeButton
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {/* Informations */}
        <div className="bg-white p-4 mx-2 ld:mx-auto border rounded shadow">
          <h2 className="text-red-600 font-extrabold text-lg mb-2">
            ⚠️ Avant de soumettre votre idée, lisez attentivement :
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              Les champs <strong>Titre</strong> et <strong>Description</strong>{" "}
              sont obligatoires.
            </li>
            <li>
              Vous pouvez ajouter des <strong>participants</strong> et une{" "}
              <strong>catégorie</strong> à votre idée.
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
            onClick={() => alert("Fonctionnalité à venir !")}
          >
            Deadline prise de décision
          </button>
          <button type="submit" className="bg-yellowButton px-4 py-2 rounded">
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
};

export default Soumettre;
