import { useState } from "react";
import { useLogin } from "../context/AuthContext";
import { authFetch } from "../utils/authFetch";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void; // void = ne prend aucun parametre et ne renvoi rien
  ideaId: number;
  onCommentAdded: () => void;
}

function CommentModal({
  isOpen,
  onClose,
  ideaId,
  onCommentAdded,
}: CommentModalProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // empeche le comportement par defaut du formulaire (rechargement de page)
    if (!comment.trim() || !user) return; // si commentaire vide ou pas d'utilisateur connecté = stop ici

    try {
      // dans le try = code qui peut echouer
      setIsSubmitting(true); // indique qu'on est en train de soumettre - le bouton devient "Envoi..." et disabled

      await authFetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          idea_id: ideaId,
          user_id: user.id,
        }),
      });

      setComment(""); // reset le formulaire
      onClose(); // ferme la modale
      onCommentAdded(); // appel le refresh
    } catch (error) {
      // si ca echoue on vient la
      console.error("Erreur lors de l'ajout du commentaire", error);
    } finally {
      // toujours executé peu importe ce qu'il y a eu = evite le blocage sur "Envoi" s'il y a une erreur
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Ajouter un commentaire</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Votre commentaire..."
            className="w-full border rounded p-2 mb-4"
            rows={4}
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-2xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-greenButton text-white rounded-2xl"
            >
              {isSubmitting ? "Envoi..." : "Publier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommentModal;
