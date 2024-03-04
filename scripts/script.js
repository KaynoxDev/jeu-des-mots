/*********************************************************************************
 *
 * Ce fichier contient toutes les fonctions nécessaires au fonctionnement du jeu.
 *
 *********************************************************************************/


/**
 * Cette fonction affiche dans la console le score de l'utilisateur
 * @param {number} score : le score de l'utilisateur
 * @param {number} nbMotsProposes : le nombre de mots proposés à l'utilisateur
 */
function afficherResultat(score, nbMotsProposes) {
  // Récupération de la zone dans laquelle on va écrire le score
  let spanScore = document.querySelector(".zoneScore span");
  // Ecriture du texte
  let affichageScore = `${score} / ${nbMotsProposes}`;
  // On place le texte à l'intérieur du span.
  spanScore.innerText = affichageScore;
}

function afficherProposition(proposition) {
    let zoneProposition = document.querySelector(".zoneProposition")
    zoneProposition.innerText = proposition
}

let timerInterval;
let playerNameInput = document.getElementById("playerNameInput");

function startGame() {
  // Chronomètre
  let timerDisplay = document.getElementById("timer");
  let timer = 0;
  
  let startButton = document.getElementById("startButton");
  
  startButton.addEventListener("click", function() {
    
      // Cache le bouton de démarrage
      startButton.style.display = "none";
      playerNameInput.style.display = "none";
      // Démarre le chronomètre
      timerInterval = setInterval(function() {
        timer++;
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);

      // Affiche le jeu
      
      document.querySelector("main").style.display = "block";
  });

  // Assurez-vous que le jeu est caché au début
  document.querySelector("main").style.display = "none";

  return timer;
}



/**
 * Cette fonction construit et affiche l'email. 
 * @param {string} nom : le nom du joueur
 * @param {string} email : l'email de la personne avec qui il veut partager son score
 * @param {string} score : le score. 
 * @param {number} timer : le temps qu'il a mis pour réaliser ce score
 */
function afficherEmail(nom, email, score, timer) {
  let minutes = Math.floor(timer / 60);
  let seconds = timer % 60;
  let time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  let mailto = `mailto:${email}?subject=Partage du score Azertype&body=Salut, je suis ${nom} et je viens de réaliser le score ${score} en ${time}sur le site d'Azertype !`
  location.href = mailto
}



/**
 * Cette fonction lance le jeu.
 * Elle demande à l'utilisateur de choisir entre "mots" et "phrases" et lance la boucle de jeu correspondante
 */

function lancerJeu() {

  let timer = startGame();
  // Initialisations
  initAddEventListenerPopup()
  let score = 0;
  let nbMotsProposes = 0;
  let i = 0;
  let listePropositions = listeMots
  btnPartage.hidden = true;
  let btnvalider = document.getElementById("btnValiderMot");
  let inputEcriture = document.getElementById("inputEcriture");

  afficherProposition(listePropositions[i]);

  btnReset = document.getElementById("reset")

  btnReset.addEventListener("click", () => {
    location.reload()
  })

  btnvalider.addEventListener("click", () => {
    nbMotsProposes++;
    if (inputEcriture.value === listePropositions[i]) {
      score++;
    }
    i++;
    afficherResultat(score, i);
    inputEcriture.value = "";
    if (listePropositions[i] === undefined) {
      afficherProposition("Le jeu est fini");
      btnvalider.disabled = true;
      btnPartage.hidden = false;
      btnReset.hidden = false;
      clearInterval(timerInterval);;
      // Send data to server
  let playerName = playerNameInput;
  let gameType = listePropositions === listeMots ? "mots" : "phrases";
  let data = { playerName, score, timer, gameType };
  fetch('http://localhost:3000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(() => {
    updateLeaderboard();
  }).catch(error => console.error('Fetch error:', error));
    } else {
      afficherProposition(listePropositions[i]);
    }

   
  
  });

  function updateLeaderboard() {
    fetch('http://localhost:3000/leaderboard')
      .then(response => response.json())
      .then(data => {
        let leaderboardDiv = document.getElementById('leaderboard');
        leaderboardDiv.innerHTML = ''; // Clear the leaderboard
        data.forEach((entry, index) => {
          let entryDiv = document.createElement('div');
          entryDiv.textContent = `${index + 1} - ${playerNameInput.value}: ${score} points, ${timer} seconds (${entry.gameType})`;
          leaderboardDiv.appendChild(entryDiv);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  let listeBtnRadio = document.querySelectorAll(".optionSource input")

  for (let index = 0; index < listeBtnRadio.length; index++) {
    listeBtnRadio[index].addEventListener("change", (event) => {
        if (event.target.value === "1") {
            listePropositions = listeMots
        } else {
            // Sinon nous voulons jouer avec la liste des phrases
            listePropositions = listePhrases
        }
        afficherProposition(listePropositions[i])
    })
  }

  let form = document.querySelector("form")

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let name = document.getElementById("nom").value
    let mail = document.getElementById("email").value
    let scoremail = `${score} / ${i}`
    console.log(name, mail)

    afficherEmail(name, mail, scoremail)

  })
  
  afficherResultat(score, i);
}

