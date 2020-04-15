var items = [];
for (var i = 1; i < 21; i++) {
  items.push(i);
}
var myArray = [];
for (var i = 0; i < 20; i++) {
  myArray.push(i);
}
shuffle(items);

var scores = [];
putScores();
function getscores() {
  let scores;
  if (localStorage.getItem("scores") === null) {
    scores = [];
  } else {
    scores = JSON.parse(localStorage.getItem("scores"));
  }
  return scores;
}

function putScores() {
  scores = getscores();
  scores.sort();
  var list = document.querySelector(".scores");
  list.innerHTML = "";
  var l = 5 < scores.length ? 5 : scores.length;
  for (var i = 0; i < l; i++) {
    var min = Math.floor(scores[i] / 60000);
    var sec = Math.round((scores[i] - min * 60000) / 1000);
    var sc = document.createElement("li");
    sc.className = "score";
    sc.innerHTML = `${min} mins : ${sec} secs`;
    list.appendChild(sc);
  }
}

var box = document.getElementById("box");
var c = 0;
var f = 0;
var lvlcount = 40;
box.innerHTML = "<h1 class='start'>Click To Start</h1>";
box.addEventListener("click", start);

function start() {
  box.innerHTML = "<h1 class='start'>3</h1>";
  setTimeout(() => {
    box.innerHTML = "<h1 class='start'>2</h1>";
  }, 1000);
  setTimeout(() => {
    box.innerHTML = "<h1 class='start'>1</h1>";
  }, 2000);
  setTimeout(() => {
    draw();
    startButton();
  }, 3200);
  box.removeEventListener("click", start);
}
var startTime;

function startButton() {
  startTime = Date.now();
}
var resbtn = document.querySelector(".reset");
resbtn.addEventListener("click", e => {
  var scores = [];
  localStorage.setItem("scores", JSON.stringify(scores));
  putScores();
});
function stopButton() {
  if (startTime) {
    var endTime = Date.now();
    var difference = endTime - startTime;
    var msg = "";
    const scores = getscores();
    if (difference < scores[0]) {
      msg = "New HighScore<br>";
    }
    scores.push(difference);
    localStorage.setItem("scores", JSON.stringify(scores));

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
    stopButton();
    return;
  }
  box.innerHTML = "";
  for (var j = 0; j < 4; j++) {
    var row = document.createElement("div");
    row.className = "row box-row";
    for (var l = 0; l < 5; l++) {
      var item = document.createElement("div");

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
        setTimeout(() => {
          draw();
        }, 100);
      }
    });
  });
}
