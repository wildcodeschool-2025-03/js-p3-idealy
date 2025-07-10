import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import DecoDelButton from "../components/Deco_Del_Button";
import EditProfilModal from "../components/EditProfilModal";
import PersonalInfo from "../components/PersonalInfo";
import { type User, useLogin } from "../context/AuthContext";
import { authFetch } from "../utils/authFetch";
import "react-toastify/dist/ReactToastify.css";

function Compte() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { user, isAuthenticated, isLoading, refreshUser } = useLogin(); // user recupere l'id / isAuthenticated verifie si quelqu'un est connecté / logout pour la deconnexion
  const navigate = useNavigate();

  // Si pas connecté redirige vers /
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      navigate("/");
    }
  }, [isAuthenticated, user, isLoading, navigate]); // dépendance se déclenche quand la connexion change

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Envoi les données modifiées au backend / Recharge les données
  const handleSaveProfile = async (updatedData: User) => {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user?.id}`,
        {
          method: "PUT", // PUT = modifie quelque chose qui existe deja
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      if (response.ok) {
        // Recharge automatiquement toutes les données utilisateur
        await refreshUser(); // on attend que le refresh soit fini
        setIsEditModalOpen(false); // puis on ferme la modale
        toast.success("Modifications enregistrées !");
      }
    } catch (error) {
      toast.error("Erreur lors de la modification du profil");
    }
  };

  return (
    <div className="p-8 bg-greyBackground text-center md:min-h-[calc(100vh-200px)]">
      <div className="inline-block text-2xl bg-greenButton rounded-3xl px-8 mb-8 mt-6">
        Infos personnelles
      </div>
      {user ? (
        <>
          <PersonalInfo
            user={user}
            onEditClick={() => setIsEditModalOpen(true)}
          />
          <EditProfilModal
            userData={user}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(data: User) => handleSaveProfile(data)}
          />
        </>
      ) : (
        <p>Chargement...</p>
      )}
      <DecoDelButton />
    </div>
  );
}

export default Compte;
