window.onload = function() {
  let x = document.getElementById("sec-1");
  var c;
  function calcscroll(n, obj) {
    var b = obj.clientHeight;
    b = b + n;
    c = window.scrollY;
    return b;
  }
  var tree = document.querySelectorAll("div.row.level");
  // console.log(tree.length);
  for (var i = tree.length - 1, j = 0; i >= 0; i--, j++) {
    {
      console.log(tree[i]);
      tree[i].style.zIndex = i;
      console.log(j);
    }
  }
  var s0 = document.getElementById("empty");
  var s1 = document.getElementById("sec-1");
  var s2 = document.getElementById("sec-2");
  var s3 = document.getElementById("sec-3");
  var s4 = document.getElementById("sec-4");
  var s5 = document.getElementById("sec-5");
  var y = document.getElementById("middle");

  y.addEventListener("scroll", calcscroll);
  var lens = [];
  var links = document.querySelectorAll(".navlink a");
  window.addEventListener("scroll", function() {
    c = window.scrollY;
    lens[0] = 0;
    lens[1] = calcscroll(lens[0], s1);
    lens[2] = calcscroll(lens[1], s2);
    lens[3] = calcscroll(lens[2], s3);
    lens[4] = calcscroll(lens[3], s4);
    lens[5] = calcscroll(lens[4], s5);
    var t;
    if (c < lens[5])
      if (c < lens[4]) {
        if (c < lens[3]) {
          if (c < lens[2]) {
            if (c < lens[1]) t = 0;
            else t = 1;
          } else t = 2;
        } else t = 3;
      } else t = 4;
    else t = 5;
    for (var j = 0; j < links.length; j++) {
      if (j === t) links[j].className = "current";
      else links[j].className = "";
    }
  });
};
