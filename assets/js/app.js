const groupes = document.querySelectorAll('.stars');
const groupeResultat = document.querySelector('.groupe__resultat');
const starsResultat = groupeResultat.querySelectorAll('.star__resultat');
const resultContainer = document.querySelector('.result__container');
const totalSpan = document.querySelector('#total');

// Définir le style "display: none" sur result__container par défaut
resultContainer.style.display = 'none';

groupes.forEach((groupe) => {
  const stars = groupe.querySelectorAll('.star');
  const overlays = groupe.querySelectorAll('.star-overlay');
  let selectedStars = new Array(stars.length).fill(false);

  overlays.forEach((overlay, index) => {
    overlay.addEventListener('mouseover', () => {
      const star = stars[index];
      star.classList.add('yellow', 'star--scale');

      if (index < 2) {
        stars.forEach((s, i) => i <= index ? s.classList.add('star--red') : s.classList.remove('star--red'));
      } else if (index < 4) {
        stars.forEach((s, i) => i <= index ? s.classList.add('star--orange') : s.classList.remove('star--red', 'star--orange'));
      } else {
        stars.forEach((s, i) => i <= index ? s.classList.add('star--green') : s.classList.remove('star--red', 'star--orange', 'star--green'));
      }
    });

    overlay.addEventListener('mouseout', () => {
      stars.forEach(star => star.classList.remove('yellow', 'star--red', 'star--orange', 'star--green', 'star--scale'));
    });

    overlay.addEventListener('click', () => {
      selectedStars.fill(false);
      for (let i = 0; i <= index; i++) {
        selectedStars[i] = true;
      }
      fillStars(stars, index);
      calculateAverage();

      if (index === 4) {
        stars.forEach((star) => {
          star.classList.add('star--bounce');
          star.addEventListener('animationend', () => {
            star.classList.remove('star--bounce');
            star.classList.add('no-scale');
          }, { once: true });
        });
      }
    });

    overlay.addEventListener('mouseover', () => {
      stars[index].classList.remove('no-scale');
    });

    overlay.addEventListener('mouseout', () => {
      stars[index].classList.remove('no-scale');
    });
  });

  groupe.addEventListener('mouseout', () => {
    const lastIndexTrue = selectedStars.lastIndexOf(true);
    fillStars(stars, lastIndexTrue >= 0 ? lastIndexTrue : -1);
  });
});

function calculateAverage() {
  let totalGroupAverage = 0;
  let totalGroups = 0;
  let resultCount = 0; // Variable pour compter les résultats

  groupes.forEach((groupe) => {
    const selectedStars = groupe.querySelectorAll('.yellow');

    if (selectedStars.length > 0) {
      totalGroups++;
      totalGroupAverage += selectedStars.length;
      resultCount++;
    }
  });

  const averageScore = totalGroups > 0 ? totalGroupAverage / totalGroups : 0;
  const roundedAverage = Math.round(averageScore * 4) / 4; // Arrondir au quart
  const fillPercentage = (roundedAverage / 5) * 100;

  starsResultat.forEach((etoile, index) => {
    const fillRect = etoile.querySelector('.fill'); // sélectionnez le rectangle de remplissage
    const starIndex = index + 1;

    // calculez la largeur du rectangle de remplissage en fonction du score moyen
    let fillWidth;
    if (roundedAverage >= starIndex) {
      fillWidth = 50; // supposons que la largeur totale est 50
    } else if (roundedAverage > starIndex - 1 && roundedAverage < starIndex) {
      fillWidth = 50 * (roundedAverage - (starIndex - 1));
    } else {
      fillWidth = 0;
    }

    // Appliquer la transition pour la propriété "width"
    fillRect.style.transitionProperty = 'width';
    fillRect.style.transitionDuration = '0.5s';
    fillRect.style.transitionTimingFunction = 'ease-in-out';

    // Appliquer la transition pour la propriété "fill"
    fillRect.style.transitionProperty = 'fill';
    fillRect.style.transitionDuration = '0.5s';
    fillRect.style.transitionTimingFunction = 'ease-in-out';

    // définissez la largeur du rectangle de remplissage
    fillRect.setAttribute('width', fillWidth);

    // définissez la couleur du rectangle de remplissage
    fillRect.setAttribute('fill', '#ffec40');
  });

  groupeResultat.style.setProperty('--fillPercentage', `${fillPercentage}%`);

  console.log('Note moyenne :', roundedAverage);

  // Afficher ou masquer result__container en fonction du nombre de résultats
  if (resultCount >= 4) {
    resultContainer.style.display = 'block';
    totalSpan.innerHTML = roundedAverage.toFixed(2); // Afficher la moyenne arrondie à deux décimales
  
    setTimeout(() => {
      groupeResultat.classList.add('star--bounce'); // Ajouter la classe "bounce" au conteneur du groupe d'étoiles du résultat
    }, 100); // Ajouter un délai d'une seconde après le reveal
  } else {
    resultContainer.style.display = 'none';
    totalSpan.innerHTML = ''; // Réinitialiser le contenu du totalSpan
    groupeResultat.classList.remove('star--bounce'); // Supprimer la classe "bounce" du conteneur du groupe d'étoiles du résultat
  }
}

function fillStars(stars, index) {
  stars.forEach((etoile, i) => {
    if (i <= index) {
      etoile.classList.add('yellow');
    } else {
      etoile.classList.remove('yellow', 'star--red', 'star--orange', 'star--green');
    }
  });
}
