const desk = document.querySelector(".desk");
const startPagina = document.querySelector(".body1");
const speelPagina = document.querySelector(".speel");
const speelInh = document.querySelector(".speel2");
const speelBtn = document.getElementById("speelBtn");
const menuKnop = document.getElementById("terugBtn");
const img = document.querySelector(".img");
let currentPlayer = "white";

let gameBoard = [
    [0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0],
    [0,2,0,2,0,2,0,2],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0]
];
let selected = null;
speelBtn.onclick = function(){
    startPagina.style.display = "none";
    speelPagina.style.display = "block";
    speelInh.classList.add("geen-afbeelding");
    img.style.display = "block";
    deskTonen();
}
menuKnop.onclick = function(){
    startPagina.style.display = "block";
    speelPagina.style.display = "none";
    img.style.display = "none";
    desk.classList.remove("geen-afbeelding");
}
function deskTonen(){
    desk.innerHTML = "";
    for(let row = 0; row < 8; row++){
        for(let col = 0; col < 8; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if((row+col) % 2 ===0){
                cell.classList.add("light");
            } else{
                cell.classList.add("donker");
                const piece = gameBoard[row][col];
                if(piece === 1){
                    const daam = document.createElement("div");
                    daam.classList.add("daam", "witte-daam");
                    cell.appendChild(daam);
                } else if(piece === 2){
                    const daam = document.createElement("div");
                    daam.classList.add("daam", "donker-daam");
                    cell.appendChild(daam);
                }
            }
            desk.appendChild(cell);
        }
    }
}


