var audioFire = document.getElementById("fire-sound");
var audioBite = document.getElementById("bite-sound");
var audioChickenDeath = document.getElementById("chicken-death-sound");
var audioChickenEgg = document.getElementById("chicken-egg-sound");
var audioExplosion = document.getElementById("explosion-sound");
var audioEggBreak = document.getElementById("break-egg-sound");
var soundtrack = document.getElementById("soundtrack");
var audioSalut = document.getElementById("salut-sound");

var score = 0;
var points = {
  wing: 200,
  grilled: 500,
  combo: 1000,
  killChicken: 2000,
  hitMonster: 300,
  killMonster: 5000,
  egg: -5000
};

var fighterWidth = $(".fighter").width();

var bullets = [],
  gifts = [],
  eggs = [],
  move,
  bgPos = 0,
  rocketX,
  rotate,
  chielded = false,
  gameState = false,
  gameMode = false,
  lives = 3,
  monsterLives = 30,
  monsterHit = 0,
  level = 1,
  playerName = "Empty",
  playerGender = "male",
  finalPhase = false,
  moveBg;

var enemies = [
  { left: 200, top: 45, type: "chicken" },
  { left: 320, top: 45, type: "chicken" },
  { left: 440, top: 45, type: "chicken" },
  { left: 560, top: 45, type: "chicken" },
  { left: 680, top: 45, type: "chicken" },
  { left: 800, top: 45, type: "chicken" },
  { left: 920, top: 45, type: "chicken" },
  { left: 1040, top: 45, type: "chicken" },
  { left: 200, top: 145, type: "chicken" },
  { left: 320, top: 145, type: "chicken" },
  { left: 440, top: 145, type: "chicken" },
  { left: 560, top: 145, type: "chicken" },
  { left: 680, top: 145, type: "chicken" },
  { left: 800, top: 145, type: "chicken" },
  { left: 920, top: 145, type: "chicken" },
  { left: 1040, top: 145, type: "chicken" },
  { left: 200, top: 245, type: "chicken" },
  { left: 320, top: 245, type: "chicken" },
  { left: 440, top: 245, type: "chicken" },
  { left: 560, top: 245, type: "chicken" },
  { left: 680, top: 245, type: "chicken" },
  { left: 800, top: 245, type: "chicken" },
  { left: 920, top: 245, type: "chicken" },
  { left: 1040, top: 245, type: "chicken" }
];

var keys = {
  leftArrow: false,
  rightArrow: false,
  space: true
};

$(document).keydown(function(e) {
  if (gameState == true) {
    if (e.which == 37) {
      keys.leftArrow = true;
    }
    if (e.which == 39) {
      keys.rightArrow = true;
    }
    if (e.which == 32) {
      // Space
      if (keys.space == true) {
        var x = $(".fighter").offset();
        if (level == 1) {
          bullets.push({ top: x.top + 17, left: x.left + 35 });
        } else {
          bullets.push({ top: x.top + 17, left: x.left + 15 });
          bullets.push({ top: x.top + 17, left: x.left + 55 });
        }
        audioFire.load();
        audioFire.play();
        keys.space = false;
        setTimeout(function() {
          keys.space = true;
        }, 200);
      }
    }
  } else if (gameMode == false) {
    gameMode = true;
    $("#press-key").hide();
    soundtrack.play();
    $(".inputField").fadeIn();
  }
});
var moveLeft = setInterval(function() {
  if (keys.leftArrow == true) {
    if ($(".fighter").offset().left - 8 > 0) {
      rocketX = "-=8";
      rotate = "rotate(-8deg)";
      $(".fighter").css({ left: rocketX });
      $(".fighter").css({ transform: rotate });
    }
  }
}, 16.6);

var moveRight = setInterval(function() {
  if (keys.rightArrow == true) {
    if ($(".fighter").offset().left + fighterWidth + 8 < 1366) {
      rocketX = "+=8";
      rotate = "rotate(8deg)";
      $(".fighter").css({ left: rocketX });
      $(".fighter").css({ transform: rotate });
    }
  }
}, 16.6);

$(document).keyup(function(e) {
  if (e.which == 37) {
    keys.leftArrow = false;
    $(".fighter").css({ transform: "rotate(0)" });
  }
  if (e.which == 39) {
    keys.rightArrow = false;
    $(".fighter").css({ transform: "rotate(0)" });
  }
});

function makeEgg() {
  if (enemies.length > 0) {
    var idx = Math.floor(Math.random() * enemies.length);
    var throwPosTop = enemies[idx].type == "chicken" ? 45 : 170;
    var throwPosLeft = enemies[idx].type == "chicken" ? 40 : 170;
    var maxSpeed = level == 1 ? 15 : 10;
    var speed = Math.floor(Math.random() * (maxSpeed - 4)) + 4;
    eggs.push({
      left: enemies[idx].left + throwPosLeft,
      top: enemies[idx].top + throwPosTop,
      speed: speed
    });
    audioChickenEgg.volume = 0.5;
    audioChickenEgg.load();
    audioChickenEgg.play();
  }
}

function drawEggs() {
  document.getElementById("eggs").innerHTML = "";
  for (var i = 0; i < eggs.length; i++) {
    document.getElementById("eggs").innerHTML +=
      "<img src='images/egg-w.svg' class='egg' style='left:" +
      eggs[i].left +
      "px; top:" +
      eggs[i].top +
      "px'/>";
    if (chielded == false) {
      checkHit(eggs[i], $(".egg").width(), $(".egg").height(), eggs, {
        points: points.egg,
        audio: audioExplosion
      });
    }
  }
}

function moveEggs() {
  for (var i = 0; i < eggs.length; i++) {
    eggs[i].top = eggs[i].top + eggs[i].speed;
    if (eggs[i].top > 786) {
      eggs.splice(i, 1);
      audioEggBreak.load();
      audioEggBreak.play();
    }
  }
}

function drawLives() {
  document.querySelector(".hearts").innerHTML = "";
  for (let i = 0; i < lives; i++) {
    document.querySelector(".hearts").innerHTML +=
      "<i class='fa fa-heart'></i>";
  }
}

function rocketDeath() {
  chielded = true;
  //gameState = false;
  lives -= 1;
  explodeObject({
    left: $(".fighter").offset().left,
    top: $(".fighter").offset().top,
    type: "fighter"
  });
  $(".fighter").css({ display: "none" });
  if (lives == 0) {
    saveResults();
    showMessage("Game Over", "Good luck next time", 2500);
    ShowFame();
  } else {
    drawLives();
    setTimeout(function() {
      //gameState = true;
      $(".fighter")
        .css({ display: "block" })
        .addClass("chield");
      $(".fuel").css({ display: "none" });
    }, 3000);
    setTimeout(function() {
      chielded = false;
      $(".fighter").removeClass("chield");
      $(".fuel").css({ display: "block" });
    }, 6000);
  }
}

function drawBullets() {
  var bulletColor = playerGender == "male" ? 1 : 2;
  document.getElementById("bullets").innerHTML = "";
  for (var i = 0; i < bullets.length; i++) {
    document.getElementById("bullets").innerHTML +=
      "<img src='images/fire-" +
      bulletColor +
      ".svg' class='bullet' id='fire' style='left:" +
      bullets[i].left +
      "px; top:" +
      bullets[i].top +
      "px'/>";
    checkCollision(bullets[i]);
  }
}

function moveBullets() {
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].top = bullets[i].top - 8;
    if (bullets[i].top < 0) {
      bullets.splice(i, 1);
    }
  }
}

function drawEnemies() {
  document.getElementById("chickens").innerHTML = "";
  var chickenColor;
  if (level == 1) {
    chickenColor = playerGender == "male" ? 4 : 6;
  } else {
    chickenColor = playerGender == "male" ? 2 : 3;
  }
  for (var i = 0; i < enemies.length; i++) {
    document.getElementById("chickens").innerHTML +=
      '<img src="images/c' +
      chickenColor +
      '.png" class="' +
      enemies[i].type +
      ' enemy" alt=""  style="left:' +
      enemies[i].left +
      "px; top:" +
      enemies[i].top +
      'px"/>';
  }
}

var enemyMoveFactor = 0;
var enemyMoveFlag = true;
function moveEnemies(left, right) {
  if (enemyMoveFlag == true) {
    enemyMoveFactor++;
    if (enemyMoveFactor >= right) {
      enemyMoveFlag = false;
    }
  } else {
    enemyMoveFactor--;
    if (enemyMoveFactor <= left) {
      enemyMoveFlag = true;
    }
  }
  for (var i = 0; i < enemies.length; i++) {
    if (enemyMoveFlag) {
      enemies[i].left = enemies[i].left + 2;
    } else {
      enemies[i].left = enemies[i].left - 2;
    }
  }
}

function checkCollision(bullet) {
  var bulletLeft = bullet.left;
  var bulletTop = bullet.top;
  var bulleRight = bulletLeft + $("#fire").width();
  var enemyWidth = $(".enemy").width();
  var enemyHeight = $(".enemy").height();

  for (var i = 0; i < enemies.length; i++) {
    if (
      bulletTop <= enemies[i].top + enemyHeight &&
      bulletTop >= enemies[i].top
    ) {
      if (
        (bulletLeft >= enemies[i].left &&
          bulletLeft <= enemies[i].left + enemyWidth) ||
        (bulleRight >= enemies[i].left &&
          bulleRight <= enemies[i].left + enemyWidth)
      ) {
        bullets.splice(bullets.indexOf(bullet), 1);
        audioChickenDeath.load();
        audioChickenDeath.play();
        var throwPosTop = enemies[i].type == "chicken" ? 45 : 170;
        var throwPosLeft = enemies[i].type == "chicken" ? 40 : 170;
        var spd = Math.floor(Math.random() * (10 - 4)) + 4;
        gifts.push({
          left: enemies[i].left + throwPosLeft,
          top: enemies[i].top + throwPosTop,
          speed: spd
        });

        if (enemies[i].type == "chicken") {
          score += points.killChicken;
          explodeObject({
            left: enemies[i].left,
            top: enemies[i].top,
            type: enemies[i].type
          });
          enemies.splice(i, 1);
          if (enemies.length > 16) {
            drawEnemies();
          }
        } else {
          score += points.hitMonster;
          monsterHit++;
          $(".progress-bar").width((monsterHit / monsterLives) * 100 + "%");
          if (monsterHit == monsterLives) {
            explodeObject({
              left: enemies[i].left,
              top: enemies[i].top,
              type: enemies[i].type
            });
            enemies.splice(i, 1);
            score += points.killMonster;
          }
        }

        $(".points").text(score);
      }
    }
  }
}

function checkHit(object, objectWidth, objectHeight, objectsArr, state) {
  var objectLeft = object.left;
  var objectBottom = object.top + objectHeight;
  var objectTop = object.top;
  var objectRight = objectLeft + objectWidth;

  var rocketTop = $(".fighter").offset().top;
  var rocketLeft = $(".fighter").offset().left;
  var rocketBottom = rocketTop + $(".fighter").height();
  var rocketRight = rocketLeft + $(".fighter").width();

  if (objectBottom >= rocketTop && objectTop <= rocketBottom) {
    if (
      (objectLeft >= rocketLeft && objectLeft <= rocketRight) ||
      (objectRight >= rocketLeft && objectRight <= rocketRight)
    ) {
      objectsArr.splice(objectsArr.indexOf(object), 1);
      score += state.points;
      score = score > 0 ? score : 0;
      $(".points").text(score);
      state.audio.load();
      state.audio.play();
      if (state.points < 0) {
        rocketDeath();
      }
    }
  }
}

function explodeObject(object) {
  var width;
  if (object.type == "chicken") {
    width = $(".chicken").width();
  } else if (object.type == "fighter") {
    width = $(".fighter").width();
  } else {
    width = $(".monster").width();
  }
  document.getElementById("explosions").innerHTML +=
    '<img src="images/exp.gif" class="explosion" alt=""  style="left:' +
    object.left +
    "px; top:" +
    object.top +
    "px; width:" +
    width +
    'px"/>';
  setTimeout(function() {
    document.getElementById("explosions").innerHTML = "";
  }, 1000);
}

function drawGift() {
  document.getElementById("gifts").innerHTML = "";
  for (var i = 0; i < gifts.length; i++) {
    document.getElementById("gifts").innerHTML +=
      "<img src='images/food-" +
      level +
      ".svg' alt='' class='food-" +
      level +
      "' style='left:" +
      gifts[i].left +
      "px; top:" +
      gifts[i].top +
      "px'/>";
    checkHit(
      gifts[i],
      $(".food-" + level).width(),
      $(".food-" + level).height(),
      gifts,
      {
        points: points.wing,
        audio: audioBite
      }
    );
  }
}

function moveGifts() {
  for (var i = 0; i < gifts.length; i++) {
    gifts[i].top = gifts[i].top + gifts[i].speed;
    if (gifts[i].top > 786) {
      gifts.splice(i, 1);
    }
  }
}

function showMessage(msg, sub_msg, msg_time = 2500) {
  $("#messages").fadeIn();
  $(".message").text(msg);
  $(".sub-message").text(sub_msg);
  setTimeout(() => {
    $("#messages").fadeOut();
  }, msg_time);
}

// //////////////////////////////////////////////
$(".entry-form").on("submit", function(e) {
  e.preventDefault();
  playerName = $('input[name="username"]').val() || playerName;
  playerGender = $("input[name='gender']:checked").val() || playerGender;

  $(".inputField").hide();
  $(".game-menu").fadeIn();
});

$("#btn-start").click(function() {
  $(".game-screen").show(800);
  // gameState = true;
  soundtrack.pause();
  audioSalut.play();
  $(".game-menu, .logo").fadeOut();
  showMessage("Get Ready", "Wave 1");
  $(".fighter").fadeIn();
  // $("*").css({ cursor: "none" });
  var positionBG = 0;
  var moveBg = setInterval(function() {
    $("body").css("background-position", "0 " + positionBG + "px");
    positionBG += 20;
    if (positionBG == 4000) {
      clearInterval(moveBg);
      initGame();
    }
  }, 16.6);
});

function Game() {
  drawBullets();
  moveBullets();
  drawGift();
  moveGifts();
  if (enemies.length <= 16) {
    if (level == 1) {
      moveEnemies(-90, 100);
    } else {
      moveEnemies(-250, 250);
    }
    drawEnemies();
  }
  if (
    enemies.length == 0 &&
    gifts.length == 0 &&
    eggs.length == 0 &&
    bullets.length == 0 &&
    level == 1
  ) {
    levelTwo();
  }
  if (
    enemies.length == 0 &&
    gifts.length == 0 &&
    eggs.length == 0 &&
    bullets.length == 0 &&
    level == 2 &&
    finalPhase == true
  ) {
    finalizeGame();
    return;
  }
  drawEggs();
  moveEggs();
  bgPos += 2;
  $("body").css("background-position", "0 " + bgPos + "px");
  setTimeout(Game, 11.36);
}

function initGame() {
  gameState = true;
  $("#result").fadeIn();
  setInterval(function() {
    makeEgg();
  }, 1000);
  drawEnemies();
  Game();
}
function createMonster() {
  enemies.push({ left: 506, top: 45, type: "monster" });
  enemyMoveFactor = 0;
  enemyMoveFlag = true;
}

function levelTwo() {
  level = 2;
  showMessage("Excellent Work", "", 1500);
  setTimeout(() => {
    showMessage("Watch out", "Wave 2", 2500);
    $("body").css("background-image", "url(images/bg-3.jpg)");
    lives = 3;
    drawLives();
    setTimeout(() => {
      $(".progress").fadeIn();
      createMonster();
      finalPhase = true;
    }, 2600);
  }, 1600);
}

function finalizeGame() {
  saveResults();
  finalPhase = false;
  level = -1;
  $(".progress").fadeOut();
  $("#result").fadeOut();
  showMessage("Brilliant", "You saved the world", 3000);
  // fireworks
  $("#fireworks").fireworks({
    sound: false,
    opacity: 0.2,
    width: "100%",
    height: "100%"
  });
  setTimeout(() => {
    // $("#fireworks").fadeOut();
    // showMessage("Hall of fame", "// to be added", 3500);
    ShowFame();
  }, 1600);
}

////////////////////////////////////////////////////////////////////////////////////////////////
$("#btn-credits").on("click", function() {
  let startScreen = $(".start-screen");
  let credits = $(".credits");
  let back = $(".arrow-back");
  setInterval(function() {
    back.fadeIn(1000).fadeOut(1000);
  }, 2000);
  startScreen.find(".game-menu, .logo").hide(1000);
  credits.fadeIn(3000);
  let positionBG = 0;
  moveBg = setInterval(function() {
    $("body").css("background-position", "0 " + positionBG + "px");
    positionBG += 1;
  }, 16.6);
});

function backToStart(e) {
  if (gameState == false) {
    e.preventDefault();
  }
  clearInterval(moveBg);
  let startScreen = $(".start-screen");
  let credits = $(".credits");
  let fame = $(".fame");
  credits.hide(400);
  fame.hide(400);
  startScreen.find(".game-menu, .logo").show(800);
}

function saveResults() {
  var prevScore = localStorage.getItem(`user-${playerName}`);
  var newScore = score > prevScore ? score : prevScore;
  localStorage.setItem(`user-${playerName}`, newScore);
}

function getResults() {
  let players = Object.entries(localStorage);
  let sortedPlayers = players.sort((a, b) => {
    return b[1] - a[1];
  });
  let playersArr = [];
  let scoreArr = [];
  let modPlayersArr = [];
  for (const player in sortedPlayers) {
    [playersArr[player], scoreArr[player]] = sortedPlayers[player];
  }
  for (const player in playersArr) {
    if (!playersArr[player].startsWith("user")) {
      playersArr.splice(player, 1);
      scoreArr.splice(player, 1);
    }
    modPlayersArr.push(playersArr[player].split("-")[1]);
  }
  return { modPlayersArr, scoreArr };
}

function ShowFame() {
  let startScreen = $(".start-screen");
  let gameScreen = $(".game-screen");
  let fame = $(".fame");
  let back = $(".arrow-back");
  let table = $(".fame-table");
  if (gameState == true) {
    clearInterval(moveBg);
  }

  setInterval(function() {
    back.fadeIn(1000).fadeOut(1000);
  }, 2000);
  startScreen.find(".game-menu, .logo").hide(800);
  gameScreen.hide(800);
  fame.fadeIn(1000);
  let { modPlayersArr: playersArr, scoreArr } = getResults();

  let arr = [];
  for (let i = 0; i < 10; i++) {
    if (playersArr[i] != undefined) {
      arr.push(playersArr[i]);
      arr.push(scoreArr[i]);
    } else {
      arr.push("----");
    }
  }
  $.each(table.find("tbody tr td:not(:first-child)"), function(index, el) {
    $(el).text(arr[index]);
  });
  let activeEl = playersArr.indexOf(playerName);
  $($(".fame-table").find("tbody tr")[activeEl]).addClass("active");
  if (gameState != true) {
    let positionBG = 0;
    moveBg = setInterval(function() {
      $("body").css("background-position", "0 " + positionBG + "px");
      positionBG += 1;
    }, 16.6);
  }
}
$("#btn-fame").on("click", ShowFame);

function resetScore() {
  let table = $(".fame-table");
  table.find("tbody tr td:not(:first-child)").text("----");
  localStorage.clear();
}
