const qwerty = document.getElementById('qwerty');
const phrase = document.getElementById('phrase');
const start = document.querySelector('.btn__reset');
const startOverlay = document.getElementById('overlay');
let missed = 0;
let e = 0;
let correct = null;
let phrases = [
    "fool's gold",
    "as the crow flies",
    "time flies",
    "this is heavy, doc",
    "sophomore slump",
    "tread lightly",
    "faux pas",
    "high tail it",
    "can it",
    "carpe diem",
    "zip it",
    "jaws of life",
    "alter ego",
    "midlife crisis",
    "silent but deadly",
    "killing it",
    "it is what it is",
    "are we there yet"
];

// gets random index number from the array and returns the split() phrase
const getRandomPhraseAsArray = () => {  
    let i = Math.floor(Math.random() * phrases.length);
    let splitPhrase = phrases[i].split('');
    return(splitPhrase);  
}

//stores the random split() phrase into a variable
let phraseArray = getRandomPhraseAsArray(phrases);


// logs the first hidden phrase to the console
let joined = phraseArray.join('');
console.log(joined);


// iterates through the phrases array and applies the app() function for each one
const addPhraseToDisplay = arr => {    
    
// stores each character inside an 'li' and appends to the #phase ul, while applying appropriate styles
// can be made to recognize punctuation: apostrophes, commas, Qmarks, EXmarks, periods.
      for (i = 0; i < arr.length; i++) {    
            let li = document.createElement('li');
            li.innerText = arr[i];
            let ul = document.querySelector('ul');
            ul.appendChild(li);
                if (li.textContent === ' ') {
                    li.classList.add('space');
                } else if (li.textContent === "\'") {
                    li.classList.add('letter', 'punctuation');
                } else if (li.textContent === "\,") {
                    li.classList.add('letter', 'punctuation');
                } else if (li.textContent === "\?") {
                    li.classList.add('letter', 'punctuation');
                } else if (li.textContent === "\!") {
                    li.classList.add('letter', 'punctuation');
                } else if (li.textContent === "\.") {
                    li.classList.add('letter', 'punctuation');
                } else {
                    li.classList.add('letter');    
                }
        }
    }




addPhraseToDisplay(phraseArray);

//function for the (retry) button
// everything is reset, including the phraseArray value. the new value is added at the bottom of the function - each time reboot runs the value is updated
function reboot() {
    missed = 0;
    e = 0;
    phraseArray = null;

        for (z = 0; z !== 26; z++) {
            document.getElementsByTagName('button')[z].classList.remove('chosen');
            document.getElementsByTagName('button')[z].removeAttribute('disabled');
        }
    
    heart = document.getElementsByTagName('img')[0].setAttribute('src', 'images/liveHeart.png');
    heart = document.getElementsByTagName('img')[1].setAttribute('src', 'images/liveHeart.png');
    heart = document.getElementsByTagName('img')[2].setAttribute('src', 'images/liveHeart.png');
    heart = document.getElementsByTagName('img')[3].setAttribute('src', 'images/liveHeart.png');
    heart = document.getElementsByTagName('img')[4].setAttribute('src', 'images/liveHeart.png');
    
    let result = document.getElementById('overlay');
    result.classList.remove('lose');
    result.classList.remove('win');

    phrase.firstElementChild.textContent = '';
    let p = document.getElementById('phrase');
    p.classList.remove('winPop');

    let newPhrase = getRandomPhraseAsArray(phraseArray);
    let New = newPhrase.join('');
    addPhraseToDisplay(New);
    phraseArray = newPhrase;
    console.log(New);
};


// hides the start screen on-click
start.addEventListener('click', () => {              
    overlay.style.display = "none";
    console.log('overlay hidden');
});




// if you want to loop up to 15 items, you want 14 in actuality. because index value starts at 0
function checkLetter(button) {

    let items = document.querySelectorAll('.letter');
    let match = null;
        for (i = 0; i < items.length; i++) {
            
                if (items[i].textContent === button) {
                    items[i].classList.add('show');
                    match = items[i].textContent;
                }

        }
    return match;
}                


function delayWin() {
    let result = document.getElementById('overlay');
    let win = document.getElementById('winDisplay');
    win.innerHTML = `You won! The answer is \"${phraseArray.join('')}\"`;
    result.classList.add('win');
    result.style.display = 'flex';
    start.innerHTML = 'retry';
    start.addEventListener('click', reboot);
}

function delayLose() {
    let result = document.getElementById('overlay');
    let win = document.getElementById('winDisplay');
    win.innerHTML = `You lost! The answer was \"${phraseArray.join('')}\"... Try again?`;
    result.classList.add('lose');
    result.style.display = 'flex';
    start.innerHTML = 'retry';
    start.addEventListener('click', reboot);
}



// checks to see if you've won or lost after each lettercheck
const checkWin = () => {
    let option = document.getElementsByClassName('letter');
    let reveal = document.getElementsByClassName('show');
        
        

        if (reveal.length === option.length) {
            let p = document.getElementById('phrase');
            p.classList.add('winPop'); 
            setTimeout(delayWin, 2000);
        }

        if (missed >= 5) {
            setTimeout(delayLose, 1000);
        }
}  



// event listener for the (qwerty) onscreen keyboard
qwerty.addEventListener('click', button => {
    let check = checkLetter(button.target.innerText);

                // if button is pressed, adds (.chosen) class, and disables.
                if (button.target.tagName === 'BUTTON') {
                    const picked = button.target;
                    picked.className = 'chosen';
                    picked.setAttribute('disabled', '');
                }

                if (button.target.tagName === 'DIV') {
                    return
                }

                // if null, adds 1 to (missed) counter, sets new attribute to lostheart.png, and adds one to (e) counter
                if (check === null) {
                    missed += 1;
                    heart = document.getElementsByTagName('img')[e].setAttribute('src', 'images/LostHeart.png');
                    e += 1;  
                }
    
    checkWin()
});

// Need to be able to add longer phrases without breaking words
