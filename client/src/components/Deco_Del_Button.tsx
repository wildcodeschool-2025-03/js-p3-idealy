import { useLogin } from "../context/AuthContext";

function DecoDelButton() {
  const { logout } = useLogin();

  return (
    <>
      <button
        onClick={logout}
        className="bg-yellowButton rounded-3xl px-15 mt-8"
        type="button"
      >
        Deconnexion
      </button>
      <button className="bg-redButton rounded-3xl px-8 mt-4" type="button">
        Supprimer le compte
      </button>
    </>
  );
}

export default DecoDelButton;
