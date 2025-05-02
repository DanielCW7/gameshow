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

function handleClick(letter) {
    // disables the letter and checks for a match
    chosenLetter = letter.innerHTML;
    letter.classList.add('chosen');

    checkLetter(chosenLetter)
}

start.addEventListener('click', () => {
    startOverlay.style.display='none'
    startGame()
})

