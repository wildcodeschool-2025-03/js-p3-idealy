interface IdeaSorterProps {
  selectedSorting: string;
  onSortingChange: (sorting: string) => void;
}

const sortingOptions = [
  { value: "alpha", label: "Alphabétique" },
  { value: "chrono", label: "Chronologique" },
  { value: "most", label: "Les plus appréciées" },
  { value: "least", label: "Les moins appréciées" },
];

function IdeaSorter({ selectedSorting, onSortingChange }: IdeaSorterProps) {
  return (
    <section>
      <select
        id="sorting"
        value={selectedSorting}
        onChange={(e) => onSortingChange(e.target.value)}
      >
        <option value="" disabled>
          {" "}
          Trier par{" "}
        </option>
        {sortingOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </section>
  );
}

export default IdeaSorter;
