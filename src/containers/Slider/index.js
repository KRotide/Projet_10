import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc =
    data?.focus && Array.isArray(data.focus) // Ajout d'une vérification supplémentaire pour savoir si data.focus est un tableau
      ? data.focus.sort((evtA, evtB) =>
          new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
        )
      : [];
  const nextCard = () => {
    if (byDateDesc) {
      // Condition ajoutée pour que le Slider fonctionne uniquement si les données sont récupérées
      setIndex(index < byDateDesc.length - 1 ? index + 1 : 0); // Ajout de "- 1" à l'index pour ne pas avoir un state de transition
    }
  };
  useEffect(() => {
    const timer = setTimeout(nextCard, 5000);
    return () => clearTimeout(timer); // Nettoyage du timer lorsque l'index change
  }, [nextCard]); // Lien avec la fonction nextCard pour que lorsqu'un changement est effectué, le code de useEffect s'exécute
  const handleRadioChange = (newIndex) => {
    // L'index est mis à jour lorsqu'un utilisateur clic sur un bullet point
    setIndex(newIndex);
  };
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div
          key={event.title}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div> // Séparation des 2 boucles cartes d'événements et bullet points pour rendre ces derniers fonctionnels
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map(
            // Ajout de l'opérateur d'accès conditionnel "?" pour vérifier si les données sont récupérées
            (
              event, // Remplacement de l'underscore par event pour l'utiliser dans key
              radioIdx
            ) => (
              <input
                key={event.title} // Ajout de la même key que celle des cartes d'événements pour éviter les doublons (?!)
                type="radio"
                name="radio-button"
                checked={index === radioIdx}
                onChange={() => handleRadioChange(radioIdx)} // Utilisation de l'événement onChange pour rendre intéractifs les bullet points et éviter le message d'erreur lié au checked précédent
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider;
