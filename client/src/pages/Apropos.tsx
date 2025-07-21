import { MdFiberManualRecord } from "react-icons/md";
// client/src/pages/Apropos.tsx
import David from "../assets/images/David.png";
import Guillaume from "../assets/images/Guillaume.png";
import Maxime from "../assets/images/Maxime.png";
import Messica from "../assets/images/Messica.png";

function Apropos() {
  return (
    <div className="flex flex-col items-center pt-12 bg-greyBackground md:min-h-[calc(100vh-200px)]">
      <h2 className=" text-center text-2xl bg-yellowButton rounded-3xl w-60">
        Le projet
      </h2>

      <p className="leading-relaxed text-center mt-12 bg-white rounded-3xl py-4 px-4 shadow-2xl md:leading-8 md:px-12 md:max-w-4xl">
        Idealy transforme la façon dont les entreprises collectent et évaluent
        les idées de leurs équipes. <br />
        Notre plateforme collaborative permet à chacun de proposer des
        innovations, d'inviter des collaborateurs et de soumettre les projets au
        vote de l'entreprise. <br />
        Pourquoi Idealy : Nous croyons que les meilleures innovations naissent
        de la collaboration et que chaque voix compte dans le processus créatif
        de l'entreprise.
        <br /> Notre mission : démocratiser l'innovation en entreprise grâce à
        l'intelligence collective,
        <br />
        en donnant à tous les collaborateurs les outils pour contribuer
        activement à l'évolution de leur organisation, nous créons un
        environnement où l'innovation devient l'affaire de tous.
      </p>

      <h2 className=" text-center text-2xl bg-redButton rounded-3xl w-60 mt-12">
        L'equipe
      </h2>
      <div className="mt-12 space-y-12 text-center md:flex md:flex-row md:gap-24 md:mt-16 mb-10">
        <div>
          <a
            href="https://github.com/Daviddemarville"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={David} alt="David De Marville" />
            <h3 className="mt-2">David dM.</h3>
            <p className="flex items-center justify-center gap-1">
              <MdFiberManualRecord className="text-green-500 text-sm" />
              Développeur Web
            </p>
          </a>
        </div>
        <div>
          <a
            href="https://github.com/Guillaume-Z"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Guillaume} alt="Guillaume Zimberlin" />
            <h3 className="mt-2">Guillaume Z.</h3>
            <p className="flex items-center justify-center gap-1">
              <MdFiberManualRecord className="text-green-500 text-sm" />
              Développeur Web
            </p>
          </a>
        </div>
        <div>
          <a
            href="https://github.com/messicaa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Messica} alt="Messica Oualane" />
            <h3 className="mt-2">Messica O.</h3>
            <p className="flex items-center justify-center gap-1">
              <MdFiberManualRecord className="text-green-500 text-sm" />
              Développeuse Web
            </p>
          </a>
        </div>
        <div>
          <a
            href="https://github.com/giapolo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={Maxime} alt="Maxime Giampaoli" />
            <h3 className="mt-2">Maxime G.</h3>
            <p className="flex items-center justify-center gap-1">
              <MdFiberManualRecord className="text-green-500 text-sm" />
              Développeur Web
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Apropos;
