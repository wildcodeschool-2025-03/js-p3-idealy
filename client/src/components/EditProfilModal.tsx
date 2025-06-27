import { useEffect, useState } from "react";
import type { User } from "../context/AuthContext";

interface serviceInterface {
  id: number;
  statut: string;
}

interface EditProfilModalInterface {
  userData: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: User) => void;
}

function EditProfilModal({
  userData,
  isOpen,
  onClose,
  onSave,
}: EditProfilModalInterface) {
  const [formData, setFormData] = useState({
    id: userData?.id || 0,
    firstname: userData?.firstname || "",
    lastname: userData?.lastname || "",
    mail: userData?.mail || "",
    service: userData?.service || "",
    picture: userData?.picture || "",
    password: "",
  });

  const [services, setServices] = useState<serviceInterface[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && userData && services.length > 0) {
      const userService = services.find((s) => s.id === userData.service_id);

      setFormData({
        id: userData.id,
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        mail: userData.mail || "",
        service: userService ? userService.statut : "",
        picture: userData.picture || "",
        password: "",
      });
    }
  }, [isOpen, userData, services]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${import.meta.env.VITE_API_URL}/api/services`)
        .then((response) => response.json())
        .then((data) => {
          setServices(data);
        })
        .catch((error) => console.error("Erreur:", error));
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload de la photo si une nouvelle a été sélectionnée (JSON = que textes / nombres donc FormData pour fichier)
    if (selectedFile) {
      const fileFormData = new FormData(); // crée un conteneur - FormData car JSON ne prend pas les types files
      fileFormData.append("picture", selectedFile); // remplis le conteneur avec "picture" + fichier

      await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userData.id}/picture`,
        {
          method: "PATCH", // Pas de PUT car modification uniquement de la photo
          body: fileFormData,
        },
      );
    }

    // Récuperation de l'ID du service sélectionné
    const selectedService = services.find((s) => s.statut === formData.service); // cherche le service selectionné pour recupérer l'ID

    const dataToSave = {
      id: formData.id,
      firstname: formData.firstname,
      lastname: formData.lastname,
      mail: formData.mail,
      // Utilise l'ID du nouveau service ou garde l'ancien si pas trouvé
      service_id: selectedService ? selectedService.id : userData.service_id,
      service: formData.service,
      picture: userData.picture,
      isAdmin: userData.isAdmin,
    };

    onSave(dataToSave); // envoie les données au composant parent = Compte.tsx
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-blackBackground bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 relative">
          <button
            type="button"
            onClick={onClose}
            className="text-blackBackground absolute top-6 right-6"
            aria-label="Fermer"
          >
            X
          </button>
          <h2 className="text-xl font-bold mb-8">Modifier mes informations</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="picture"
                className="block text-sm font-medium mb-1"
              >
                Photo de profil
              </label>
              <input
                type="file"
                id="picture"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Fichier sélectionné : {selectedFile.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium mb-1"
              >
                Prénom
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block text-sm font-medium mb-1"
              >
                Nom
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="mail" className="block text-sm font-medium mb-1">
                Adresse email
              </label>
              <input
                type="email"
                id="mail"
                name="mail"
                value={formData.mail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                placeholder="Mot de passe"
              />
            </div>
            <div>
              <label
                htmlFor="service"
                className="block text-sm font-medium mb-1"
              >
                Service
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisir un service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.statut}>
                    {service.statut}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 border-2 rounded-3xl bg-greenButton shadow-lg"
              >
                Enregistrer
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border-2 rounded-3xl bg-redButton shadow-lg"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfilModal;
