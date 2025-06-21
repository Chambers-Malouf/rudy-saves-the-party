// === Kaboom setup ===
kaboom({
  width: 640,
  height: 480,
  scale: 1,
  background: [0,0,0],
  crisp:true,
});
//layers(["bg", "obj", "ui"], "obj");


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
loadSprite("balloons", "assets/balloons.png");
loadSprite("tv-on-stand", "assets/tv-on-stand.png");
loadSprite("gift","assets/gift.png");
loadSprite("cake","assets/cake.png");
loadSprite("table-empty", "assets/table-empty.png");
loadSprite("table-full", "assets/table-full.png");
loadSprite("final-image","assets/final-image.png");

// === checklist ===
let checklistUI;
const checklist = {
balloons: false,
cake: false,
gift: false,
};
// === checklist ===
function getChecklistText() {
  return `Items Needed:
[${checklist.balloons ? "✔" : " "}] Balloons
[${checklist.cake ? "✔" : " "}] Cake
[${checklist.gift ? "✔" : " "}] Gift`;
}

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
    go("intro");
  });
});
// === intro scene ===
scene("intro", () => {
  add([
    rect(width(), height()),
    color(20, 20, 20),
  ]);

  add([
    text("Today is Ann's birthday!\nBut we can't find the birthday supplies! \nHelp Rudy collect:\n🎈 Balloons\n🎁 Gift\n🎂 Cake\n\nGrab all the items and put them on the table in the backyard to start the party!\nInteract with items by pressing the space key.", {
      size: 24,
      width: width() - 40,
      lineSpacing: 8,
    }),
    pos(30, 80),
    color(255, 255, 255),
  ]);

  add([
    text("Press SPACE to continue", { size: 16 }),
    pos(width() / 2, height() - 50),
    anchor("center"),
    color(200, 200, 200),
  ]);

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
    anchor("center"),
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
  if (bed && rudy.pos.dist(bed.pos) < 50) {
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
    anchor("center"),
    "rudy", 
    { flipped: false },
  ]);
  
const checklistText = getChecklistText();
const padding = 8;

const tempText = add([
  text(checklistText, { size: 12 }),
  pos(width() - 160, 20),
  fixed(),
  opacity(0), // hidden temp to get size
]);

wait(0, () => {
  add([
    rect(tempText.width + padding * 2, tempText.height + padding * 2),
    pos(tempText.pos.x - padding, tempText.pos.y - padding),
    color(100, 100, 100), // gray box
    opacity(0.5),
    fixed(),
    z(99),
  ]);

  checklistUI = add([
    text(checklistText, { size: 12 }),
    pos(tempText.pos),
    fixed(),
    color(255, 255, 255),
    z(100),
    "checklistUI"
  ]);

  destroy(tempText); // cleanup
});
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
    anchor("center"),
    "rudy", 
    { flipped: false },
  ]);
  const gift = add([
  sprite("gift"),
  pos(110, 300), 
  scale(0.05),
  area(),
  "gift"
  ]);

const checklistText = getChecklistText();
const padding = 8;

const tempText = add([
  text(checklistText, { size: 12 }),
  pos(width() - 160, 20),
  fixed(),
  opacity(0), // hidden temp to get size
]);

wait(0, () => {
  add([
    rect(tempText.width + padding * 2, tempText.height + padding * 2),
    pos(tempText.pos.x - padding, tempText.pos.y - padding),
    color(100, 100, 100), // gray box
    opacity(0.5),
    fixed(),
    z(99),
  ]);

  checklistUI = add([
    text(checklistText, { size: 12 }),
    pos(tempText.pos),
    fixed(),
    color(255, 255, 255),
    z(100),
    "checklistUI"
  ]);

  destroy(tempText); // cleanup
});
  // === hallway top collider
  add([
    rect(100, 10),
    pos(10, 80),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === hallway bottom collider
  add([
    rect(100, 10),
    pos(10, 200),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === left wall collider
  add([
    rect(10, 250),
    pos(90, 200),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === bottom left collider
  add([
    rect(250, 10),
    pos(90, 445),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === backyard left collider
  add([
    rect(10, 50),
    pos(320, 440),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === left wall collider
  add([
    rect(10, 90),
    pos(90, 0),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === top left collider
  add([
    rect(80, 10),
    pos(100, 30),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === top right collider
  add([
    rect(200, 10),
    pos(320, 30),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === top right right collider
  add([
    rect(10, 60),
    pos(535, 30),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === kitchen top collider
  add([
    rect(100, 10),
    pos(550, 80),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === kitchen bottom collider
  add([
    rect(100, 10),
    pos(550, 200),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === top right right collider
  add([
    rect(10, 60),
    pos(535, 30),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === right wall collider
  add([
    rect(10, 90),
    pos(535, 200),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === right bottom wall collider
  add([
    rect(10, 200),
    pos(535, 300),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // === wine door collider
  add([
    rect(10, 10),
    pos(535, 350),
    area(),
    body({ isStatic: true }),
    z(-1),
    "wine-door"
    ]);
  // === bottom left collider
  add([
    rect(120, 10),
    pos(450, 445),
    area(),
    body({ isStatic: true }),
    z(-1),
    ]);
  // couch collider
  add([
    rect(10,60),
    pos(150,240),
    area(),
    body({isStatic: true}),
    z(-1),
    "couch",
    ]);
  // tv collider
  add([
    rect(10,60),
    pos(310,240),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
  // hallway collider
  add([
    rect(10,60),
    pos(10,115),
    area(),
    body({isStatic: true}),
    z(-1),
    "hallway-door",
    ]);
  // kitchen collider
  add([
    rect(10,60),
    pos(600,115),
    area(),
    body({isStatic: true}),
    z(-1),
    "kitchen-door",
    ]);
  // backyard collider
  add([
    rect(10,10),
    pos(385,450),
    area(),
    body({isStatic: true}),
    z(-1),
    "backyard-door",
    ]);
  // movie room collider
  add([
    rect(10,10),
    pos(245,15),
    area(),
    body({isStatic: true}),
    z(-1),
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
  onCollide("rudy", "gift", (r, g) => {
  destroy(g);
  checklist.gift = true;
  if (checklistUI) checklistUI.text = getChecklistText();
  showBubble("Found the gift! 🎁", rudy.pos);
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

// === Movie Room Scene ===
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
    anchor("center"),
    "rudy", 
    { flipped: false },
  ]);
  const balloons = add([
  sprite("balloons"),
  pos(450, 120), 
  area(),
  scale(.1),
  "balloons"
]);
  const tv = add([
    sprite("tv-on-stand"),
    pos(550, 135),
    area(),
    scale(-.2,.2),
    "tv-on-stand"
  ]);
const checklistText = getChecklistText();
const padding = 8;

const tempText = add([
  text(checklistText, { size: 12 }),
  pos(width() - 160, 20),
  fixed(),
  opacity(0), // hidden temp to get size
]);

wait(0, () => {
  add([
    rect(tempText.width + padding * 2, tempText.height + padding * 2),
    pos(tempText.pos.x - padding, tempText.pos.y - padding),
    color(100, 100, 100), // gray box
    opacity(0.5),
    fixed(),
    z(99),
  ]);

  checklistUI = add([
    text(checklistText, { size: 12 }),
    pos(tempText.pos),
    fixed(),
    color(255, 255, 255),
    z(100),
    "checklistUI"
  ]);

  destroy(tempText); // cleanup
});
// movie room left collider
  add([
    rect(30,200),
    pos(205,360),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// movie room right collider
  add([
    rect(30,200),
    pos(365,360),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// bottom right wall collider
  add([
    rect(200,10),
    pos(365,350),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// bottom left wall collider
  add([
    rect(150,10),
    pos(80,350),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// left wall collider
  add([
    rect(30,300),
    pos(45,100),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// top wall collider
  add([
    rect(500,30),
    pos(80,80),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// right wall collider
  add([
    rect(30,300),
    pos(550,100),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
  // living room door collider
  add([
    rect(40,40),
    pos(265,400),
    area(),
    body({isStatic: true}),
    z(-1),
    "living-room-door",
    ]);
    
  onCollide("rudy", "living-room-door", () => {
    go("living-room");
  });
  onCollide("rudy", "balloons", () => {
    destroy(balloons);
    checklist.balloons = true;

    if (checklistUI) {
      checklistUI.text = getChecklistText();
    }

    add([
      text("🎈 Got the balloons!", { size: 30 }),
      pos(rudy.pos.x-30, rudy.pos.y),
      lifespan(2),
      color(255, 255, 0),
    ]);
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
// === Kitchen Scene ===
scene("kitchen", () => {
  add([
    sprite("kitchen"),
    pos(0, 0),
    scale(width() / 256, height() / 144),
  ]);

  const rudy = add([
    pos(100, 170),
    sprite("rudy-right-1"),
    scale(0.1),
    area(),
    body(),
    anchor("center"),
    "rudy", 
    { flipped: false },
  ]);
  const cake = add([
  sprite("cake"),
  pos(245, 245), 
  area(),
  scale(.05),
  "cake"
]);

const checklistText = getChecklistText();
const padding = 8;

const tempText = add([
  text(checklistText, { size: 12 }),
  pos(width() - 160, 20),
  fixed(),
  opacity(0), // hidden temp to get size
]);

wait(0, () => {
  add([
    rect(tempText.width + padding * 2, tempText.height + padding * 2),
    pos(tempText.pos.x - padding, tempText.pos.y - padding),
    color(100, 100, 100), // gray box
    opacity(0.5),
    fixed(),
    z(99),
  ]);

  checklistUI = add([
    text(checklistText, { size: 12 }),
    pos(tempText.pos),
    fixed(),
    color(255, 255, 255),
    z(100),
    "checklistUI"
  ]);

  destroy(tempText); // cleanup
});
// living room door collider
  add([
    rect(30,30),
    pos(0,170),
    area(),
    body({isStatic: true}),
    z(-1),
    "living-room-door"
    ]);
// fridge collider
  add([
    rect(30,30),
    pos(320,100),
    area(),
    body({isStatic: true}),
    z(-1),
    "fridge"
    ]);
// mid left top collider
  add([
    rect(80,30),
    pos(30,90),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// mid left bottom collider
  add([
    rect(80,30),
    pos(10,230),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// mid left bottom collider
  add([
    rect(80,30),
    pos(90,270),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// mid left bottom collider
  add([
    rect(30,100),
    pos(150,270),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// mid left bottom collider
  add([
    rect(200,30),
    pos(200,360),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// mid left bottom collider
  add([
    rect(30,300),
    pos(390,150),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// mid left bottom collider
  add([
    rect(30,150),
    pos(360,60),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
// mid left top collider
  add([
    rect(500,30),
    pos(70,40),
    area(),
    body({isStatic: true}),
    z(-1),
    ]);
  onKeyPress("space", () => {
    const fridge= get("fridge")[0];
    if (fridge && rudy.pos.dist(fridge.pos) < 100) {
      showBubble("Ann will want some mac and cheese later", rudy.pos);
    }
  });

  onCollide("rudy", "living-room-door", () => {
    go("living-room");
  });
  onCollide("rudy", "cake", () => {
    destroy(cake);
    checklist.cake = true;

    if (checklistUI) {
      checklistUI.text = getChecklistText();
    }

    add([
      text("Got the Cake", { size: 30 }),
      pos(rudy.pos.x-30, rudy.pos.y),
      lifespan(2),
      color(255, 255, 0),
    ]);
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
});
// === Backyard Scene ===
scene("backyard", () => {
  // === Background ===
  add([
    sprite("backyard"),
    pos(0, 0),
    scale(width() / 256, height() / 144),
  ]);

  // === Rudy ===
  const rudy = add([
    pos(250, 370),
    sprite("rudy-right-1"),
    scale(0.1),
    area(),
    body(),
    anchor("center"),
    "rudy",
    { flipped: false },
  ]);

  // === Checklist UI ===
  const checklistText = getChecklistText();
  const padding = 8;

  const tempText = add([
    text(checklistText, { size: 12 }),
    pos(width() - 160, 20),
    fixed(),
    opacity(0),
  ]);

  wait(0, () => {
    add([
      rect(tempText.width + padding * 2, tempText.height + padding * 2),
      pos(tempText.pos.x - padding, tempText.pos.y - padding),
      color(100, 100, 100),
      opacity(0.5),
      fixed(),
      z(99),
    ]);

    checklistUI = add([
      text(checklistText, { size: 12 }),
      pos(tempText.pos),
      fixed(),
      color(255, 255, 255),
      z(100),
      "checklistUI"
    ]);

    destroy(tempText);
  });

  // === Living Room Door Collider ===
  add([
    rect(30, 30),
    pos(310, 430),
    area(),
    body({ isStatic: true }),
    z(-1),
    "living-room-door",
  ]);
  // === rossi Collider ===
  add([
    rect(30, 30),
    pos(50, 130),
    area(),
    body({ isStatic: true }),
    z(-1),
    "rossi",
  ]);
   // === mom Collider ===
  add([
    rect(30, 30),
    pos(160, 130),
    area(),
    body({ isStatic: true }),
    z(-1),
    "mom",
  ]);
// === chambers Collider ===
  add([
    rect(30, 30),
    pos(300, 130),
    area(),
    body({ isStatic: true }),
    z(-1),
    "chambers",
  ]);
  // === bobby Collider ===
  add([
    rect(30, 30),
    pos(450, 130),
    area(),
    body({ isStatic: true }),
    z(-1),
    "bobby",
  ]);
    // === jake Collider ===
  add([
    rect(30, 30),
    pos(570, 130),
    area(),
    body({ isStatic: true }),
    z(-1),
    "jake",
  ]);
  onCollide("rudy", "living-room-door", () => {
    go("living-room");
  });
  onKeyPress("space", () => {
  const rossi = get("rossi")[0];
  if (rossi && rudy.pos.dist(rossi.pos) < 100) {
    showBubble("It's strange seeing Rossi without Owen", rudy.pos);
  }
});
onKeyPress("space", () => {
  const mom = get("mom")[0];
  if (mom && rudy.pos.dist(mom.pos) < 100) {
    showBubble("Mrs. Patterson is so pretty", rudy.pos);
  }
});
onKeyPress("space", () => {
  const chambers = get("chambers")[0];
  if (chambers && rudy.pos.dist(chambers.pos) < 100) {
    showBubble("Wow my dad is so handsome!", rudy.pos);
  }
});
onKeyPress("space", () => {
  const bobby = get("bobby")[0];
  if (bobby && rudy.pos.dist(bobby.pos) < 100) {
    showBubble("Bobby may be the coolest guy I know!", rudy.pos);
  }
});
onKeyPress("space", () => {
  const jake = get("jake")[0];
  if (jake && rudy.pos.dist(jake.pos) < 100) {
    showBubble("Jake's my favorite. he has so many cool books", rudy.pos);
  }
});
  // === Table Setup ===
  let placedPresents = false;
  const tablePos = vec2(330, 260);
  let emptyTable = null;
  let interactionZone = null;

  // Always show empty table on load
  emptyTable = add([
    sprite("table-empty"),
    pos(tablePos),
    anchor("center"),
    scale(0.5),
    area(),
    "emptyTable",
  ]);

  interactionZone = add([
    rect(50, 50),
    pos(tablePos.sub(25, 25)),
    area(),
    opacity(0),
    "tableInteract",
  ]);

  // === Interact with table when ready ===
  onKeyPress("space", () => {
    if (
      emptyTable &&
      !placedPresents &&
      checklist.balloons &&
      checklist.cake &&
      checklist.gift &&
      rudy.pos.dist(tablePos) < 70
    ) {
      destroy(emptyTable);
      destroy(interactionZone);

      add([
        sprite("table-full"),
        pos(tablePos),
        anchor("center"),
        scale(0.3),
        "table-full",
      ]);

      placedPresents = true;

      wait(10, () => {
        go("final-image");
      });
    }
  });

  // === Movement Logic ===
  const SPEED = 120;
  let animTimer = 0;
  let animFrame = 1;

  onUpdate(() => {
    if (checklistUI) checklistUI.text = getChecklistText();

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
scene("final-image", () => {
  // === Background ===
  add([
    sprite("final-image"),
    pos(0, 0),
    scale(width() / 1536, height() / 1024),
  ]);
  add([
  text("From Chambers", { size: 60 }),
  pos(120, 140),
  color(255, 0, 0),
])

});
// === Start Game ===
go("start");

