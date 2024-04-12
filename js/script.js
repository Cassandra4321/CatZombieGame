
function fetchCatFact() 
{
    const url = "https://catfact.ninja/fact?max_length=140";
    fetch(url)
      .then(response => response.json())
      .then(data => 
    {
        const catFact = data.fact;
        document.getElementById("cat-fact").textContent = catFact;
    })
      .catch(error => 
    {
        console.error("Error fetching cat fact:", error);
    });
  }

function game() 
{
    const images = [
        [
            { src: "1.jpg"},
            { src: "28.jpg"},
            { src: "3.jpg"},
            { src: "20.jpg"},
            { src: "5.jpg"}
        ],
        [
            { src: "6.jpg"},
            { src: "26.jpg"},
            { src: "8.jpg"},
            { src: "9.jpg"},
            { src: "13.jpg"}
        ],
        [
            { src: "12.jpg"},
            { src: "22.jpg"},
            { src: "29.jpg"},
            { src: "14.jpg"},
            { src: "10.jpg"}
        ],
        [
            { src: "16.jpg"},
            { src: "17.jpg"},
            { src: "18.jpg"},
            { src: "19.jpg"},
            { src: "4.jpg"}
        ],
        [
            { src: "21.jpg"},
            { src: "11.jpg"},
            { src: "23.jpg"},
            { src: "24.jpg"},
            { src: "25.jpg"}
        ]
    ];

    const catImage = { src: "images/grumpycat.png" };
    const width = 5;                            
    const height = 5;                           
    let playerPosition = { x: 2, y: 2 };        
    let zombies = generateZombies();            
    let cats = generateCats();                
    let catsSaved = 0;                          

    function updateGameBoard() 
    {
        let gameBoard = document.getElementById("game-board");
        gameBoard.innerHTML = ""; // rensar spelplanen
    
        for (let y = 0; y < height; y++) 
        {
            for (let x = 0; x < width; x++) 
            {
                let cell = document.createElement("div");
                cell.classList.add("empty");
    
                // kollar om zombien är på denna position eller intilliggande
                let isZombie = zombies.some(zombie => zombie.x === x && zombie.y === y);
                let isAdjacentToPlayer = Math.abs(playerPosition.x - x) <= 1 && Math.abs(playerPosition.y - y) <= 1;
    
                // lägger till klassen för skuggning baserat på zombiens och spelarens position
                if (isZombie && isAdjacentToPlayer) 
                {
                    cell.classList.add("zombie");
                } else if (isZombie && !isAdjacentToPlayer) 
                {
                    cell.classList.add("empty");
                } else if (!isZombie && isAdjacentToPlayer) 
                {
                    cell.classList.add("zombie-adjacent");
                }
    
                // annger hur spelaren ser ut
                if (x === playerPosition.x && y === playerPosition.y) 
                {
                    cell.textContent = "🤠";
                    cell.style.color= "#004d00";     
                }
    
                gameBoard.appendChild(cell);
            }
        }
        hideFactBox()
        updateImages();
    }
 
    function generateZombies() // generera zombies (jag har valt bara 1 zombie)
    {
        let zombies = [];
        for (let i = 0; i < 1; i++)
        {
            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * height);
            zombies.push({ x: x, y: y });
        }
        return zombies;
    }
    
    function generateCats() // generera slumpmässigt placerade katter (jag har 3 katter)
    {
        let cats = [];
        for (let i = 0; i < 3; i++) 
        { 
            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * height);
            cats.push({ x: x, y: y });
        }
        return cats;
    }

    function updateImages() 
    {
        let imageContainer = document.getElementById("image-container");
        imageContainer.innerHTML = ""; // rensar bilden
    
        let currentImage = images[playerPosition.y][playerPosition.x];
        let imgElement = document.createElement("img");
        imgElement.src = `images/${currentImage.src}`;
        imageContainer.appendChild(imgElement);
    
        
        for (let i = 0; i < cats.length; i++) //kollar om spelarens position är = kattens position och lägger då till en katt bild
        {
            if (playerPosition.x === cats[i].x && playerPosition.y === cats[i].y) 
            {
                let catImgElement = document.createElement("img");
                catImgElement.src = catImage.src;
                catImgElement.alt = "Cat";
                catImgElement.classList.add("cat-image");
                
                catImgElement.style.width = "145px"; 
                catImgElement.style.height = "160px"; 
        
                catImgElement.style.position = "absolute";
                catImgElement.style.left = "700px";
                catImgElement.style.top = "260px";
                
                
                imageContainer.appendChild(catImgElement);
                break; 
            }
        }
    }


    // uppdaterar poängräknaren
    function updateScore() 
    {
        document.getElementById("score-display").textContent = catsSaved + "/3 katter räddade";
    }

    let playerMovesCount = 0; // räkna antal förflyttningar spelaren gjort

    function movePlayer(direction) 
    {
        switch (direction) 
        {
            case "north":
                if (playerPosition.y > 0) playerPosition.y--;
                break;
            case "south":
                if (playerPosition.y < height - 1) playerPosition.y++;
                break;
            case "east":
                if (playerPosition.x < width - 1) playerPosition.x++;
                break;
            case "west":
                if (playerPosition.x > 0) playerPosition.x--;
                break;
        }
        
        playerMovesCount++;                 // öka räknaren för antalet förflyttningar
        if (playerMovesCount % 2 === 0)     //använder modulus, om antalet förflyttningar från spelaren är jämnt delbart med 2 så flyttas zombien ett steg närmare spelaren
        {       
            moveZombies(); 
        }      
        updateGameBoard();
        checkEncounter(); 
    }

    function moveZombies() 
    {
        zombies.forEach(zombie => 
            {
            // räknar avståndet till spelaren från zombien
            const distanceX = Math.abs(playerPosition.x - zombie.x);
            const distanceY = Math.abs(playerPosition.y - zombie.y);
    
            // flyttar zombien närmare spelaren
            if (distanceX > distanceY) 
            {
                // Om avståndet i x-led är större än avståndet i Y-led, förflyttas zombien i X-led
                zombie.x += playerPosition.x > zombie.x ? 1 : -1;
            } 
            else 
            {
                // annars förflyttas zombien i Y-led
                zombie.y += playerPosition.y > zombie.y ? 1 : -1;
            }
        });
    }


    
    function checkEncounter() //  kollar om spelaren träffar en katt eller zombien
    {
        for (let i = 0; i < zombies.length; i++) 
        {
            if (playerPosition.x === zombies[i].x && playerPosition.y === zombies[i].y) 
            {
                alert("Du har blivit tagen av en zombie! Spelet är över.");
                location.reload(); // laddar om sidan för att börja om spelet
                return;
            }
        }
    
        for (let i = 0; i < cats.length; i++) 
        {
            if (playerPosition.x === cats[i].x && playerPosition.y === cats[i].y) 
            {
                catsSaved++;
                //alert("Yay, du hittade en katt!");

                showFactBox();
                fetchCatFact();
                updateScore();

                cats.splice(i, 1); // tar bort den hittade katten från listan
                if (catsSaved === 3) 
                {
                    //alert("Grattis! Du har räddat alla katter och överlevt zombieattacken!");
                    showModal();             // anroppar showModal functionen och väntar 4 sekunder innan spelet laddas om. 
                    setTimeout(function()
                {
                    location.reload();
                }, 4000)
                    return;
                }
            }
        }
    }

    function showFactBox() 
    {
        const factBox = document.getElementById("fact-box");
        factBox.style.display = "block"; 
      }

    function hideFactBox() 
    {
        const factBox = document.getElementById("fact-box");
        factBox.style.display = "none"; 
    }

      

    // kollar knappar för att flytta spelaren
   document.querySelector(".north").addEventListener("click", function() 
   {
        movePlayer("north");
    });
    document.querySelector(".south").addEventListener("click", function() 
    {
        movePlayer("south");
    });
    document.querySelector(".east").addEventListener("click", function() 
    {
        movePlayer("east");
    });
    document.querySelector(".west").addEventListener("click", function() 
    {
        movePlayer("west");
    });

    updateGameBoard();
    updateScore();
}

function showModal() // function som används för att skriva ut en ruta med text på sidan, kallar på functionen när alla katter har blivit räddade i checkEncounter()
{
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    var span = document.getElementsByClassName("close")[0];

    window.onclick = function(event) 
    {
        if (event.target == modal) 
        {
            modal.style.display = "none";
        }
    }
    // när man klickar på stängknappen stängs modalen
    span.onclick = function() 
    {
        modal.style.display = "none";
    }
}

window.onload = game;