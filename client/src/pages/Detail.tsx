// client/src/pages/Detail.tsx

import { useParams } from "react-router";

function Detail() {
  const { id } = useParams<{ id: string }>();
  return (
    <h1 className=" text-center text-2xl font-bold">
      {" "}
      Détails de l'idée {id}{" "}
    </h1>
  );
}

export default Detail;
