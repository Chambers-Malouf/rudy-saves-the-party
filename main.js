// === Kaboom setup ===
kaboom({
  width: 640,
  height: 480,
  scale: 1,
  background: [135, 206, 235],
});

// === Load sprites ===
loadSprite("start-screen","assets/start-screen.png")
loadSprite("ann-room", "rooms/ann-room.png");
loadSprite("hallway", "rooms/hallway.png");
loadSprite("living-room", "rooms/living-room.png");
loadSprite("movie-room", "rooms/movie-room.png");
loadSprite("kitchen", "rooms/kitchen.png");
loadSprite("backyard", "rooms/backyard.png");
loadSprite("rudy-right-1", "Rudy/walk-right/rudy-walk-right1.png");
loadSprite("rudy-right-2", "Rudy/walk-right/rudy-walk-right2.png");

// === text bubbles ===
function showBubble(msg, posRef) {
  const padding = 8;
  const textSize = 16;
  const textWidth = 200;

  const txt = add([
    text(msg, { size: textSize, width: textWidth }),
    pos(posRef.x, posRef.y - 40),
    anchor("center"),
    z(101),
    color(255, 255, 255),
    "bubble",
  ]);

  const bg = add([
    rect(txt.width + padding * 2, txt.height + padding * 2),
    pos(txt.pos.x, txt.pos.y),
    anchor("center"),
    color(0, 0, 0),
    z(100),
    opacity(0.8),
    "bubble",
  ]);

  wait(2, () => {
    destroy(txt);
    destroy(bg);
  });
}

// === Starting Screen ===
scene("start", () => {
  add([
    sprite("start-screen"),
    pos(0, 0),
    scale(width() / 1024, height() / 1024),
  ]);

  const startBtn = add([
    area(),
    rect(250, 60),                    
    pos(center().x, 415),             
    anchor("center"),
    opacity(0),
    "start-button",
  ]);

  startBtn.onClick(() => {
    go("ann-room");
  });
});

// === Ann Room Scene ===
scene("ann-room", () => {
  add([
    sprite("ann-room"),
    pos(0, 0),
    scale(width() / 256, height() / 144),
  ]);

  const rudy = add([
    pos(200, 200),
    sprite("rudy-right-1"),
    scale(0.1),
    area(),
    body(),
    "rudy", 
    { flipped: false },
  ]);

  // === bed collider
  add([
    rect(20, 100),
    pos(0, 165),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    "bed",
  ]);

  // === table collider
  add([
    rect(85, 40),
    pos(10, 250),
    area(),
    body({ isStatic: true }),
    z(-1),
    "table",
  ]);
  // === bathroom door collider
  add([
    rect(20, 20),
    pos(165, 60),
    area(),
    body({ isStatic: true }),
    z(-1),
    "bathroom-door",
  ]);
  // === top wall collider
  add([
    rect(640, 10),
    pos(0, 60),
    area(),
    body({ isStatic: true }),
    z(-1),
  ]);
  // === bottom wall collider
  add([
    rect(640, 10),
    pos(0, 395),
    area(),
    body({ isStatic: true }),
    z(-1),
  ]);
  // === left wall collider
  add([
    rect(10, 640),
    pos(0, 0),
    area(),
    body({ isStatic: true }),
    z(-1),
  ]);
  // === right wall upper collider 
  add([
    rect(10, 200),
    pos(600, 0),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
    // === right wall lower collider 
  add([
    rect(10, 200),
    pos(600, 300),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === Door collider
  add([
    rect(32, 64),
    pos(600, 200),
    area(),
    body({ isStatic: true }),
    z(-1),
    "door", 
  ]);

  onKeyPress("space", () => {
  const bed = get("bed")[0];
  if (bed && rudy.pos.dist(bed.pos) < 150) {
    showBubble("I wonder where Goatie is?", rudy.pos);
  }
});
onKeyPress("space", () => {
  const bed = get("bathroom-door")[0];
  if (bed && rudy.pos.dist(bed.pos) < 100) {
    showBubble("I should explore the rest of the house instead", rudy.pos);
  }
});

  onCollide("rudy", "door", () => {
    go("hallway");
  });

  // === Movement and animation
  const SPEED = 120;
  let animTimer = 0;
  let animFrame = 1;

  onUpdate(() => {
    let moving = false;

    if (isKeyDown("left")) {
      rudy.move(-SPEED, 0);
      if (!rudy.flipped) {
        rudy.scale.x = -Math.abs(rudy.scale.x);
        rudy.flipped = true;
      }
      moving = true;
    }

    if (isKeyDown("right")) {
      rudy.move(SPEED, 0);
      if (rudy.flipped) {
        rudy.scale.x = Math.abs(rudy.scale.x);
        rudy.flipped = false;
      }
      moving = true;
    }

    if (isKeyDown("up")) {
      rudy.move(0, -SPEED);
      moving = true;
    }

    if (isKeyDown("down")) {
      rudy.move(0, SPEED);
      moving = true;
    }

    if (moving) {
      animTimer += dt();
      if (animTimer >= 0.2) {
        animFrame = animFrame === 1 ? 2 : 1;
        rudy.use(sprite(`rudy-right-${animFrame}`));
        animTimer = 0;
      }
    }
  });
});

// === Hallway Scene ===
scene("hallway", () => {
  add([
    sprite("hallway"),
    pos(0, 0),
    scale(width() / 512, height() / 288),
  ]);

  const rudy = add([
    pos(200, 200),
    sprite("rudy-right-1"),
    scale(0.1),
    area(),
    body(),
    "rudy", 
    { flipped: false },
  ]);

  // === bottom wall collider
  add([
    rect(250, 10),
    pos(200, 470),
    area(),
    body({ isStatic: true }),
    z(-1),
    "dad-room"
    ]);
  // === top wall collider
  add([
    rect(250, 10),
    pos(200, -20),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === jake door collider
  add([
    rect(10, 250),
    pos(160, 20),
    area(),
    body({ isStatic: true }),
    z(-1),
    "jake-room"
    ]);
  // === ann door collider
  add([
    rect(10, 50),
    pos(160, 300),
    area(),
    body({ isStatic: true }),
    z(-1),
    "ann-door"
    ]);
  // === bottom left wall collider
  add([
    rect(10, 100),
    pos(160, 375),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === right wall collider
  add([
    rect(10, 350),
    pos(450, 150),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === entrance bottom collider
  add([
    rect(100, 10),
    pos(450, 150),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === entrance bottom collider
  add([
    rect(100, 10),
    pos(450, 20),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === entrance to living room collider
  add([
    rect(10, 100),
    pos(550, 30),
    area(),
    body({ isStatic: true }),
    z(-1),
    "living-room-entrance",
    ]);
  onCollide("rudy", "ann-door", () => {
    go("ann-room");
  });
 onCollide("rudy", "living-room-entrance", () => {
    go("living-room");
  });
  
  // === movement
  const SPEED = 120;
  let animTimer = 0;
  let animFrame = 1;

  onUpdate(() => {
    let moving = false;

    if (isKeyDown("left")) {
      rudy.move(-SPEED, 0);
      if (!rudy.flipped) {
        rudy.scale.x = -Math.abs(rudy.scale.x);
        rudy.flipped = true;
      }
      moving = true;
    }

    if (isKeyDown("right")) {
      rudy.move(SPEED, 0);
      if (rudy.flipped) {
        rudy.scale.x = Math.abs(rudy.scale.x);
        rudy.flipped = false;
      }
      moving = true;
    }

    if (isKeyDown("up")) {
      rudy.move(0, -SPEED);
      moving = true;
    }

    if (isKeyDown("down")) {
      rudy.move(0, SPEED);
      moving = true;
    }

    if (moving) {
      animTimer += dt();
      if (animTimer >= 0.2) {
        animFrame = animFrame === 1 ? 2 : 1;
        rudy.use(sprite(`rudy-right-${animFrame}`));
        animTimer = 0;
      }
    }
    onKeyPress("space", () => {
    const jake = get("jake-room")[0];
    const dad = get("dad-room")[0];
    if (jake && rudy.pos.dist(jake.pos) < 300) {
        showBubble("Jake is probably playing games, I won't bother him.", rudy.pos);
    } else if (dad && rudy.pos.dist(dad.pos) < 200) {
        showBubble("I don't wanna disturb Bobby.", rudy.pos);
    }
    });
  });
});

// === Living Room Scene ===
scene("living-room", () => {
  add([
    sprite("living-room"),
    pos(0, 0),
    scale(width() / 256, height() / 144),
  ]);

  const rudy = add([
    pos(100, 100),
    sprite("rudy-right-1"),
    scale(0.1),
    area(),
    body(),
    "rudy", 
    { flipped: false },
  ]);
  // === hallway top collider
  add([
    rect(100, 10),
    pos(10, 80),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === hallway bottom collider
  add([
    rect(100, 10),
    pos(10, 200),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === left wall collider
  add([
    rect(10, 250),
    pos(90, 200),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === bottom left collider
  add([
    rect(250, 10),
    pos(90, 445),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === backyard left collider
  add([
    rect(10, 50),
    pos(320, 440),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === left wall collider
  add([
    rect(10, 90),
    pos(90, 0),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === top left collider
  add([
    rect(80, 10),
    pos(100, 30),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === top right collider
  add([
    rect(200, 10),
    pos(320, 30),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === top right right collider
  add([
    rect(10, 60),
    pos(535, 30),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === kitchen top collider
  add([
    rect(100, 10),
    pos(550, 80),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === kitchen bottom collider
  add([
    rect(100, 10),
    pos(550, 200),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === top right right collider
  add([
    rect(10, 60),
    pos(535, 30),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === right wall collider
  add([
    rect(10, 90),
    pos(535, 200),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === right bottom wall collider
  add([
    rect(10, 200),
    pos(535, 300),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // === wine door collider
  add([
    rect(10, 10),
    pos(535, 350),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    "wine-door"
    ]);
  // === bottom left collider
  add([
    rect(120, 10),
    pos(450, 445),
    area(),
    body({ isStatic: true }),
    color(255,0,0),
    ]);
  // couch collider
  add([
    rect(10,60),
    pos(150,240),
    area(),
    body({isStatic: true}),
    color(255,0,0),
    "couch",
    ]);
  // tv collider
  add([
    rect(10,60),
    pos(310,240),
    area(),
    body({isStatic: true}),
    color(255,0,0),
    ]);
  // hallway collider
  add([
    rect(10,60),
    pos(10,115),
    area(),
    body({isStatic: true}),
    color(255,0,0),
    "hallway-door",
    ]);
  // kitchen collider
  add([
    rect(10,60),
    pos(600,115),
    area(),
    body({isStatic: true}),
    color(255,0,0),
    "kitchen-door",
    ]);
  // backyard collider
  add([
    rect(10,10),
    pos(385,450),
    area(),
    body({isStatic: true}),
    color(255,0,0),
    "backyard-door",
    ]);
  // movie room collider
  add([
    rect(10,10),
    pos(245,15),
    area(),
    body({isStatic: true}),
    color(255,0,0),
    "movie-room-door",
    ]);

  onCollide("rudy", "hallway-door", () => {
    go("hallway");
  });
  onCollide("rudy", "movie-room-door", () => {
    go("movie-room");
  });
  onCollide("rudy", "kitchen-door", () => {
    go("kitchen");
  });
  onCollide("rudy", "backyard-door", () => {
    go("backyard");
  });
  // === movement
  const SPEED = 120;
  let animTimer = 0;
  let animFrame = 1;

  onUpdate(() => {
    let moving = false;

    if (isKeyDown("left")) {
      rudy.move(-SPEED, 0);
      if (!rudy.flipped) {
        rudy.scale.x = -Math.abs(rudy.scale.x);
        rudy.flipped = true;
      }
      moving = true;
    }

    if (isKeyDown("right")) {
      rudy.move(SPEED, 0);
      if (rudy.flipped) {
        rudy.scale.x = Math.abs(rudy.scale.x);
        rudy.flipped = false;
      }
      moving = true;
    }

    if (isKeyDown("up")) {
      rudy.move(0, -SPEED);
      moving = true;
    }

    if (isKeyDown("down")) {
      rudy.move(0, SPEED);
      moving = true;
    }

    if (moving) {
      animTimer += dt();
      if (animTimer >= 0.2) {
        animFrame = animFrame === 1 ? 2 : 1;
        rudy.use(sprite(`rudy-right-${animFrame}`));
        animTimer = 0;
      }
    }
  });
    onKeyPress("space", () => {
    const wine = get("wine-door")[0];
    if (wine && rudy.pos.dist(wine.pos) < 300) {
        showBubble("I definitely don't need any wine, better check elsewhere.", rudy.pos);
    } 
});
});

// === Living Room Scene ===
scene("movie-room", () => {
  add([
    sprite("movie-room"),
    pos(0, 0),
    scale(width() / 256, height() / 144),
  ]);

  const rudy = add([
    pos(250, 250),
    sprite("rudy-right-1"),
    scale(0.1),
    area(),
    body(),
    "rudy", 
    { flipped: false },
  ]);
// movie room collider
  add([
    rect(10,10),
    pos(245,15),
    area(),
    body({isStatic: true}),
    color(255,0,0),
    "movie-room-door",
    ]);

  onCollide("rudy", "living-room-door", () => {
    go("living-room");
  });
  // === movement
  const SPEED = 120;
  let animTimer = 0;
  let animFrame = 1;

  onUpdate(() => {
    let moving = false;

    if (isKeyDown("left")) {
      rudy.move(-SPEED, 0);
      if (!rudy.flipped) {
        rudy.scale.x = -Math.abs(rudy.scale.x);
        rudy.flipped = true;
      }
      moving = true;
    }

    if (isKeyDown("right")) {
      rudy.move(SPEED, 0);
      if (rudy.flipped) {
        rudy.scale.x = Math.abs(rudy.scale.x);
        rudy.flipped = false;
      }
      moving = true;
    }

    if (isKeyDown("up")) {
      rudy.move(0, -SPEED);
      moving = true;
    }

    if (isKeyDown("down")) {
      rudy.move(0, SPEED);
      moving = true;
    }

    if (moving) {
      animTimer += dt();
      if (animTimer >= 0.2) {
        animFrame = animFrame === 1 ? 2 : 1;
        rudy.use(sprite(`rudy-right-${animFrame}`));
        animTimer = 0;
      }
    }
  });
    onKeyPress("space", () => {
    const balloons = get("balloons")[0];
    if (balloons && rudy.pos.dist(balloons.pos) < 300) {
        showBubble("I got the balloons!", rudy.pos);
    } 
});
});
// === End Scene ===
scene("end", () => {
  add([
    text("Happy Birthday Ann!", { size: 32 }),
    pos(40, 40),
  ]);
});

// === Start Game ===
go("start");
