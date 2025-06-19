import { useEffect, useState } from "react";

interface UserInterface {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  service: string;
  picture?: string;
}

interface PersonalInfoProps {
  user: UserInterface;
  onEditClick: () => void;
}

function PersonalInfo({ user, onEditClick }: PersonalInfoProps) {
  const [dataUser, setDataUser] = useState<UserInterface>(user);

  useEffect(() => {
    setDataUser(user);
  }, [user]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}/service`)
      .then((response) => response.json())
      .then((data) => {
        setDataUser((prev) => ({
          ...prev,
          service: data.service_name,
        }));
      });
  }, [user.id]);

  return (
    <>
      <div className="text-center mb-6">
        <img
          className="rounded-full mx-auto mb-2"
          src={dataUser.picture}
          alt="Avatar utilisateur"
        />
      </div>
      <div className="max-w-sm mx-auto p-12 bg-white shadow-md rounded-3xl">
        <div className="mb-8">
          <p className=" font-bold">Prénom</p>
          <div className="flex justify-center relative items-center">
            <p>{dataUser.firstname}</p>
          </div>
        </div>
        <div className="mb-8">
          <p className=" font-bold">Nom</p>
          <div className="flex justify-center relative items-center">
            <p>{dataUser.lastname}</p>
          </div>
        </div>
        <div className="mb-8">
          <p className=" font-bold">Adresse mail</p>
          <div className="flex justify-center relative items-center">
            <p>{dataUser.mail}</p>
          </div>
        </div>
        <div className="mb-8">
          <p className=" font-bold">Service</p>
          <div className="flex justify-center relative items-center">
            <p>{dataUser.service}</p>
          </div>
        </div>
        <button
          className="bg-greyBackground rounded-3xl px-4 p-1 mt-4 shadow-md border-2"
          type="button"
          onClick={onEditClick}
        >
          Modifier mes informations
        </button>
      </div>
    </>
  );
}

export default PersonalInfo;
