const SUITS = ["Spades", "Clubs", "Hearts", "Diamonds"]
const SUITS_SYM = ["♠", "♣", "♥", "♦"]
export const RANK = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
]

export default class Deck {
  constructor(cards) {
    this.cards = cards || newDeck()
  }

  get numberOfCards() {
    return this.cards.length
  }

  pop() {
    return this.cards.shift()
  }

  push(card) {
    this.cards.push(card)
  }

  shuffle() {
    this.cards.map((_value, index, arr) => {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
      return arr[index];
    })
  }

  dealHand(size = 7) {
    let hand = new Hand();

    for (let i = 0; i < size; i++) {
      hand.addCard(this.pop())
    }
    
    return hand;
  }
}

class Card {
  constructor(suit, rank, facedown = false) {
    this.id
    this.suit = suit
    this.rank = rank
    this.facedown = facedown
    this.image = `./images/${suit}_${rank}.png`
    this.inPlay = false
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  setInPlay(inPlay) {
    this.inPlay = inPlay;
  }

  getInPlay() {
    return this.inPlay;
  }

  getImage() {
    return this.image;
  }

  getScore() {
    return CARD_VALUE_MAP[this.rank];
  }

  setFacedown(facedown) {
    this.facedown = facedown;
  }
}

function newDeck() {
  return SUITS.flatMap(suit => {
    return RANK.map(rank => {
      return new Card(suit, rank)
    })
  })
}

class Hand {
  constructor() {
    this.cards = []
  }

  size() {
    return this.cards.length
  }

  addCard(card){
    this.cards.push(card)
  }

  removeCard(card){
    this.cards = this.cards.findIndex(c => c.suit === card.suit && c.rank === card.rank)
    if ( index !== -1) {
      this.cards.splice(index, 1)
    }
  }

  popCard() {
    return this.cards.shift();
  }

  getCards() {
    return this.cards;
  }

  drawCard(deck) {
    const newCard = deck.pop();
    this.addCard(newCard);
  }
}