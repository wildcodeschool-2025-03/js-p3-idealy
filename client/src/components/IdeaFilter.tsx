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
    <section>
      {/* Affiche une liste de catégories d'idées, avec des cases à cocher pour filtrer les idées affichées */}
      <p>Catégorie</p>
      {categories.map((category) => (
        <label key={category} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={() => handleCategoryCheckboxChange(category)}
          />
          {category}
        </label>
      ))}

      {/* Affiche une liste de status, avec des cases à cocher pour filtrer les idées affichées */}
      <p>Statut</p>
      {statutOptions.map((statut) => (
        <label key={statut.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedStatut.includes(statut.id)}
            onChange={() => handleStatusCheckboxChange(statut.id)}
          />
          {statut.label}
        </label>
      ))}

      {/* Affiche une liste de cdeadlines, avec des cases à cocher pour filtrer les idées affichées */}
      <p>Deadline</p>
      {deadlineOptions.map((deadline) => (
        <label key={deadline.value} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedDeadline.includes(deadline.value)}
            onChange={() => handleDeadlineCheckboxChange(deadline.value)}
          />
          {deadline.label}
        </label>
      ))}
    </section>
  );
}

export default IdeaFilter;
