const bugImages = ["bug1.png", "bug2.png", "bug3.png", "bug4.png"];
let gameDiv = document.getElementById("gameDiv");
let countdownSpan = document.getElementById("countdownSpan");
let scoreSpan = document.getElementById("scoreSpan");
let countdown = 10, score = 0;
let startTime;

function gameOver() {
    const scoresURL = "http://localhost:3000/scores";

const newData = {
    name: playerName,
    score: score,
  }
  
  const postRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  }

    // This is the function that gets called when the game is over.
    // Update this to post the new score to the server.
    window.alert("You squashed " + score + " bugs!");
//POST
    fetch(scoresURL, postRequestOptions)      // fetch() defaults to the GET method, so you don't have to supply the options argument as you will for POST and other request methods. Because a network request can take a while, fetch() will return a "promise".
    .then(response => response.json())       // This then() call waits for the above promise to be fulfilled and then takes the response body which fetch() has received from our Express server (a JSON string), and parses it into a JavaScript object we can work with more effectively. Since this too could take a while, if the JSON string is very large, this also returns a "promise".

    .then(scores => {                        // This then() call waits for the above promise to be fulfilled. Then it receives the data (in this case the scores array we've just converted from the JSON string). I'm going to call this data what it means to me: "scores". But developers will often name this parameter something more generic, like "data".

      // Maybe do some things to/with the scores array. This is a good place to do that.
    // And finally display it on the page.
    })
    .catch(error => {
      console.log("A network error has occurred when attempting to perform the POST request:", error)
    });



const getRequestButton = document.getElementById("showScores");
getRequestButton.addEventListener("click", event => 
    fetch(scoresURL) //GET REQUEST
    .then(response => response.json())
      .then(scores => {
        console.log(scores)
        var div = document.getElementById('ash');
        
        scores.forEach(element => {
            let div2 = document.createElement('div');
        
            console.log(scores);
            
            let text = document.createTextNode(element.name + ' ' + element.score);
            
            div2.appendChild(text);
            div.appendChild(div2);
        });
         
      })
    .catch (error => {
        console.log("A network error has occurred when attempting to perform the GET request:", error)
    })
)}



function playGame() {
    playerName = document.getElementById("playerName").value;
    console.log(playerName);
    if(playerName.length<3) {
        alert("You must enter your name before playing.");
        return;
    }    
    document.getElementById("startButton").style.display = "none";

    startTime = Date.now();
    score = 0;
    onTick();
}

function bugholeHTML(left, top, imgUrl) {
    return `
    <div class="bugOuter" style="left: ${left}px; top: ${top}px;">
        <div class="bugHole"></div>
        <div class="bug" style="background-image: url('${imgUrl}')"></div>
    </div>`;
}

for(let row = 0; row < 4; row++) {
    for(let column = 0; column < 4; column++) {
        let bugImg = bugImages[Math.floor(Math.random()*bugImages.length)];
        gameDiv.innerHTML += bugholeHTML(column*100, row*90, bugImg);
    }
}
const bugs = document.getElementsByClassName("bug");

for(let i = 0; i<bugs.length; i++) {
    bugs[i].onclick = splat;
}

function splat(event) {
    let obj = event.currentTarget;
    if(!obj.classList.contains("splat")) {
        obj.classList.add("splat");
        score ++;
        setTimeout(function() {
            obj.classList.remove("splat")
        }, 2000);
    }
}

function animate(obj) {
    obj.style.top = "0px";
    obj.classList.add("popup");
    setTimeout(function() {
        obj.classList.remove("popup");
        obj.style.top = "70px";
        obj.classList.add("hideagain");
        setTimeout(function() {
            obj.classList.remove("hideagain");
        }, 1500);
    }, 2000);
}

function onTick() {
    let elapsed = (Date.now() - startTime)/1000;
    //console.log(elapsed);
    countdown = 20 - Math.floor(elapsed);
    if(countdown >= 0) {
        countdownSpan.innerHTML = countdown;
        scoreSpan.innerHTML = score;

        // start animations
        for(let i = 0; i < bugs.length; i++) {
            if(elapsed < 19.0 && Math.floor(Math.random()*16 < 0.1)) {
                if(!bugs[i].classList.contains("popup") && !bugs[i].classList.contains("hideagain")) {
                    console.log("animating " + i);
                    animate(bugs[i]);    
                }
            }
        }
        setTimeout(onTick, 50);
    } else {
        document.getElementById("startButton").style.display = "inline-block";
        gameOver();
    }
}

document.getElementById("startButton").onclick = playGame;