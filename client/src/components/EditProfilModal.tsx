import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { User } from "../context/AuthContext";
import { authFetch } from "../utils/authFetch";
import { validateEmail } from "../utils/validateEmail";

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
  const [showPassword, setShowPassword] = useState(false);

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
      authFetch(`${import.meta.env.VITE_API_URL}/api/services`)
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

    const emailValidation = validateEmail(formData.mail);
    if (!emailValidation.valid) {
      toast.error(emailValidation.error);
      return;
    }

    // Upload de la photo si une nouvelle a été sélectionnée (JSON = que textes / nombres donc FormData pour fichier)
    if (selectedFile) {
      const fileFormData = new FormData(); // crée un conteneur - FormData car JSON ne prend pas les types files
      fileFormData.append("picture", selectedFile); // remplis le conteneur avec "picture" + fichier

      await authFetch(
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
      ...(formData.password && { password: formData.password }), //Ajoute la propriété password à l'objet uniquement si formData.password n'est pas vide
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
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 relative">
          <button
            type="button"
            onClick={onClose}
            className="text-blackBackground absolute top-6 right-6 cursor-pointer"
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
                Mot de passe à modifier
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/4 cursor-pointer"
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash" />
                  ) : (
                    <i className="bi bi-eye" />
                  )}
                </button>
              </div>
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
                className="flex-1 px-4 py-2 rounded-3xl bg-greenButton shadow-md cursor-pointer hover:scale-99"
              >
                Enregistrer
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-3xl bg-redButton shadow-md cursor-pointer hover:scale-99"
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
