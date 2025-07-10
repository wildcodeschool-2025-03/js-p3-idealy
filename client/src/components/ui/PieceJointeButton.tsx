// client/components/ui/PieceJointeButton.tsx

import { useCallback } from "react";

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDropFiles: (files: File[]) => void;
  multiple?: boolean;
};

const PieceJointeButton = ({
  onChange,
  onDropFiles,
  multiple = false,
}: Props) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFiles = Array.from(e.dataTransfer.files);
      onDropFiles(droppedFiles);
    },
    [onDropFiles],
  );

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed rounded-3xl shadow-md px-4 py-6 hover:bg-gray-100 transition text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
        role="img"
        aria-label="Icône de pièce jointe"
      >
        <title>Icône de pièce jointe</title>
        <path d="M20 4v50a12 12 0 0 0 24 0V18a8 8 0 0 0 -16 0v36" />
      </svg>

      <span className="text-sm">Cliquez ou déposez vos fichiers ici</span>

      <input
        type="file"
        accept="image/png,image/jpeg,application/pdf"
        className="hidden"
        onChange={onChange}
        multiple={multiple}
        aria-label="Sélectionner des fichiers"
      />
    </label>
  );
};

export default PieceJointeButton;
