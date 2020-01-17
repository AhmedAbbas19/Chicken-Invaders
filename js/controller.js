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
