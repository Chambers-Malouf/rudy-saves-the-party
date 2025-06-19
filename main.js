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
  // Background start screen image (1024x1024 scaled down)
  add([
    sprite("start-screen"),
    pos(0, 0),
    scale(width() / 1024, height() / 1024),
  ]);

  // Invisible clickable button placed over the "START GAME" part
  const startBtn = add([
    area(),
    rect(250, 60),                    // matches the black button size
    pos(center().x, 415),             // vertical position aligned with image
    anchor("center"),
    opacity(0),
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
  if (bed && rudy.pos.dist(bed.pos) < 30) {
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
