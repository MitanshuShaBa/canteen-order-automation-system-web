const items = [
  {
    category: "beverages",
    name: "pepsi",
    price: 20,
  },
  {
    category: "south indian",
    name: "upma",
    price: 50,
  },
  {
    category: "south indian",
    name: "dosa",
    price: 60,
  },
  {
    category: "snacks",
    name: "sandwich",
    price: 30,
  },
  {
    category: "snacks",
    name: "vada pav",
    price: 15,
  },
  {
    category: "snacks",
    name: "samosa pav",
    price: 15,
  },
  {
    category: "chinese",
    name: "manchurian",
    price: 40,
  },
  {
    category: "snacks",
    name: "bhel",
    price: 20,
  },
  {
    category: "south indian",
    name: "idli",
    price: 20,
  },
  {
    category: "beverages",
    name: "coffee",
    price: 15,
  },
  {
    category: "beverages",
    name: "chai",
    price: 10,
  },
  {
    category: "chinese",
    name: "noodles",
    price: 70,
  },
  {
    category: "chinese",
    name: "fried rice",
    price: 60,
  },
];

const addMenuTemp = () => {
  items.map(({ category, name, price }) => {
    db.collection("menu").doc(name).set({
      category,
      isAvailable: true,
      name,
      price,
    });
  });
};
