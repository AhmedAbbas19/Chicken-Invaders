var score = 0;
var points = {
  wing: 200,
  grilled: 500,
  combo: 1000,
  kill: 2000,
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
  lives = 3,
  playerName = "Empty",
  playerGender = "male";

var enemies = [
  { left: 200, top: 45 },
  { left: 320, top: 45 },
  { left: 440, top: 45 },
  { left: 560, top: 45 },
  { left: 680, top: 45 },
  { left: 800, top: 45 },
  { left: 920, top: 45 },
  { left: 1040, top: 45 },
  { left: 200, top: 145 },
  { left: 320, top: 145 },
  { left: 440, top: 145 },
  { left: 560, top: 145 },
  { left: 680, top: 145 },
  { left: 800, top: 145 },
  { left: 920, top: 145 },
  { left: 1040, top: 145 },
  { left: 200, top: 245 },
  { left: 320, top: 245 },
  { left: 440, top: 245 },
  { left: 560, top: 245 },
  { left: 680, top: 245 },
  { left: 800, top: 245 },
  { left: 920, top: 245 },
  { left: 1040, top: 245 }
  // { left: 200, top: 345 },
  // { left: 320, top: 345 },
  // { left: 440, top: 345 },
  // { left: 560, top: 345 },
  // { left: 680, top: 345 },
  // { left: 800, top: 345 },
  // { left: 920, top: 345 },
  // { left: 1040, top: 345 }
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
        bullets.push({ top: x.top + 17, left: x.left + 35 });
        // bullets.push({ top: x.top + 17, left: x.left + 15 });
        // bullets.push({ top: x.top + 17, left: x.left + 55 });
        audioFire.load();
        audioFire.play();
        keys.space = false;
        setTimeout(function() {
          keys.space = true;
        }, 200);
      }
    }
  } else {
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
    var spd = Math.floor(Math.random() * (15 - 4)) + 4;
    eggs.push({
      left: enemies[idx].left + 40,
      top: enemies[idx].top + 40,
      speed: spd
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

function rocketDeath() {
  chielded = true;
  lives -= 1;
  explodeObject({
    left: $(".fighter").offset().left,
    top: $(".fighter").offset().top
  });
  $(".fighter").css({ display: "none" });
  if (lives == 0) {
    alert("Game Over");
    saveResults();
  } else {
    document.querySelector(".hearts").innerHTML = "";
    for (let i = 0; i < lives; i++) {
      document.querySelector(".hearts").innerHTML +=
        "<i class='fa fa-heart'></i>";
    }
    setTimeout(function() {
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
  var chickenColor = playerGender == "male" ? 4 : 6;
  document.getElementById("chickens").innerHTML = "";
  for (var i = 0; i < enemies.length; i++) {
    document.getElementById("chickens").innerHTML +=
      '<img src="images/c' +
      chickenColor +
      '.png" class="chicken" alt=""  style="left:' +
      enemies[i].left +
      "px; top:" +
      enemies[i].top +
      'px"/>';
  }
}

var factor = 0;
var flag = true;
function moveEnemies() {
  if (flag == true) {
    factor++;
    if (factor >= 100) {
      flag = false;
    }
  } else {
    factor--;
    if (factor <= -90) {
      flag = true;
    }
  }
  for (var i = 0; i < enemies.length; i++) {
    if (flag) {
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
  var enemyWidth = $(".chicken").width();
  var enemyHeight = $(".chicken").height();

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
        explodeObject({ left: enemies[i].left, top: enemies[i].top });
        audioChickenDeath.load();
        audioChickenDeath.play();
        var spd = Math.floor(Math.random() * (10 - 4)) + 4;
        gifts.push({
          left: enemies[i].left + 40,
          top: enemies[i].top + 20,
          speed: spd
        });
        enemies.splice(i, 1);
        score += points.kill;
        $(".points").text(score);
        drawEnemies();
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
      $(".points").text(score);
      state.audio.load();
      state.audio.play();
      if (state.points < 0) {
        rocketDeath();
      }
    }
  }
}
function explodeObject(pos) {
  document.getElementById("explosions").innerHTML +=
    '<img src="images/exp.gif" class="explosion" alt=""  style="left:' +
    pos.left +
    "px; top:" +
    pos.top +
    'px"/>';
  setTimeout(function() {
    document.getElementById("explosions").innerHTML = "";
  }, 1000);
}

function throwGift() {
  document.getElementById("gifts").innerHTML = "";
  for (var i = 0; i < gifts.length; i++) {
    document.getElementById("gifts").innerHTML +=
      "<img src='images/food-4.svg' alt='' class='wing' style='left:" +
      gifts[i].left +
      "px; top:" +
      gifts[i].top +
      "px'/>";
    checkHit(gifts[i], $(".wing").width(), $(".wing").height(), gifts, {
      points: points.wing,
      audio: audioBite
    });
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

// //////////////////////////////////////////////
$("#btn-uname").click(function() {
  playerName = $('input[name="username"]').val();
  playerGender = $("input[name='gender']:checked").val() || playerGender;

  $(".inputField").hide();
  $(".game-menu").fadeIn();
});

$("#btn-start").click(function() {
  gameState = true;
  soundtrack.pause();
  audioSalut.play();
  $(".start-screen__content").fadeOut();
  $(".fighter").fadeIn();
  $("*").css({ cursor: "none" });
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
  throwGift();
  moveGifts();
  if (enemies.length <= 16) {
    moveEnemies();
    drawEnemies();
  }
  drawEggs();
  moveEggs();
  bgPos += 2;
  $("body").css("background-position", "0 " + bgPos + "px");
  setTimeout(Game, 11.36);
}

function initGame() {
  $("#result").fadeIn();
  setInterval(function() {
    makeEgg();
  }, 1000);
  drawEnemies();
  Game();
}
