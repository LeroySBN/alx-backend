// In stock?
const express = require('express');
const redis = require('redis');
const { promisify } = require('util');


const app = express();
const port = 1245;

// Create a Redis client
const client = redis.createClient();

// Promisify Redis functions
const hsetAsync = promisify(client.hset).bind(client);
const hgetAsync = promisify(client.hget).bind(client);

// Data
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

const getItemById = (id) => {
  return listProducts.find((product) => product.itemId === id);
};

// Function to reserve stock in Redis
const reserveStockById = async (itemId, stock) => {
  await hsetAsync('item', itemId, stock);
};

// Async function to get current reserved stock from Redis
const getCurrentReservedStockById = async (itemId) => {
  const reservedStock = await hgetAsync('item', itemId);
  return parseInt(reservedStock, 10) || 0;
};

// Express route to list products
app.get('/list_products', (req, res) => {
  const productList = listProducts.map((product) => ({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
  }));
  res.json(productList);
});

// Express route to get product details and reserved stock
app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(parseInt(itemId, 10));

  if (!product) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }

  const currentReservedStock = await getCurrentReservedStockById(itemId);
  const availableStock = Math.max(product.initialAvailableQuantity - currentReservedStock, 0);

  res.json({
    ...product,
    currentQuantity: availableStock,
  });
});

// Express route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const product = getItemById(parseInt(itemId, 10));

  if (!product) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }

  const currentReservedStock = await getCurrentReservedStockById(itemId);
  const availableStock = Math.max(product.initialAvailableQuantity - currentReservedStock, 0);

  if (availableStock === 0) {
    res.json({ status: 'Not enough stock available', itemId: parseInt(itemId, 10) });
  } else {
    await reserveStockById(itemId, currentReservedStock + 1);
    res.json({ status: 'Reservation confirmed', itemId: parseInt(itemId, 10) });
  }
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
