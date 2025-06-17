// client/components/ui/PieceJointeButton.tsx
// Composant pour le bouton de pièce jointe

const PieceJointeButton = ({
  onChange,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer border rounded-lg px-4 py-2 hover:bg-gray-200 transition">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-6"
        role="img"
        aria-label="Icône de pièce jointe"
      >
        <title>Icône de pièce jointe</title>
        <path d="M20 4v50a12 12 0 0 0 24 0V18a8 8 0 0 0 -16 0v36" />
      </svg>

      <span className="text-center">Pièce jointe</span>
      <input type="file" className="hidden" onChange={onChange} />
    </label>
  );
};

export default PieceJointeButton;
