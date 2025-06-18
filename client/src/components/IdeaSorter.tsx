import { useEffect, useRef, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Ferme le menu si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        className="bg-white rounded-3xl py-2 md:w-30 w-10 shadow-md"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="hidden md:inline">Trier par</span>{" "}
        <i className="bi bi-sort-down" />
      </button>
      {open && (
        <div className="absolute md:-left-7/20 -right-0 w-60 bg-white rounded-3xl shadow-md z-10 mt-[8px] py-2">
          {sortingOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`block w-5/6 text-right md:text-center mx-auto px-4 py-1 my-2 rounded-3xl hover:bg-blackBackground hover:text-white ${
                selectedSorting === option.value ? "font-bold" : ""
              }`}
              onClick={() => {
                onSortingChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default IdeaSorter;
