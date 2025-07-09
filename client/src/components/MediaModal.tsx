import { FiExternalLink, FiFile, FiImage, FiX } from "react-icons/fi";

interface Media {
  id: number;
  url: string;
  type: string;
  created_at: string;
}

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  medias: Media[];
}

function MediaModal({ isOpen, onClose, medias }: MediaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-300 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Fichiers joints ({medias.length})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xl hover:text-red-500 cursor-pointer"
          >
            <FiX />
          </button>
        </div>

        <div className="space-y-3">
          {medias.map((media) => (
            <div
              key={media.id}
              className="border rounded p-3 flex items-center gap-3"
            >
              {media.type === "image" ? (
                <FiImage className="text-2xl text-blue-500" />
              ) : (
                <FiFile className="text-2xl text-gray-600" />
              )}
              <div className="flex-1">
                <p className="font-medium">Fichier {media.type}</p>
                <p className="text-sm text-gray-500">
                  {new Date(media.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <a
                href={`${import.meta.env.VITE_API_URL}${media.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center gap-1"
              >
                <FiExternalLink className="text-sm" />
                Voir
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MediaModal;
