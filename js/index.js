const wordSecret = ['CSS','HTML','ORACLE','BUG','MOUSE','PUERTA','JAVA','RELOJ','HOLA','CHAU','PERRO','GATO','PAJARO','CALLE','PAIS','CASA','MESA','MESSI','MUSICA','SILLA','CANCION'];
let wordChosen = "";
var keyValue = "";
var correctLetters = [];
var incorrectLetters = [];
var insertLetters = [];
var attemps = 0;

// Music control.
window.addEventListener("load", () => {
    document.getElementById("btn-pause").addEventListener("click", playMusic);
    document.getElementById("btn-play").addEventListener("click", pauseMusic);
});

// Play music.
function playMusic() {
    var sound = document.createElement("iframe");
	sound.setAttribute("src","../assets/super-mario.mp3");
    sound.setAttribute("hidden", "");
	document.body.appendChild(sound);
    document.getElementById("btn-play").style.display = "block";
    document.getElementById("btn-pause").style.display = "none";
}

// Pause music.
function pauseMusic(){
	var iframe = document.getElementsByTagName("iframe");   
	if (iframe.length > 0){
		iframe[0].parentNode.removeChild(iframe[0]);
	}
    document.getElementById("btn-play").style.display = "none";
    document.getElementById("btn-pause").style.display = "block";
}

// Function to add word.
function addWord (){
    document.getElementById("initialMain").style.display = "none";
    document.getElementById("wordMain").style.display = "block";
    document.getElementById("playGame").style.display = "none";
}

// Function to exit from section add word or the section new game with surrender button.
function exitWord() {
    document.getElementById("initialMain").style.display = "block";
    document.getElementById("wordMain").style.display = "none";
    document.getElementById("playGame").style.display = "none";
    document.getElementById("drawAside").style.display = "none";
    document.getElementById("container").style.gridTemplateColumns = "100%";
    document.getElementById("word").value = "";
    clearGame();
}

// Function to start a game.
function playGame (){
    document.getElementById("initialMain").style.display = "none";
    document.getElementById("wordMain").style.display = "none";
    document.getElementById("playGame").style.display = "block";
    document.getElementById("drawAside").style.display = "block";
    document.getElementById("container").style.gridTemplateColumns = "50% 50%";
}

// Function to save a word in the array of secrect.
function saveWord() {
    let word = document.getElementById("word").value;
    clearDiv("alert");
    if(verifyWord(word)) {
        wordSecret.push(word);
    }else {
        createAlert('<i class="bi bi-exclamation-circle-fill"></i>  Only uppercase - Maximum 8 letters', 'warning','alert');
    }
}

// Function to check if the word is valid using RegExp.
function verifyWord(word) {
    let patron = new RegExp("^[A-Z\\s]+$");
    if(word.length <= 8 && patron.test(word)){
         return true;
    }
    return false;
}

// Function to check if the letter is valid. the ASCII code value was limited to only letters.
function verifyLetter(letter) {
    if(letter.charCodeAt(0) >= 97 && letter.charCodeAt(0) <= 122) {
        return true;
    }else{
        return false;
    }
}

// Function to check if the letter is repeated.
function repeatLetter(letter){
    return insertLetters.indexOf(letter) !== -1;
}

// Funcion to create alerts in different places.
function createAlert(message, type, id) {
    const alertPlaceholder = document.getElementById(`${id}`);
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
          `<div class="alert alert-${type} alert-dismissible" role="alert">`,
          `   <div>${message}</div>`,
          '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
          '</div>'
        ].join('')
      
        alertPlaceholder.append(wrapper)
}

// Function to clear a element
function clearDiv(elementId) {
    document.getElementById(elementId).innerHTML = "";
}

// Function to choose a random word
function randomWord() {
    let word = wordSecret[Math.floor(Math.random()*wordSecret.length)];
    wordChosen = word;
}

// Funcion to create lines from the random word
function createLines(wordChosen) {
    const table = document.getElementById("table1");
    const tr = document.createElement("tr");
    let arrayCell = [];

    Array.from(wordChosen).forEach((value,index) => {
        arrayCell[index] = `<td id="letter${index}"></td>`;
    });  
    tr.innerHTML = `${arrayCell.toString().split(",").join("")}`;
    table.append(tr);
}

// parameter that has a function that takes a letter from the keyboard
const change = (event) => {
    keyValue = event.key;
    main(keyValue);
}

// Function to capture letters typed from the keyboard
function captureLetter() {
    document.addEventListener('keyup', change, false);
}

// Function to remove the capture letter event because one should be active  
function removecaptureLetter() {
    document.removeEventListener('keyup', change, false);
}

function keyDetected(keyValue) {
    console.log(keyValue);
    main(keyValue);
}

//Funcion Main
function main(keyValue) {
    let arwordChosen = Array.from(wordChosen);
    if (verifyLetter(keyValue)) {
        if (!repeatLetter(keyValue)){
            insertLetters.push(keyValue);
            // The "if" statement is true if the letter is inside the random chosen word
            if(wordChosen.indexOf(keyValue.toUpperCase()) !== -1){
                arwordChosen.forEach(value => {
                    if (keyValue.toUpperCase() == value) {
                        correctLetters.push(keyValue);
                        insertLettercorrect(arwordChosen,correctLetters);
                        if(correctLetters.length == arwordChosen.length){
                            showWin();
                        }
                        clearDiv("alert2");
                    }
                })
            }else{
                incorrectLetters.push(keyValue);
                insertLetterincorrect(incorrectLetters);
                draw(attemps);
                attemps++;
                if (attemps > 6) {
                    showLost();
                    removecaptureLetter();
                    showWord(arwordChosen);
                }
                clearDiv("alert2");
            }
        }else{
            clearDiv("alert2")
            createAlert('REPEATED LETTER', 'warning','alert2');
        }
    } else {
        clearDiv("alert2")
        createAlert('only uppercase letters without Caps Lock', 'warning','alert2');
    }
}

// Function to show word if the player lost. 
function showWord(arwordChosen) {
    arwordChosen.forEach((value,index) => {
        document.getElementById(`letter${index}`).innerHTML = value;
    })
}

// Function to insert a correct letter in the HTML view.
function insertLettercorrect(arr,insLetter) { 
    let lastLetter = insLetter[insLetter.length - 1].toUpperCase();
    arr.forEach((value,index) => {
        if(value == lastLetter){
            document.getElementById(`letter${index}`).innerHTML = lastLetter;
        }
    });
}

// Function to insert a incorrect letter in the HTML view.
function insertLetterincorrect(arr) {
    const tr2 = document.getElementById("tr2");
    const td = document.createElement("td"); 
    td.innerHTML = arr[arr.length - 1].toUpperCase();
    tr2.append(td);
}

// Function to draw each part of the doll
function draw(attemps) {
    const img = document.getElementById("draw").children;
    if(attemps == -1){for(let j=0; j<=6;j++){img.item(j).style.display = "none";}}
    for(let i=0; i<=6;i++){
        if(i == attemps){
            img.item(i).style.display = "block";
        } else {
            img.item(i).style.display = "none";
        }
    }
}

// Function to show on the screen that you won.
function showWin() {
    document.getElementById("textWin").style.display = "block";
}

// Function to show on the screen that you lost.
function showLost() {
    document.getElementById("textLost").style.display = "block";
}

// Function to hide text win and lost.
function hideResult() {
    document.getElementById("textWin").style.display = "none";
    document.getElementById("textLost").style.display = "none";
}

// Function to clean data for a new game.
function clearGame() {
    keyValue = "";
    wordChosen = "";
    correctLetters = [];
    incorrectLetters = [];
    insertLetters = [];
    attemps = 0;
    draw(-1);
    hideResult();
    clearDiv("alert");
    clearDiv("alert2")
    clearDiv("table1");
    clearDiv("tr2");
}

// Function for start a new game.
function newGame() {
    clearGame();
    removecaptureLetter();
    playGame();
    randomWord();
    createLines(wordChosen);
    captureLetter();
}