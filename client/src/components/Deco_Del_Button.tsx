import { useState } from "react";
import { useLogin } from "../context/AuthContext";

function DecoDelButton() {
  const { logout, deleteAccount } = useLogin();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (error) {
      alert("Erreur lors de la suppression");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="md:flex gap-4 justify-center md:mt-8">
        <button
          onClick={logout}
          className="bg-yellowButton rounded-3xl px-8 py-1 cursor-pointer mt-4 hover:scale-99"
          type="button"
        >
          Deconnexion
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-redButton rounded-3xl px-8 py-1 cursor-pointer mt-4 hover:scale-99"
          type="button"
        >
          Supprimer le compte
        </button>
      </div>

      {/* MODALE DE CONFIRMATION */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer votre compte ?
            </p>

            <div className="flex gap-3">
              {/* BOUTON OUI */}
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-redButton px-4 py-2 rounded-3xl cursor-pointer"
              >
                {isDeleting ? "Suppression..." : "Oui, supprimer"}
              </button>

              {/* BOUTON NON */}
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-300 px-4 py-2 rounded-3xl cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DecoDelButton;
