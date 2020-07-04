function solveq1() {
  var nos0 = document.getElementById("zero").value;
  var nos1 = document.getElementById("one").value;
  if (nos1 == undefined || nos0 == undefined) {
    nos1 = nos0 = 0;
  }
  var total = Number.parseInt(nos0) + Number.parseInt(nos1);
  var answer = combi(total, nos0);
  if (nos0 == 0 && nos1 == 0) {
    answer = 0;
  }
  document.getElementById(
    "answer"
  ).innerHTML = `The Total Number of Bit Strings that can be formed using ${nos0} Zero's and ${nos1} One's is  
  <h4 class="center">${answer}</h4>
  `;
}

function combi(n, k) {
  var ans = 1;
  k = k > n - k ? n - k : k;
  var j = 1;
  for (; j <= k; j++, n--) {
    if (n % j == 0) {
      ans *= n / j;
    } else if (ans % j == 0) {
      ans = (ans / j) * n;
    } else {
      ans = (ans * n) / j;
    }
  }
  return ans;
}

function solveq2() {
  var a0 = document.getElementById("first-term").value;
  a0 = Number.parseInt(a0);
  var a1 = document.getElementById("second-term").value;
  a1 = Number.parseInt(a1);

  var answer2 = document.getElementById("answer2");
  answer2.innerHTML = "";
  var ans = [];
  ans[1] = a0;
  ans[2] = a1;
  for (var i = 3; i < 7; i++) {
    ans[i] = recusive(i);
  }
  answer2.innerHTML += `
    The Value of the first six terms for the given initial condition is:- </br>
    a<sub>0</sub> = ${ans[1]} </br>
    a<sub>1</sub> = ${ans[2]} </br>
    a<sub>2</sub> = ${ans[3]} </br>
    a<sub>3</sub> = ${ans[4]} </br>
    a<sub>4</sub> = ${ans[5]} </br>
    a<sub>5</sub> = ${ans[6]} </br>
  `;

  function recusive(n) {
    if (n < 1) {
      return;
    }
    if (n == 1) {
      return a0;
    }
    if (n == 2) {
      return a1;
    } else {
      return recusive(n - 1) - recusive(n - 2);
    }
  }
}
