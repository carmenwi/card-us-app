import type { CardRarity } from "./rarity";

export type ProfileCard = {
  id: string;
  image: string;
  title: string;
  description?: string;
  rarity: CardRarity;
  stats?: { charisma: number; style: number; nature: number; aura: number };
};

export type ProfileCollection = {
  id: string;
  name: string;
  cards: ProfileCard[];
};

const CARD_PHOTOS = [
  "/mock-images/card-photos/grandma.jpg",
  "/mock-images/card-photos/cat-in-chair.png",
  "/mock-images/card-photos/cat-sofa.png",
  "/mock-images/card-photos/couple-trip.png",
  "/mock-images/card-photos/doggie-tongue.png",
  "/mock-images/card-photos/goggie-xmas.png",
  "/mock-images/card-photos/gymgirl.png",
  "/mock-images/card-photos/lake.png",
  "/mock-images/card-photos/outdoors-excursion.png",
  "/mock-images/card-photos/pasta.JPG",
  "/mock-images/card-photos/ramen.png",
  "/mock-images/card-photos/bingo.png",
];

const rarities: CardRarity[] = ["legendary", "special", "rare", "common"];
const titles = [
  "Mystic Snow",
  "Lake Vibes",
  "Gym Flex",
  "Grandma Energy",
  "Cat Nap",
  "Trip Goals",
  "Good Boy",
  "Holiday Pup",
  "Pasta Night",
  "Ramen Slurp",
  "Bingo King",
  "Outdoor Szn",
];

function makeCard(
  idx: number,
  image: string,
  title: string,
  rarity: CardRarity
): ProfileCard {
  return {
    id: `card-${idx}`,
    image,
    title,
    rarity,
  };
}

/** Profile collections with card previews (used in profile bubbles + gallery). */
export const PROFILE_COLLECTIONS: ProfileCollection[] = [
  {
    id: "all",
    name: "All",
    cards: CARD_PHOTOS.slice(0, 12).map((img, i) =>
      makeCard(i, img, titles[i] ?? "Card", rarities[i % 4])
    ),
  },
  {
    id: "outdoors",
    name: "Outdoors",
    cards: [
      makeCard(1, CARD_PHOTOS[8], "Outdoor Szn", "rare"),
      makeCard(2, CARD_PHOTOS[7], "Lake Vibes", "special"),
      makeCard(3, CARD_PHOTOS[0], "Grandma Energy", "common"),
    ],
  },
  {
    id: "pets",
    name: "Pets",
    cards: [
      makeCard(4, CARD_PHOTOS[1], "Cat Nap", "legendary"),
      makeCard(5, CARD_PHOTOS[2], "Cat Sofa", "rare"),
      makeCard(6, CARD_PHOTOS[4], "Good Boy", "common"),
      makeCard(7, CARD_PHOTOS[5], "Holiday Pup", "special"),
    ],
  },
  {
    id: "food",
    name: "Food",
    cards: [
      makeCard(8, CARD_PHOTOS[9], "Pasta Night", "common"),
      makeCard(9, CARD_PHOTOS[10], "Ramen Slurp", "rare"),
    ],
  },
  {
    id: "travel",
    name: "Travel",
    cards: [
      makeCard(10, CARD_PHOTOS[3], "Trip Goals", "special"),
      makeCard(11, CARD_PHOTOS[7], "Lake Vibes", "legendary"),
    ],
  },
  {
    id: "gym",
    name: "Gym Flex",
    cards: [
      makeCard(12, CARD_PHOTOS[6], "Gym Flex", "legendary"),
      makeCard(13, CARD_PHOTOS[11], "Bingo King", "common"),
    ],
  },
  {
    id: "Trades",
    name: "Trades",
    cards: [],
  },
];

export function getCollectionById(id: string): ProfileCollection | undefined {
  return PROFILE_COLLECTIONS.find((c) => c.id === id);
}

/** Map API rarity string to CardRarity for display. */
export function rarityStringToRarity(r: string): CardRarity {
  const lower = r.toLowerCase();
  if (lower === "legendary") return "legendary";
  if (lower === "rare") return "rare";
  if (lower === "common") return "common";
  return "special";
}
