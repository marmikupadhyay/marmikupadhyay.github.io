var scores = [];
putScores();
var items = [];
var tapSound = document.getElementById("tap");
var startSound = document.getElementById("start");
var finishSound = document.getElementById("finish");

document.getElementById("diff").addEventListener("change", putScores);
function getscores() {
  let scores = [];
  var diff;
  for (var i = 0; i < 5; i++) {
    diff = i + 1;
    if (localStorage.getItem(`scores-${diff}`) === null) {
      scores[i] = [];
    } else {
      scores[i] = JSON.parse(localStorage.getItem(`scores-${diff}`));
    }
  }
  return scores;
}
function putScores() {
  diff = document.getElementById("diff").value;
  var difficulty = ["Easy", "Normal", "Intermediate", "Hard", "Expert"];
  scores = getscores();
  var l = [];
  var scbox = document.querySelector(".score-box");
  for (var i = 0; i < 5; i++) {
    scores[i].sort();
    l[i] = 5 < scores[i].length ? 5 : scores[i].length;
  }
  scbox.innerHTML = "<h1>High Scores</h1>";
  var k = diff - 1;
  // for (var k = 0; k < 5; k++) {
  var list = document.createElement("ul");
  list.className = "scores";
  list.innerHTML = `<li class='schead'>${difficulty[k]}</li>`;
  for (var i = 0; i < l[k]; i++) {
    var min = Math.floor(scores[k][i] / 60000);
    var sec = Math.round((scores[k][i] - min * 60000) / 1000);
    var sc = document.createElement("li");
    sc.className = "score";
    sc.innerHTML = `${min} mins : ${sec} secs`;
    list.appendChild(sc);
  }
  list.addEventListener("click", e => {});
  scbox.appendChild(list);
  // }
}

var box = document.getElementById("box");
var c;
var f;
var lvlcount = 40;
box.innerHTML = "<h1 class='start'>Click To Start</h1>";
box.addEventListener("click", start);

//restart the game
document.querySelector(".play-again").addEventListener("click", start);

//Starting Function
var startTime;

function start() {
  c = 0;
  f = 0;
  document.querySelector(".col-6").lastElementChild.className += " remove";
  items = [];
  for (var i = 1; i < 21; i++) {
    items.push(i);
  }
  shuffle(items);
  startSound.play();
  box.innerHTML = "<h1 class='start'>3</h1>";
  setTimeout(() => {
    box.innerHTML = "<h1 class='start'>2</h1>";
  }, 1000);
  setTimeout(() => {
    box.innerHTML = "<h1 class='start'>1</h1>";
  }, 2000);
  setTimeout(() => {
    draw();
    startTime = Date.now();
  }, 3200);

  lvlcount = 20 * diff;
  box.removeEventListener("click", start);
}

var resbtn = document.querySelector(".reset");
resbtn.addEventListener("click", e => {
  var scores = [];
  localStorage.setItem(`scores-${diff}`, JSON.stringify(scores));
  putScores();
});

//Where Game Stops

function stop() {
  finishSound.play();
  if (startTime) {
    var endTime = Date.now();
    var difference = endTime - startTime;
    var msg = "";
    const scores = getscores();
    if (difference < scores[diff - 1][0]) {
      msg = "New HighScore<br>";
    }
    scores[diff - 1].push(difference);
    localStorage.setItem(`scores-${diff}`, JSON.stringify(scores[diff - 1]));

    var end = document.createElement("h1");
    end.className = "";
    var min = Math.floor(difference / 60000);
    var sec = Math.round((difference - min * 60000) / 1000);
    end.innerHTML = `${msg} Time Taken: ${min} mins : ${sec} secs `;
    end.style.textAlign = "center";
    end.style.width = "100%";
    box.appendChild(end);
    putScores();
    startTime = null;
    document
      .querySelector(".col-6")
      .lastElementChild.classList.remove("remove");
  } else {
    alert("Click the Start button first");
  }
}

function shuffle(arra1) {
  var ctr = arra1.length,
    temp,
    index;

  // While there are elements in the array
  while (ctr > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
    ctr--;
    // And swap the last element with it
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}

function draw() {
  if (f === (20 * (20 - 1)) / 2) {
    box.innerHTML = "<h1 class='start'>Game Complete</h1>";
    stop();
    return;
  }
  box.innerHTML = "";
  for (var j = 0; j < 4; j++) {
    var row = document.createElement("div");
    row.className = "row box-row";
    for (var l = 0; l < 5; l++) {
      var item = document.createElement("div");

      item.style.background = `rgba(127,25,255,${
        (1 / lvlcount) * items[5 * j + l]
      })`;

      if (items[5 * j + l] > lvlcount) {
        item.className = "item hide";
        f++;
      } else {
        item.className = "item";
      }
      if (c === items[5 * j + l] - 1) {
        item.className += " allowed";
      }

      item.innerHTML = `
      <p class="item-info">${items[5 * j + l]}</p>`;
      row.appendChild(item);
    }
    box.appendChild(row);
  }
  var clickables = document.querySelectorAll(".item");
  clickables.forEach(clickable => {
    clickable.addEventListener("click", e => {
      if (e.target.classList.contains("item-info")) {
        if (e.target.parentElement.classList.contains("allowed")) {
          for (var i = 0; i < 20; i++) {
            if (items[i] == e.target.innerHTML) {
              items[i] += 20;
            }
          }
          //   items[(e.target.innerHTML - 1) % 20] += 20;
          c++;
          clickable.style.background = "#264B70";
          tapSound.play();
          setTimeout(() => {
            draw();
          }, 100);
        }
      } else if (
        e.target.classList.contains("item") &&
        e.target.classList.contains("allowed")
      ) {
        // items[(e.target.children[0].innerHTML - 1) % 20] += 20;
        for (var i = 0; i < 20; i++) {
          if (items[i] == e.target.children[0].innerHTML) {
            items[i] += 20;
          }
        }
        c++;
        clickable.style.background = "#264B70";
        tapSound.play();
        setTimeout(() => {
          draw();
        }, 100);
      }
    });
  });
}
