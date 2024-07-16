const phrase = document.querySelector('#phrase');
const hint = document.querySelector('#hint')
const start = document.querySelector('#btn_reset');
const startOverlay = document.querySelector('#overlay');
const letters = document.getElementsByClassName('letter') /* of the phrase, not the keyboard */
const keys = document.getElementsByClassName('key') /* of the phrase, not the keyboard */
const modal = document.querySelector('#modal');
const winModal = document.querySelector('#winModalInner');
const loseModal = document.querySelector('#loseModalInner');
const modalPhrase = document.getElementsByClassName('modalPhrase')
const lives = document.getElementsByClassName('lives');

let hearts = 5;

let phrases = [
    {
        'phrase': 'Fool\'s gold',
        'hint': 'Often mistaken for actual gold.'
    },
    {
        'phrase': 'As the crow flies',
        'hint': 'Describing distance in a straight line.'
    },   
    {
        'phrase': 'Time flies',
        'hint': '____ ____ when you\' having fun!'
    },   
    {
        'phrase': 'This is heavy, doc',
        'hint': 'Marty McFly in disbelief'
    },
    {
        'phrase': 'Tread lightly',
        'hint': 'Another way of saying "be careful"'
    },
    {
        'phrase': 'Faux pas',
        'hint': 'French for a social blunder'
    },
    {
        'phrase': 'Carpe diem',
        'hint': 'Seize the day!'
    },
    {
        'phrase': 'Zip it',
        'hint': 'Another way to tell someone to not speak'
    },
    {
        'phrase': 'It is what it is',
        'hint': 'Accepting the situation for what it is'
    },
    {
        'phrase': 'Midlife crisis',
        'hint': 'Many middle-aged people experience this phase'
    },
    {
        'phrase': 'Up the creek without a paddle',
        'hint': 'In a difficult situation'
    }, 
    {
        'phrase': 'Midlife crisis',
        'hint': 'Many middle-aged people experience this phase'
    },
    {
        'phrase': 'A blessing in disguise',
        'hint': 'Seemed bad at first, but turns out to be good'
    },  
    {
        'phrase': 'Call it a day',
        'hint': 'To resign from doing something, or concluding work for the day'
    }, 
    {
        'phrase': 'No, luke. I am your father',
        'hint': 'Major plot twist of 80s sci-fi'
    },
];

function parseWords(wordsObj, numberOfWords) {
    // allows words to be wrapped in their own <ul> tag, for ease of styling inside a flex container
    let wrapped = []

    for (let i = 0; i < numberOfWords; i++) {
        let currentWord = (wordsObj[`word ${i+1}`])
        let ul = document.createElement('ul')

            for(let e = 0; e < currentWord.length; e++) {
                let li = document.createElement('li')
                li.innerText = currentWord[e]
                li.classList.add('letter')
                ul.appendChild(li)
            }
        wrapped.push(ul)     
    }

    // access the HTML inside the 'wrapped' variables to append individually to #phrase
     for(let i = 0; i < wrapped.length; i++) {
        phrase.appendChild(wrapped[i])
     }

     const list = Array.from(letters)
    list.map(element => {
        element.innerHTML.includes(",") ? element.classList.add("punctuation") : null
        element.innerHTML.includes("!") ? element.classList.add("punctuation") : null
        element.innerHTML.includes("'") ? element.classList.add("punctuation") : null
        element.innerHTML.includes("-") ? element.classList.add("punctuation") : null
        element.innerHTML.includes(".") ? element.classList.add("punctuation") : null
        element.innerHTML.includes("?") ? element.classList.add("punctuation") : null
    })
}

async function pause(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds))
}
async function startGame() {
    // reset current values for fresh start
    hearts = 5
    phrase.innerHTML = ""
    hint.innerHTML = ""
    modal.style.opacity = '0'
    modal.style.pointerEvents = 'none'

    winModal.style.pointerEvents = 'none'
    winModal.classList.remove('popup')
    loseModal.style.pointerEvents = 'none'
    loseModal.classList.remove('popup')
    Array.from(keys).forEach(key => key.classList.contains('chosen') && key.classList.remove('chosen'))
    Array.from(lives).forEach(life => life.classList.remove('drop'))

    const randomIndex = Math.floor(Math.random() * (phrases.length - 1));
    // take the randomly chosen phrase and insert each character into a new array
    const toArray = phrases[randomIndex].phrase.split('');
    // hint displayed
    hint.innerHTML = phrases[randomIndex].hint
    // set the phrase for both win and lose modals
    Array.from(modalPhrase).map(modal => modal.innerText = phrases[randomIndex].phrase)

    let wordsObject = {}

    // separate words into their objects
    let spaces = 0
    toArray.map((character, index) => {
        if(character[index] === character[0]) {
            wordsObject[`word 1`] = character
        } else if(character === " ") {
            spaces += 1
            wordsObject[`word ${spaces + 1}`] = ""
        } else {
            wordsObject[`word ${spaces + 1}`] += character
        }
    });

    // parse word object properties to create individual <li>'s and wrap each word in a <ul> tag
    parseWords(wordsObject, spaces + 1)
}

function checkLetter(letter) {

    const capped = letter.toUpperCase();
    const list = Array.from(letters);
    const arr = [];

    list.forEach(letter => {
        const capped = letter.innerHTML.toUpperCase();
        arr.push(capped);
    })

    if(arr.includes(capped) === true) {        
        const match = list.filter(i => {
            return i.innerHTML.toUpperCase() === letter;
        })

        match.forEach(i => i.classList.add('present'));
    } else { loseHeart(); }
   
    checkWin(list)
}

function checkWin(phrase) {
    console.log(phrase.length)
    let found = 0;
    phrase.forEach(letter => letter.classList.contains('present') && found++)
    phrase.forEach(letter => letter.classList.contains('punctuation') && found++) 
    phrase.length === found ? winNotice() : null
    
    console.log(found)
}

const loseHeart = () => {
    hearts = hearts - 1
    lives[hearts].classList.add('drop')
    // heart lost animation here
    if(hearts <= 0) {
        loseNotice()
    } else return
}

function winNotice() {
    modal.style.opacity = '1'
    modal.style.pointerEvents = 'all'

    winModal.style.pointerEvents = 'all'
    winModal.classList.add('popup')
}

function loseNotice() {
    modal.style.opacity = '1'
    modal.style.pointerEvents = 'all'

    loseModal.style.pointerEvents = 'all'
    loseModal.classList.add('popup')
}

start.addEventListener('click', () => {
    startOverlay.style.display='none'
    startGame()
})

function handleClick(letter) {
    // disables the letter and checks for a match
    chosenLetter = letter.innerHTML;
    letter.classList.add('chosen');

    checkLetter(chosenLetter)
}

// // gets random index number from the array and returns the split() phrase
// const getRandomPhraseAsArray = () => {  
//     let i = Math.floor(Math.random() * phrases.length);
//     let splitPhrase = phrases[i].split('');
//     return(splitPhrase);  
// }

// //stores the random split() phrase into a variable
// let phraseArray = getRandomPhraseAsArray(phrases);


// // logs the first hidden phrase to the console
// let joined = phraseArray.join('');
// console.log(joined);


// // iterates through the phrases array and applies the app() function for each one
// const addPhraseToDisplay = arr => {    
    
// // stores each character inside an 'li' and appends to the #phase ul, while applying appropriate styles
// // can be made to recognize punctuation: apostrophes, commas, Qmarks, EXmarks, periods.
//       for (i = 0; i < arr.length; i++) {    
//             let li = document.createElement('li');
//             li.innerText = arr[i];
//             let ul = document.querySelector('ul');
//             ul.appendChild(li);
//                 if (li.textContent === ' ') {
//                     li.classList.add('space');
//                 } else if (li.textContent === "\'") {
//                     li.classList.add('letter', 'punctuation');
//                 } else if (li.textContent === "\,") {
//                     li.classList.add('letter', 'punctuation');
//                 } else if (li.textContent === "\?") {
//                     li.classList.add('letter', 'punctuation');
//                 } else if (li.textContent === "\!") {
//                     li.classList.add('letter', 'punctuation');
//                 } else if (li.textContent === "\.") {
//                     li.classList.add('letter', 'punctuation');
//                 } else {
//                     li.classList.add('letter');    
//                 }
//         }
//     }




// addPhraseToDisplay(phraseArray);

// //function for the (retry) button
// // everything is reset, including the phraseArray value. the new value is added at the bottom of the function - each time reboot runs the value is updated
// function reboot() {
//     missed = 0;
//     e = 0;
//     phraseArray = null;

//         for (z = 0; z !== 26; z++) {
//             document.getElementsByTagName('button')[z].classList.remove('chosen');
//             document.getElementsByTagName('button')[z].removeAttribute('disabled');
//         }
    
//     heart = document.getElementsByTagName('img')[0].setAttribute('src', 'images/liveHeart.png');
//     heart = document.getElementsByTagName('img')[1].setAttribute('src', 'images/liveHeart.png');
//     heart = document.getElementsByTagName('img')[2].setAttribute('src', 'images/liveHeart.png');
//     heart = document.getElementsByTagName('img')[3].setAttribute('src', 'images/liveHeart.png');
//     heart = document.getElementsByTagName('img')[4].setAttribute('src', 'images/liveHeart.png');
    
//     let result = document.getElementById('overlay');
//     result.classList.remove('lose');
//     result.classList.remove('win');

//     phrase.firstElementChild.textContent = '';
//     let p = document.getElementById('phrase');
//     p.classList.remove('winPop');

//     let newPhrase = getRandomPhraseAsArray(phraseArray);
//     let New = newPhrase.join('');
//     addPhraseToDisplay(New);
//     phraseArray = newPhrase;
//     console.log(New);
// };


// // hides the start screen on-click
// start.addEventListener('click', () => {              
//     overlay.style.display = "none";
//     console.log('overlay hidden');
// });




// // if you want to loop up to 15 items, you want 14 in actuality. because index value starts at 0
// function checkLetter(button) {

//     let items = document.querySelectorAll('.letter');
//     let match = null;
//         for (i = 0; i < items.length; i++) {
            
//                 if (items[i].textContent === button) {
//                     items[i].classList.add('show');
//                     match = items[i].textContent;
//                 }

//         }
//     return match;
// }                


// function delayWin() {
//     let result = document.getElementById('overlay');
//     let win = document.getElementById('winDisplay');
//     win.innerHTML = `You won! The answer is \"${phraseArray.join('')}\"`;
//     result.classList.add('win');
//     result.style.display = 'flex';
//     start.innerHTML = 'retry';
//     start.addEventListener('click', reboot);
// }

// function delayLose() {
//     let result = document.getElementById('overlay');
//     let win = document.getElementById('winDisplay');
//     win.innerHTML = `You lost! The answer was \"${phraseArray.join('')}\"... Try again?`;
//     result.classList.add('lose');
//     result.style.display = 'flex';
//     start.innerHTML = 'retry';
//     start.addEventListener('click', reboot);
// }



// // checks to see if you've won or lost after each lettercheck
// const checkWin = () => {
//     let option = document.getElementsByClassName('letter');
//     let reveal = document.getElementsByClassName('show');
        
        

//         if (reveal.length === option.length) {
//             let p = document.getElementById('phrase');
//             p.classList.add('winPop'); 
//             setTimeout(delayWin, 2000);
//         }

//         if (missed >= 5) {
//             setTimeout(delayLose, 1000);
//         }
// }  



// // event listener for the (qwerty) onscreen keyboard
// qwerty.addEventListener('click', button => {
//     let check = checkLetter(button.target.innerText);

//                 // if button is pressed, adds (.chosen) class, and disables.
//                 if (button.target.tagName === 'BUTTON') {
//                     const picked = button.target;
//                     picked.className = 'chosen';
//                     picked.setAttribute('disabled', '');
//                 }

//                 if (button.target.tagName === 'DIV') {
//                     return
//                 }

//                 // if null, adds 1 to (missed) counter, sets new attribute to lostheart.png, and adds one to (e) counter
//                 if (check === null) {
//                     missed += 1;
//                     heart = document.getElementsByTagName('img')[e].setAttribute('src', 'images/LostHeart.png');
//                     e += 1;  
//                 }
    
//     checkWin()
// });

// Need to be able to add longer phrases without breaking words
