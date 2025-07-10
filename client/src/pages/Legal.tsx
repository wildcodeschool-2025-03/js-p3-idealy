// client/src/pages/Legal.tsx

function Legal() {
  return (
    <section className="bg-greyBackground min-h-lvh py-6 md:pt-10">
      <section className="bg-card rounded-3xl max-w-full shadow-md py-4 px-4 md:px-20 md:py-10 md:w-2/3 m-auto space-y-4 mb-4 md:mb-8">
        <h1 className="text-xl md:text-2xl text-center mb-6 px-6 py-2 rounded-full w-58 m-auto bg-yellowButton ">
          Mentions légales
        </h1>

        <div>
          <h2 className="font-semibold">1. Éditeur du site</h2>
          <p>Nom du site : idealy</p>
          <p>Éditeur : Wild Code School</p>
          <p>Adresse : 44 Rue Alphonse Penaud, 75020 Paris</p>
          <p>Téléphone : 09 78 45 04 38</p>
          <p>Email : contact@wildcodeschool.com</p>
          <p>Directeur de la publication : Groupe 3 - Projet n°3</p>
        </div>

        <div>
          <h2 className="font-semibold">2. Hébergement</h2>
          <p>Hébergeur : Vercel</p>
          <p>
            Adresse : 440 N Barranca Avenue, Suite 4133, Covina,
            California 91723, États‑Unis
          </p>
          <p>Téléphone : +1 951‑383‑6898</p>
          <p>Site web : https://vercel.com/</p>
        </div>

        <div>
          <h2 className="font-semibold">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus présents sur le site idealy (textes, images,
            graphismes, logo, etc.) est protégé par le droit d’auteur et reste
            la propriété exclusive de Wild Code School, sauf mention contraire.
            Toute reproduction, représentation, diffusion ou exploitation,
            totale ou partielle, sans autorisation expresse est interdite.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">4. Données personnelles</h2>
          <p>
            Le site permet la création de comptes utilisateurs. À cette
            occasion, des données personnelles peuvent être collectées.
          </p>
          <p>
            <strong>Finalités de la collecte :</strong>
          </p>
          <ul className="list-disc list-inside">
            <li>Création et gestion de compte utilisateur</li>
            <li>Accès personnalisé à certaines fonctionnalités</li>
            <li>Support client</li>
          </ul>
          <p>
            <strong>Données collectées :</strong>
          </p>
          <ul className="list-disc list-inside">
            <li>Identifiants (email, mot de passe chiffré)</li>
            <li>Données saisies dans le profil utilisateur (si applicable)</li>
          </ul>
          <p>
            <strong>Base légale du traitement :</strong> Consentement de
            l'utilisateur et exécution d’un contrat.
          </p>
          <p>
            <strong>Responsable du traitement :</strong> Wild Code School
          </p>
          <p>
            <strong>Durée de conservation :</strong> Les données sont conservées
            tant que le compte est actif, puis supprimées sous 30 jours.
          </p>
          <p>
            <strong>Droits de l’utilisateur :</strong> Vous disposez d’un droit
            d’accès, de rectification, d’opposition, etc.
          </p>
          <p>Pour exercer ces droits : contact@wildcodeschool.com</p>
        </div>

        <div>
          <h2 className="font-semibold">5. Utilisation du local storage</h2>
          <p>
            Le site n’utilise pas de cookies. Cependant, il utilise le local
            storage du navigateur pour stocker temporairement certaines
            informations nécessaires au bon fonctionnement du site (ex.
            préférences, jetons de session côté client).
          </p>
          <p>
            Ces données ne sont pas transmises au serveur, ni utilisées à des
            fins de suivi publicitaire.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">6. Responsabilité</h2>
          <p>
            L’éditeur du site s’efforce d’assurer l’exactitude et la mise à jour
            des informations diffusées. Il ne saurait être tenu responsable
            d’éventuelles erreurs, omissions ou indisponibilités du site.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">7. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français.
            Tout litige relatif à l'utilisation du site sera soumis à la
            compétence exclusive des tribunaux français.
          </p>
        </div>
      </section>
    </section>
  );
}

export default Legal;
