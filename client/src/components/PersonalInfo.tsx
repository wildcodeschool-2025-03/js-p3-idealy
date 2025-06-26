import { useEffect, useState } from "react";
import type { User } from "../context/AuthContext";

interface PersonalInfoProps {
  user: User;
  onEditClick: () => void;
}

function PersonalInfo({ user, onEditClick }: PersonalInfoProps) {
  const [dataUser, setDataUser] = useState<User>(user);

  useEffect(() => {
    setDataUser(user);
  }, [user]);

  return (
    <>
      <div className="text-center mb-6">
        <img
          className="rounded-full mx-auto mb-2 w-56 h-56 object-cover"
          src={
            dataUser.picture?.startsWith("http")
              ? dataUser.picture
              : `${import.meta.env.VITE_API_URL}${dataUser.picture}`
          }
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
