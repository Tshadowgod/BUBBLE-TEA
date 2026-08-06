import { prisma } from "@/lib/prisma";

const drinks = [
  {
    name: "Taro Bubble Milk Tea",
    category: "Bubble Tea",
    tag: "CHEWY TEA",
    description: "Creamy taro milk tea with chewy tapioca pearls.",
    price: 5.9,
    colorway: "taro",
    imageUrl: "/images/drinks/taro-bubble-milk-tea.jpg",
    isNew: true,
    sortOrder: 1,
  },
  {
    name: "Matcha Latte",
    category: "Latte",
    tag: "FLAVOURED TEA",
    description: "Stone-ground matcha whisked with fresh milk.",
    price: 5.2,
    colorway: "matcha",
    imageUrl: "/images/drinks/matcha-latte.jpg",
    isNew: true,
    sortOrder: 2,
  },
  {
    name: "Honey Milk Tea",
    category: "Bubble Tea",
    description: "Classic black milk tea sweetened with honey.",
    price: 4.9,
    colorway: "honey",
    imageUrl: "/images/drinks/honey-milk-tea.jpg",
    sortOrder: 3,
  },
  {
    name: "Black Tea Macchiato",
    category: "Bubble Tea",
    description: "Bold black tea topped with a silky milk foam cap.",
    price: 4.9,
    colorway: "blacktea",
    imageUrl: "/images/drinks/black-tea-macchiato.jpg",
    sortOrder: 4,
  },
  {
    name: "Ice-cream Milk Tea",
    category: "Bubble Tea",
    description: "Milk tea blended with a scoop of vanilla ice-cream.",
    price: 3.9,
    originalPrice: 4.9,
    colorway: "icecream",
    imageUrl: "/images/drinks/ice-cream-milk-tea.jpg",
    sortOrder: 5,
  },
  {
    name: "Brown Sugar Fresh Milk",
    category: "Bubble Tea",
    description: "Fresh milk swirled with house-cooked brown sugar syrup.",
    price: 4.9,
    colorway: "brownsugar",
    sortOrder: 6,
  },
  {
    name: "Wintermelon Milk Tea",
    category: "Bubble Tea",
    description: "Fragrant wintermelon tea with a splash of fresh milk.",
    price: 4.9,
    colorway: "wintermelon",
    sortOrder: 7,
  },
];

const toppings = [
  {
    name: "Pearls",
    price: 1.2,
    colorway: "pearl",
    imageUrl: "/images/toppings/pearls.jpg",
    sortOrder: 1,
  },
  {
    name: "Ice Cream",
    price: 1.5,
    colorway: "cream",
    imageUrl: "/images/toppings/ice-cream.jpg",
    sortOrder: 2,
  },
  {
    name: "Taro Balls",
    price: 1.3,
    colorway: "taro",
    imageUrl: "/images/toppings/taro-balls.jpg",
    sortOrder: 3,
  },
  {
    name: "Grass Jelly",
    price: 1.0,
    colorway: "jelly",
    imageUrl: "/images/toppings/grass-jelly.jpg",
    sortOrder: 4,
  },
  { name: "Red Bean", price: 1.0, colorway: "redbean", sortOrder: 5 },
  {
    name: "Pudding",
    price: 1.2,
    colorway: "pudding",
    imageUrl: "/images/toppings/pudding.jpg",
    sortOrder: 6,
  },
];

async function main() {
  for (const drink of drinks) {
    await prisma.drink.upsert({
      where: { id: `seed-${drink.name}` },
      update: drink,
      create: { id: `seed-${drink.name}`, ...drink },
    });
  }

  for (const topping of toppings) {
    await prisma.topping.upsert({
      where: { id: `seed-${topping.name}` },
      update: topping,
      create: { id: `seed-${topping.name}`, ...topping },
    });
  }

  console.log(`Seeded ${drinks.length} drinks and ${toppings.length} toppings.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
