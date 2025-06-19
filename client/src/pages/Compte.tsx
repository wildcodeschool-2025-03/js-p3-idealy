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
  const currentUserId = 4;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/${currentUserId}`)
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, []);

  const handleSaveProfile = async (updatedData: UserInterface) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${currentUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );
      if (response.ok) {
        const updatedUser = await response.json();

        if (updatedData.service) {
          updatedUser.service = updatedData.service;
        }

        const fullUserResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${currentUserId}`,
        );
        const fullUserData = await fullUserResponse.json();

        const serviceResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${currentUserId}/service`,
        );
        const serviceData = await serviceResponse.json();

        setUserData({
          ...fullUserData,
          service: serviceData.service_name,
        });

        setIsEditModalOpen(false);
        console.log("Modifications enregistrées");
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
