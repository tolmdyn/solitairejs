import Deck, { RANK } from "./deck.js"

let deck;
let deckPile = [];

const width = 800; // window.innerWidth;
const height = 640; // window.innerHeight;
const cardWidth = 74;
const cardHeight = 104;

var stage = new Konva.Stage({
  container: 'container',
  width: 800,
  height: 640,
});

// BACKGROUND

var layerBack = new Konva.Layer();

var background = new Konva.Rect({
  x: 10,
  y: 10,
  width: 750,
  height: 500,
  fill: 'green',
  stroke: 'black',
  strokeWidth: 0,
});

layerBack.add(background);
stage.add(layerBack);

// SLOTS

var slotRectangles = []

for (var i = 0; i < 7; i++) {
  var rect = new Konva.Rect({
    x: 20 + i * (cardWidth + 20), // Adjust the x position to create spacing of 10 pixels between rectangles
    y: 150,
    width: cardWidth,
    height: cardHeight,
    fill: 'darkgreen',
    stroke: 'black',
    strokeWidth: 2
  });
  layerBack.add(rect);
  slotRectangles.push(rect); // Add the rectangle to the slots array
}

// PILES

var pileLayer = new Konva.Layer();
stage.add(pileLayer);
var pileRectangles = []
var piles = { "pile0": [], "pile1": [], "pile2": [], "pile3": [], };

for (var i = 0; i < 4; i++) {
  var rect = new Konva.Rect({
    x: 302 + i * (cardWidth + 20), // Adjust the x position to create spacing of 10 pixels between rectangles
    y: 20,
    width: cardWidth,
    height: cardHeight,
    fill: 'darkgreen',
    stroke: 'black',
    strokeWidth: 2,
    name: 'pile' + i,
  });
  pileLayer.add(rect);
  pileRectangles.push(rect);
}
// -----------------------------

// var deckImg = new Image();

// deckImg.onload = function () {
//   var deck = new Konva.Image({
//     x: 20,
//     y: 20,
//     width: 37 * 2,
//     height: 52 * 2,
//     draggable: false,
//     image: deckImg,
//     name: 'deck',
//   });

//   deck.on('click', function () {
//     console.log("blib");
//     dealCard();

//   })
//   // add the shape to the layer
//   layerBack.add(deck);
// };
// deckImg.src = '/images/Back_1.png';

// ---

var deckRect = new Konva.Rect({
  x: 20, // Adjust the x position to create spacing of 10 pixels between rectangles
  y: 20,
  width: cardWidth,
  height: cardHeight,
  fill: 'darkgreen',
  stroke: 'black',
  strokeWidth: 2
});

deckRect.on('click', function () {
  console.log("deckRect click")
  // restack deck
  deck = new Deck(deckPile);
  deckPile = [];
  deckImg.visible(true);
});


layerBack.add(deckRect);

var deckImg = new Konva.Image({
  x: 20,
  y: 20,
  width: cardWidth,
  height: cardHeight,
  draggable: false,
  name: 'deck'
});

deckImg.on('click', function () {
  //console.log("blib");
  dealCard();
})

var imageObj = new Image();
imageObj.onload = function () {
  deckImg.image(imageObj);
  // cardLayer.batchDraw();
};

imageObj.src = '/images/Back_1.png';
layerBack.add(deckImg);

// CARDS ------------------------

var cardLayer = new Konva.Layer();
stage.add(cardLayer);

var tempLayer = new Konva.Layer();
stage.add(tempLayer);

// ------------------

// stage.on('dblclick', function () {
//   var pointer = stage.getPointerPosition();
//   var newCard = deck.pop();
//   if (newCard)
//     renderCardImage(pointer.x, pointer.y, newCard);

// });

function renderCardImage(x, y, card) {
  var cardImg = new Konva.Image({
    x: x,
    y: y,
    width: 37 * 2,
    height: 52 * 2,
    draggable: !card.facedown,
    name: `${card.rank}_of_${card.suit}`, // t
    suit: card.suit, // t
    rank: card.rank, // t
    card: card,
    snapped: false,
  });

  var imageObj = new Image();
  imageObj.onload = function () {
    cardImg.image(imageObj);
    cardLayer.batchDraw();
  };

  if (card.facedown === true) {
    imageObj.src = '/images/Back_1.png';
  } else {
    imageObj.src = card.getImage();
  }

  cardLayer.add(cardImg);
  return cardImg._id;
}


// TODO: MAKE THIS BETTER
function dealCard() {
  // console.log("deal, number of cards:" + deck.numberOfCards)
  var newCard = deck.pop();

  if (newCard) {
    deckPile.push(newCard);
    newCard.setId(renderCardImage(cardWidth + 40, 20, newCard));
    if (deck.numberOfCards === 0) {
      console.log("last card?")
      deckImg.visible(false);
    }
  } else if (deck.numberOfCards === 0 || deck.numberOfCards === undefined) {
    console.log("no cards");
  }

  cardLayer.draw();
}

// function renderHand() {
//   cardLayer.destroyChildren();

//   hand.getCards().forEach((card, index) => {
//     if (card) {
//       renderCardImage(10 + (80 * index), 520, card);
//     }
//   });
// }

// function setupBoard() {
//   // A function which deals the initial board state
// }

// -------------------- DRAG/DROP----------------------------

var prevLocation = { x: 0, y: 0 };

stage.on('dragstart', function (e) {
  e.target.moveTo(tempLayer);
  tempLayer.draw();
  console.log('Moving ', e.target.name());
  prevLocation.x = e.target.x();
  prevLocation.y = e.target.y();
})

var previousShape;

stage.on('dragmove', function (evt) {
  var pos = stage.getPointerPosition();
  var shape = cardLayer.getIntersection(pos);

  // ----------------------------------------------------
  var pile = pileLayer.getIntersection(pos);
  if (pile) {
    shape = pile;
  }
  // if (pile) {
  //   // shape = pile;
  //   let targetCard = evt.target.attrs.card;
  //   if (targetCard.rank === "A") {
  //     evt.target.position({
  //       x: pile.x(),
  //       y: pile.y()
  //    })
  // }
  // }
  // console.log(pile);
  // ----------------------------------------------------

  if (previousShape && shape) {
    if (previousShape !== shape) {
      //detach old target
      previousShape.fire(
        'dragleave',
        {
          evt: evt.evt,
        }, true
      );

      //enter new target
      shape.fire(
        'dragenter',
        {
          evt: evt.evt,
        }, true
      );

      previousShape = shape;
    } else {
      // console.log(evt.target.name() + " over " + previousShape.name());

      // ---
      if (pile) {
        if (canPileStack(evt.target, pile)) {
          evt.target.position({
            x: pile.x(),
            y: pile.y(),
          })
        }
      } else if (canStack(evt.target, previousShape)) {
        evt.target.position({
          x: previousShape.x(),
          y: previousShape.y() + 35,
        })
      }

      // evt.target.attrs.snapped = true;
      // ---
      previousShape.fire(
        'dragover',
        {
          evt: evt.evt,
        }, true
      );
    }
  } else if (!previousShape && shape) {
    previousShape = shape;
    shape.fire(
      'dragenter',
      {
        evt: evt.evt,
      }, true
    );
  } else if (previousShape && !shape) {
    previousShape.fire(
      'dragleave',
      {
        evt: evt.evt,
      },
      true
    );
    previousShape = undefined;
  }
});

// Custom event triggers
stage.on('dragend', function (e) {
  var pos = stage.getPointerPosition();
  var shape = cardLayer.getIntersection(pos);
  var pile = pileLayer.getIntersection(pos);

  // console.log(e.target, shape);

  if (shape && canStack(e.target, shape)) {
    previousShape.fire(
      'drop',
      {
        evt: e.evt,
      },
      true
    );
    updateSlot(e.target, shape);
    e.target.attrs.card.setInPlay(true); // refactor
  } else if (pile && canPileStack(e.target, pile)) {
    updatePile(e.target, pile);
    updateSlot(e.target, shape); // In order to flip the card moved
    // e.target.attrs.card.setInPlay(false); // refactor
  } else {
    // there isn't a drop so we move card back to where it was before
    e.target.position({
      x: prevLocation.x,
      y: prevLocation.y,
    })
  }
  previousShape = undefined;
  e.target.moveTo(cardLayer);
});

stage.on('dragenter', function (e) {
  // console.log('dragenter ' + e.target.name());
});

stage.on('dragleave', function (e) {
  // console.log('dragleave ' + e.target.name());
});

stage.on('dragover', function (e) {
  // console.log('dragover ' + e.target.name())
});

stage.on('drop', function (e) {
  // console.log('drop on ' + e.target.name())
});

// ----------------------- SLOTS -------------------------
// Slots are an array of arrays... each containing a stack of cards

function createSlots(numSlots = 7) {
  var slots = [];

  for (var i = 0; i < numSlots; i++) {
    slots.push([]);

    for (var j = 0; j <= i; j++) {
      var card = deck.pop();

      if (card) {
        if (j !== i) {
          card.facedown = true;
        }
        slots[i].push(card);
      } else {
        console.error('Deck is empty');
        break;
      }
    }
  }
  return slots;
}

function renderSlots() {
  for (var i = 0; i < slots.length; i++) {
    for (var s = 0; s < slots[i].length; s++) {
      const targetCard = slots[i][s];

      targetCard.setId(renderCardImage(20 + i * (cardWidth + 20), 150 + (s * 32), targetCard));
      targetCard.setInPlay(true);
    }
  }
}

function isSlotEmpty(slot) {
  return slots[i].length === 0;
}

function updateSlot(newCardObject, slotCardObject) {
  // we need to search all the slots for the card we are dropping on.
  // We only need to check the last (top) card of the slot
  const card = newCardObject.attrs.card;

  // remove card from slot (if exists), and flip the next card down
  for (const slot of slots) {
    if (slot.length > 0) {
      if (slot[slot.length - 1].getId() === card.getId()) {
        slot.pop();
        if (slot.length > 0) {
          flipCard(slot[slot.length - 1].getId());
        }
        break;
      }
    }
  }

  // add the new card to the slot of cards
  if (!slotCardObject) {
    return;
  }

  const slotCard = slotCardObject.attrs.card;

  for (const slot of slots) {
    if (slot.length > 0) {
      // add card to slot
      if (slot[slot.length - 1].getId() === slotCard.getId()) {
        slot.push(card);
        break;
      }
    }
  }
}

function updatePile(card, pile) {
  console.log('Update pile: ' + card.name() + ' into ' + pile.name());

  piles[pile.name()].push(card);
  // console.log(piles);

  // update the slot that the card came from (if it came from a slot)
  // update card
  card.attrs.card.setInPlay(false); // refactor
  card.draggable(false);
}

function flipCard(id) {
  // console.log("flipping card " + id)
  var cardImage = cardLayer.find(node => node._id === id)[0];
  // console.log(cardLayer);
  console.log(cardImage);

  if (cardImage) {
    var card = cardImage.getAttr('card')
    card.setFacedown(false);
    cardImage.draggable(true);

    var newImage = new Image();

    newImage.onload = function () {
      cardImage.image(newImage);
      cardLayer.batchDraw();
    }

    newImage.src = card.getImage();
  }
}

// ----------------------- STACKABLE  -------------------------

function canStack(cardImage, targetCardImage) {
  // console.log(targetCardImage);
  const card = cardImage.attrs.card;
  const targetCard = targetCardImage.attrs.card;

  // can the card stack to target card.. if it is face up, not in the deck stacks, on the top of a slot stack and legal
  if (targetCard.facedown) {
    return false;
  }

  //intersects deck slots
  if (!targetCard.inPlay) {
    return false;
  }

  //is a legal move (opposite color and descending)
  if (!isOppositeColor(card, targetCard)) {
    return false;
  }

  if (!isRankBelow(card, targetCard)) {
    return false;
  }

  return true;
}

function canPileStack(cardImage, targetPile) {
  const card = cardImage.attrs.card;
  const pile = piles[targetPile.name()];

  if (pile.length === 0) {
    return card.rank === "A";
  }

  const topCard = pile.pop().attrs.card;
  console.log(topCard);

  if (topCard.suit !== card.suit) {
    return false;
  }

  return isRankAbove(card, topCard);
}

// ----- CONSIDER MOVING THESE TO DECK/CARD

function isOppositeColor(card1, card2) {
  return (((card1.suit === "Spades" || card1.suit === "Clubs") && (card2.suit === "Hearts" || card2.suit === "Diamonds")) ||
    ((card2.suit === "Spades" || card2.suit === "Clubs") && (card1.suit === "Hearts" || card1.suit === "Diamonds")))
}

function isRankBelow(card1, card2) {
  return RANK.indexOf(card2.rank) === RANK.indexOf(card1.rank) + 1;
}

function isRankAbove(card1, card2) {
  return RANK.indexOf(card1.rank) === RANK.indexOf(card2.rank) + 1;
}


// ----------------------- GAME LOGIC -------------------------



// ------------------------------------------------------------

deck = new Deck();
deck.shuffle();

var slots = createSlots();
renderSlots();

// console.log(slots);


