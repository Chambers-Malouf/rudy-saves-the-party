// === Kaboom setup ===
kaboom({
  width: 640,
  height: 480,
  scale: 1,
  background: [135, 206, 235],
});

// === Load sprites ===
loadSprite("ann-room", "rooms/ann-room.png");
loadSprite("hallway", "rooms/hallway.png");
loadSprite("rudy-right-1", "Rudy/walk-right/rudy-walk-right1.png");
loadSprite("rudy-right-2", "Rudy/walk-right/rudy-walk-right2.png");

// === Starting Screen ===
scene("start", () => {
  add([
    text("Rudy Saves the Party", {
      size: 36,
      width: width() - 40,
      align: "center",
    }),
    pos(center().x, 100),
    anchor("center"),
  ]);

  const startBtn = add([
    text("▶ Start Game", { size: 24 }),
    pos(center().x, center().y + 40),
    area(),
    anchor("center"),
    "start-button",
  ]);

  startBtn.onClick(() => {
    go("ann-room");
  });

  onKeyPress("space", () => {
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
    rect(150, 90),
    pos(0, 185),
    area(),
    body({ isStatic: true }),
    z(-1),
  ]);
  // === table collider
  add([
    rect(85, 40),
    pos(10, 250),
    area(),
    body({ isStatic: true }),
    z(-1),
  ]);
  // === top wall collider
  add([
    rect(640, 10),
    pos(0, 70),
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
  scale(width() / sprite("hallway").width, height() / sprite("hallway").height),
  ]);
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
