// client/src/components/ui/SoumissionFeedback.tsx

interface SoumissionFeedbackProps {
  type: "confirm" | "success" | "error";
  message: string;
  onClose: () => void;
  onConfirm?: () => void; // utilisé uniquement si type === "confirm"
}

const SoumissionFeedback = ({
  type,
  message,
  onClose,
  onConfirm,
}: SoumissionFeedbackProps) => {
  const isConfirm = type === "confirm";
  const isSuccess = type === "success";
  const isError = type === "error";

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-3xl shadow-md p-6 w-[90%] max-w-xl text-left space-y-6 overflow-y-auto max-h-[90vh]">
        <h2
          className={`text-xl font-bold text-center ${
            isConfirm
              ? "text-yellow-600"
              : isSuccess
                ? "text-green-600"
                : "text-red-600"
          }`}
        >
          {isConfirm && "⚠️ Avant de soumettre votre idée"}
          {isSuccess && "✅ Idée soumise avec succès"}
          {isError && "❌ Une erreur est survenue"}
        </h2>

        <p className="text-gray-700 text-center">{message}</p>

        {isConfirm && (
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-800">
            <li>
              Les champs Titre, Description, Catégorie et Deadline sont
              obligatoires.
            </li>
            <li>
              La soumission est définitive et ne pourra pas être modifiée.
            </li>
            <li>
              Assurez-vous que votre idée respecte les règles de la communauté.
            </li>
          </ul>
        )}

        <div className="flex justify-center gap-4">
          {isConfirm ? (
            <>
              <button
                type="button"
                onClick={onClose}
                aria-label="Revenir à la soumission"
                className="bg-redButton px-6 py-2 text-xl md:text-2xl rounded-full hover:bg-red-600 cursor-pointer"
              >
                Revenir
              </button>
              <button
                type="button"
                onClick={onConfirm}
                aria-label="Soumettre définitivement"
                className="px-6 py-2 text-xl md:text-2xl rounded-full bg-yellowButton hover:bg-yellow-300 cursor-pointer"
              >
                Soumettre définitivement
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la fenêtre"
              className={`px-6 py-2 text-xl md:text-2xl rounded-full ${
                isSuccess
                  ? "bg-greenBUtton hover:bg-green-600"
                  : "bg-redButton hover:bg-red-600"
              }`}
            >
              {isSuccess ? "Retour à l'accueil" : "Fermer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoumissionFeedback;
