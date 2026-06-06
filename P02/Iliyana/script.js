let gerechten = [
    {
        naam: "Fruitbowl",
        level: 1,
        image: "img/fruitbowl.png",
        stappen: ["Bowl with yogurt", "Cut fruit", "Put fruit in bowl", "Add toppings", "Serve"],
        goedeVolgorde: ["Bowl with yogurt", "Cut fruit", "Put fruit in bowl", "Add toppings", "Serve"]
    },
    {
        naam: "Pizza Margherita",
        level: 1,
        image: "img/pizza.png",
        stappen: ["Roll out dough", "Add tomato sauce", "Add mozzarella", "Add basil", "Bake pizza", "Serve"],
        goedeVolgorde: ["Roll out dough", "Add tomato sauce", "Add mozzarella", "Add basil", "Bake pizza", "Serve"]
    },
    {
        naam: "Cheeseburger",
        level: 1,
        image: "img/cheeseburger.png",
        stappen: ["Take bottom bun", "Add burger", "Add cheese on burger", "Add lettuce & tomato", "Add top bun", "Serve"],
        goedeVolgorde: ["Take bottom bun", "Add burger", "Add cheese on burger", "Add lettuce & tomato", "Add top bun", "Serve"]
    },
    {
        naam: "Poke Bowl",
        level: 2,
        image: "img/pokebowl.png",
        stappen: ["Bowl with rice", "Add protein", "Add vegetables", "Add avocado", "Add sauce", "Serve"],
        goedeVolgorde: ["Bowl with rice", "Add protein", "Add vegetables", "Add avocado", "Add sauce", "Serve"]
    },
    {
        naam: "Spaghetti bolognese",
        level: 2,
        image: "img/pasta.png",
        stappen: ["Spaghetti on plate", "Add tomato sauce", "Add meatballs on spaghetti", "Add cheese", "Serve"],
        goedeVolgorde: ["Spaghetti on plate", "Add tomato sauce", "Add meatballs on spaghetti", "Add cheese", "Serve"]
    },
    {
        naam: "Burrito",
        level: 2,
        image: "img/burrito.png",
        stappen: ["Lay down tortilla", "Add rice", "Add meat/beans", "Add vegetables", "Add cheese & sauce", "Roll burrito"],
        goedeVolgorde: ["Lay down tortilla", "Add rice", "Add meat/beans", "Add vegetables", "Add cheese & sauce", "Roll burrito"]
    },
    {
        naam: "Sushi roll",
        level: 3,
        image: "img/sushi.png",
        stappen: ["Lay nori", "Add rice on nori", "Add filling", "Roll sushi", "Cut roll", "Place pieces", "Serve"],
        goedeVolgorde: ["Lay nori", "Add rice on nori", "Add filling", "Roll sushi", "Cut roll", "Place pieces", "Serve"]
    },
    {
        naam: "Ramen",
        level: 3,
        image: "img/ramen.png",
        stappen: ["Pour broth in bowl", "Add noodles", "Add vegetables", "Add protein", "Add egg", "Add toppings", "Serve"],
        goedeVolgorde: ["Pour broth in bowl", "Add noodles", "Add vegetables", "Add protein", "Add egg", "Add toppings", "Serve"]
    },
    {
        naam: "Lasagne",
        level: 3,
        image: "img/lasagne.png",
        stappen: ["First layer sauce & sheets", "Second layer sauce & sheets", "Third layer sauce & sheets", "Add béchamel sauce", "Add cheese", "Bake in oven", "Cut piece", "Serve"],
        goedeVolgorde: ["First layer sauce & sheets", "Second layer sauce & sheets", "Third layer sauce & sheets", "Add béchamel sauce", "Add cheese", "Bake in oven", "Cut piece", "Serve"]
    },
    {
        naam: "Paella",
        level: 3,
        image: "img/paella.png",
        stappen: ["Rice in pan", "Add broth", "Add chicken/seafood", "Add vegetables", "Add spices", "Place shrimp on top", "Add lemon", "Serve"],
        goedeVolgorde: ["Rice in pan", "Add broth", "Add chicken/seafood", "Add vegetables", "Add spices", "Place shrimp on top", "Add lemon", "Serve"]
    },
]

console.log(gerechten);

let gekozenVolgorde = []; 
let currentLevel = 1;
let currentGerechtIndex = 0;
let currentGerecht;
let lives = 3;
let score = 0;
let lostLife = false;


function Play() {
    gekozenVolgorde = [];
    selectGerecht();         
    showGerechtInHtml();     
    showStappen();             
}


function selectGerecht() {
    let gerechtenVanDitLevel = [];
    for (let index = 0; index < gerechten.length; index++) {
    if (gerechten[index].level === currentLevel) {
        gerechtenVanDitLevel.push(gerechten[index])
    }
}

    currentGerecht = gerechtenVanDitLevel[currentGerechtIndex];
}


function showGerechtInHtml() {
const naamElement = document.querySelector("#meal-name");
const imgElement = document.querySelector("#meal-img");
naamElement.textContent = currentGerecht.naam;
imgElement.src = currentGerecht.image;
};

function showStappen () {
    const stappenContainer = document.querySelector("#buttons");
    stappenContainer.innerHTML = "";
    const stappen = currentGerecht.stappen; 
    stappen.sort(() => Math.random() - 0.5);
    // De variabele stap is de parameter van deze callback-functie. Dit betekent dat in elke ronde van de loop,
    //stap de waarde krijgt van het huidige element uit de stappen array.
    stappen.forEach(stap => {
        const stapElement = document.createElement("button");
        stapElement.innerHTML = stap;
        stapElement.addEventListener("click", () => {
        console.log("Geklikt:", stap);
        gekozenVolgorde.push(stap);
        stapElement.disabled = true;
        stapElement.style.background="#f2b372";
        stapElement.style.border="2px solid #fba64d"
    })
      stappenContainer.append(stapElement);
    });
}

const klaarBtn = document.querySelector("#checkVolgorde");
const restartBtn = document.querySelector(".restart")

klaarBtn.addEventListener("click", () => {
    if (gekozenVolgorde.length === currentGerecht.stappen.length) {
        checkGekozenVolgorde();
    } else {
        alert("You need to finish the order first!");
    }
});


function checkGekozenVolgorde() {
    let isCorrect = true;

    for (let index = 0; index < gekozenVolgorde.length; index++) {
        if (gekozenVolgorde[index] !== currentGerecht.goedeVolgorde[index]) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        alert("Nice! You got it right!");
        score++;
    } else {
        alert("You got it wrong.");
        lives--;
        if (lives <= 0) {
            lostLife = true;
    }
    }

    if (lives === 0) {
    const popup = document.querySelector("#popup");
    popup.classList.remove("hidden");

    setTimeout(() => {
        window.location.href = "youfailed.html";
    }, 750);

    return;
}

    UpdateScoreOrLivesAndLevel();

    currentGerechtIndex++;

    let aantalGerechtenInLevel = 0;

    for (let index = 0; index < gerechten.length; index++) {
    if (gerechten[index].level === currentLevel) {
        aantalGerechtenInLevel++;
    }
    }

     if (currentGerechtIndex >= aantalGerechtenInLevel) {
         currentLevel++;
         currentGerechtIndex = 0;
         lives = 3;
         UpdateScoreOrLivesAndLevel();
       }


     if (currentLevel > 3 && !lostLife) {
    setTimeout(() => {
        window.location.href = "youwon.html";
    }, 750);
    return;
    }

UpdateScoreOrLivesAndLevel();
Play();
}

function UpdateScoreOrLivesAndLevel() {
    const scoreElement = document.querySelector("#score");
    scoreElement.textContent = score;
    const livesElement = document.querySelector("#lives");
    livesElement.textContent = lives;
    const levelElement = document.querySelector("#level");
    levelElement.textContent = currentLevel;
}


Play();

