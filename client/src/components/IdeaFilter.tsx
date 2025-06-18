import { useEffect, useRef, useState } from "react";

interface IdeaFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (selected: string[]) => void;
  selectedStatut: number[];
  onStatutChange: (selected: number[]) => void;
  selectedDeadline: string[];
  onDeadlineChange: (selected: string[]) => void;
}

const statutOptions = [
  { id: 1, label: "En cours" },
  { id: 2, label: "Validé" },
  { id: 3, label: "Refusé" },
];

const deadlineOptions = [
  { value: "week", label: "Semaine dernière" },
  { value: "month", label: "Mois dernier" },
  { value: "year", label: "Année dernière" },
];

function IdeaFilter({
  categories,
  selectedCategories,
  onCategoryChange,
  selectedStatut,
  onStatutChange,
  selectedDeadline,
  onDeadlineChange,
}: IdeaFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fonction pour gérer le changement de sélection des cases à cocher pour les catégories (+ renvoie l'info au parent pour modif du state)
  const handleCategoryCheckboxChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  // Fonction pour gérer le changement de sélection des cases à cocher pour les status (+ renvoie l'info au parent pour modif du state)
  const handleStatusCheckboxChange = (statut: number) => {
    if (selectedStatut.includes(statut)) {
      onStatutChange(selectedStatut.filter((s: number) => s !== statut));
    } else {
      onStatutChange([...selectedStatut, statut]);
    }
  };

  // Fonction pour gérer le changement de sélection des cases à cocher pour les deadline (+ renvoie l'info au parent pour modif du state)
  const handleDeadlineCheckboxChange = (deadline: string) => {
    if (selectedDeadline.includes(deadline)) {
      onDeadlineChange(selectedDeadline.filter((d: string) => d !== deadline));
    } else {
      onDeadlineChange([...selectedDeadline, deadline]);
    }
  };

  return (
    <section className="relative inline-block" ref={ref}>
      <button
        type="button"
        className="bg-white rounded-3xl w-10 py-2 md:w-30 shadow-md"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="hidden md:inline"> Filtrer </span>{" "}
        <i className="bi bi-funnel" />
      </button>

      {/* Modale menu déroulant */}
      {open && (
        <div className="absolute md:-left-1/2 -right-0 mt-[8px] w-60 bg-white rounded-3xl shadow-md z-10 p-4 overflow-hidden">
          <div>
            <p className="font-semibold mb-1">Catégorie</p>

            {/* Filtre des catégories des idées */}
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 px-2 py-1 rounded-3xl hover:bg-blackBackground hover:text-white cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryCheckboxChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
          <div className="mt-3">
            <p className="font-semibold mb-1">Statut</p>

            {/* Filtre des status des idées */}
            {statutOptions.map((statut) => (
              <label
                key={statut.id}
                className="flex items-center gap-2 px-2 py-1 rounded-3xl hover:bg-blackBackground hover:text-white cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStatut.includes(statut.id)}
                  onChange={() => handleStatusCheckboxChange(statut.id)}
                />
                {statut.label}
              </label>
            ))}
          </div>
          <div className="mt-3">
            <p className="font-semibold mb-1">Echéance</p>

            {/* Filtre des deadlines des idées */}
            {deadlineOptions.map((deadline) => (
              <label
                key={deadline.value}
                className="flex items-center gap-2 px-2 py-1 rounded-3xl hover:bg-blackBackground hover:text-white cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedDeadline.includes(deadline.value)}
                  onChange={() => handleDeadlineCheckboxChange(deadline.value)}
                />
                {deadline.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default IdeaFilter;
