import { useEffect, useState } from "react";
import DecoDelButton from "../components/Deco_Del_Button";
import EditProfilModal from "../components/EditProfilModal";
import PersonalInfo from "../components/PersonalInfo";
// client/src/pages/Compte.tsx

export interface UserInterface {
  service_id: number;
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  service: string;
  picture?: string;
  password?: string;
}

function Compte() {
  const [userData, setUserData] = useState<UserInterface>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const currentUserId = 2;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/${currentUserId}`)
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, []);

  // Envoi / récupère / affiche
  const handleSaveProfile = async (updatedData: UserInterface) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${currentUserId}`,
        {
          method: "PUT", // modification de plusieurs champs en une fois
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData), // convertit en string
        },
      );

      if (response.ok) {
        // Forcer le rechargement avec un timestamp pour éviter le cache
        const timestamp = new Date().getTime();

        // requete 1 = recupère toutes les infos (firstname, lastname etc...)
        const updatedUserResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${currentUserId}?t=${timestamp}`,
        );
        const fullUserData = await updatedUserResponse.json(); // extrait les données de la réponse

        // requete 2 = recupère le nom depuis l'id récupéré dans la 1ere requete {service_name: "Sécurité"}
        const serviceResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${currentUserId}/service`,
        );
        const serviceData = await serviceResponse.json(); // extrait le nom du service

        // mise à jour des données + nom du service
        setUserData({
          ...fullUserData, // id, firstname, lastname etc...
          service: serviceData.service_name, // ajoute le nom du service
        });

        setIsEditModalOpen(false); // ferme la modale
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="p-8 bg-greyBackground text-center">
      <div className="inline-block text-2xl bg-greenButton rounded-3xl px-8 mb-8">
        Infos personnelles
      </div>
      {userData ? (
        <>
          <PersonalInfo
            user={userData}
            onEditClick={() => setIsEditModalOpen(true)}
          />
          <EditProfilModal
            userData={userData}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(data: UserInterface) => handleSaveProfile(data)}
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
