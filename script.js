let xp = 0;
let health = 100;
let gold = 90;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

xpText.innerHTML=xp;
healthText.innerHTML = health;
goldText.innerHTML = gold;
const weapon = [
  {
    name: "stick",
    power: 5,
  },
  {
    name: "dagger",
    power: 30,
  },
  {
    name: "claw hammer",
    power: 50,
  },
  {
    name: "sword",
    power: 100,
  },
];

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60,
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
  },
];
const locations = [
  {
    name: "town square",
    "button text": ["Go to Store", "Go to Cave", "Fight dragon"],
    "button function": [goStore, goCave, fightDragon],
    text: "You are in the town square",
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button function": [buyHealth, buyWeapon, goTown],
    text: "You enter the store",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button function": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monster",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button function": [attack, dodge, goTown],
    text: "You are fighting a monster",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button function": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button function": [restart, restart, restart],
    text: "You die...",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button function": [restart, restart, restart],
    text: "You deafeat the dragon! YOU WIN THE GAME!",
  },
  {
    name: "easteregg",
    "button text": ["2", "8", "Go to town square?"],
    "button function": [pickTwo, pickEight, goTown],
    text: "You find a secret game.Pick a number above. Ten numbers will be randomly chosen between 0  and 10. If the number you choose matches one of the random numbers, you win!",
  },
];

//Initialize button
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(locations) {
  monsterStats.style.display = "none";
  button1.innerHTML = locations["button text"][0];
  button2.innerHTML = locations["button text"][1];
  button3.innerHTML = locations["button text"][2];
  button1.onclick = locations["button function"][0];
  button2.onclick = locations["button function"][1];
  button3.onclick = locations["button function"][2];
  text.innerHTML = locations.text;
}

function goTown() {
  update(locations[0]);
}
function goStore() {
  update(locations[1]);
}
function goCave() {
  update(locations[2]);
}
function fightDragon() {
  fighting = 2;
  goFight();
}
function fightSlime() {
  fighting = 0;
  goFight();
}
function fightBeast() {
  fighting = 1;
  goFight();
}
function buyHealth() {
  if (gold >= 10) {
    gold = gold - 10;
    health = health + 10;
    goldText.innerHTML = gold;
    healthText.innerHTML = health;
  } else {
    text.innerHTML = "You do not have enough gold to buy health.";
  }
}
function buyWeapon() {
  if (currentWeapon < weapon.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerHTML = gold;
      let newWeapon = weapon[currentWeapon].name;
      text.innerHTML = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerHTML += " In your inventory you have: " + inventory;
    } else {
      text.innerHTML = "You do not have enough gold to buy weapon.";
      button2.innerHTML = "Sell weapon for 15 gold";
      button2.onclick = sellWeapon;
    }
  } else {
    text.innerHTML = "You already have the most pwerful weapon.";
  }
}
function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerHTML = gold;
    let currentWeapon = inventory.shift();
    text.innerHTML = "You sold a " + currentWeapon + ".";
    text.innerHTML += " in you inventory you have: " + inventory;
  } else {
    text.innerHTML = "Don't sell your only weapon!";
  }
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerHTML = monsters[fighting].name;
  monsterHealthText.innerHTML = monsterHealth;
}
function attack() {
  text.innerHTML = "The " + monsters[fighting].name + " attacks.";
  text.innerHTML +=
    "You attack it with your " + weapon[currentWeapon].name + ".";
  if (isMonsterHit()) {
    health -= getMonsterAttackValue(monsters[fighting].level);
  } else {
    text.innerHTML += " You miss.";
  }
  monsterHealth -=
    weapon[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  healthText.innerHTML = health;
  monsterHealthText.innerHTML = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerHTML += " Your " + inventory.pop() + " breaks";
    currentWeapon--;
  }
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}
function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerHTML = gold;
  xpText.innerHTML = xp;
  update(locations[4]);
}
function lose() {
  update(locations[5]);
}
function winGame() {
  update(locations[6]);
}
function dodge() {
  text.innerHTML =
    "You dodge the attack from the " + monsters[fighting].name + ".";
}
function restart() {
  xp = 0;
  health = 100;
  gold = 90;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerHTML = gold;
  healthText.innerHTML = health;
  xpText.innerHTML = xp;
  goTown();
}

function getMonsterAttackValue(level) {
  let hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit;
}

function easterEgg() {
  update(locations[7]);
}
function pickEight() {
  pick(8);
}
function pickTwo() {
  pick(2);
}
function pick(guess) {
  let numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }

  text.innerHTML = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerHTML += numbers[i] + "\n";
  }

  if (numbers.indexOf(guess) !== -1) {
    text.innerHTML += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerHTML = gold;
  } else {
    text.innerHTML += "wrong! You lose 10 health!";
    health -= 10;
    healthText.innerHTML = health;
    if (health <= 0) {
      lose();
    }
  }
}
