interface SoumissionFeedbackProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const SoumissionFeedback = ({
  type,
  message,
  onClose,
}: SoumissionFeedbackProps) => {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center space-y-4">
        <h2
          className={`text-xl font-bold ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSuccess ? "Félicitations !" : "Une erreur technique est survenue"}
        </h2>
        <p className="text-gray-700">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2 rounded text-white font-semibold ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isSuccess ? "Retour à l'accueil" : "Fermer"}
        </button>
      </div>
    </div>
  );
};

export default SoumissionFeedback;
