import { useEffect, useRef, useState } from "react";

interface IdeaFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (selected: string[]) => void;
  selectedStatut: number[];
  onStatutChange: (selected: number[]) => void;
  selectedTimestamp: string[];
  onTimestampChange: (selected: string[]) => void;
}

const statutOptions = [
  { id: 1, label: "En cours" },
  { id: 2, label: "Validé" },
  { id: 3, label: "Refusé" },
];

const timestampOptions = [
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
  selectedTimestamp,
  onTimestampChange,
}: IdeaFilterProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Fermeture avec animation quand clic en dehors
        setVisible(false);
        setTimeout(() => setOpen(false), 300);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fonction pour gérer l’ouverture/fermeture avec animation
  const toggleDropdown = () => {
    if (!open) {
      setOpen(true);
      setTimeout(() => setVisible(true), 10); // attend le DOM
    } else {
      setVisible(false);
      setTimeout(() => setOpen(false), 300); // attend fin animation
    }
  };

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
  const handleTimestampCheckboxChange = (deadline: string) => {
    if (selectedTimestamp.includes(deadline)) {
      onTimestampChange(
        selectedTimestamp.filter((d: string) => d !== deadline),
      );
    } else {
      onTimestampChange([...selectedTimestamp, deadline]);
    }
  };

  return (
    <section className="relative inline-block" ref={ref}>
      <button
        type="button"
        className="bg-white rounded-3xl w-10 py-2 md:w-30 shadow-md"
        onClick={toggleDropdown}
      >
        <span className="hidden md:inline"> Filtrer </span>{" "}
        <i className="bi bi-funnel" />
      </button>

      {/* Modale menu déroulant */}
      {open && (
        <div
          className={`absolute md:-left-1/2 -right-0 w-60 bg-white rounded-3xl shadow-2xl z-10 mt-[8px] p-4 overflow-hidden transition-all duration-300 transform
            ${visible ? "md:translate-y-0 max-md:translate-x-0 opacity-100" : "md:translate-y-2 max-md:-translate-x-5 opacity-0"}`}
        >
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
            <p className="font-semibold mb-1">Date</p>

            {/* Filtre des deadlines des idées */}
            {timestampOptions.map((timestamp) => (
              <label
                key={timestamp.value}
                className="flex items-center gap-2 px-2 py-1 rounded-3xl hover:bg-blackBackground hover:text-white cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTimestamp.includes(timestamp.value)}
                  onChange={() =>
                    handleTimestampCheckboxChange(timestamp.value)
                  }
                />
                {timestamp.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default IdeaFilter;
