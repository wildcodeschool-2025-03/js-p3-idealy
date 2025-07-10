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
      <div className="max-w-lg mx-auto p-12 bg-white shadow-md rounded-3xl">
        <div className="mb-8 md:flex md:justify-between md:items-center">
          <p className="font-bold">Prénom</p>
          <p>{dataUser.firstname}</p>
        </div>

        <div className="mb-8 md:flex md:justify-between md:items-center">
          <p className="font-bold">Nom</p>
          <p>{dataUser.lastname}</p>
        </div>

        <div className="mb-8 md:flex md:justify-between md:items-center">
          <p className="font-bold">Adresse mail</p>
          <p>{dataUser.mail}</p>
        </div>

        <div className="mb-8 md:flex md:justify-between md:items-center">
          <p className="font-bold">Service</p>
          <p>{dataUser.service}</p>
        </div>

        <button
          className="bg-greyBackground rounded-3xl px-4 p-1 mt-4 shadow-md border-2 cursor-pointer w-full hover:scale-99"
          type="button"
          onClick={onEditClick}
        >
          Modifier mes informations
        </button>
      </div>{" "}
    </>
  );
}

export default PersonalInfo;
