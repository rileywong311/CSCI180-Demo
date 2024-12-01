const express = require('express');
const router = express.Router();

// ************************
//   FUNCTION LEVEL DEMO
// ************************

// Mock user data (in a real app, you would use a database)
const users = [];

router.get('/test', (req, res) => {
    res.json({ 
      message: "This is a test route", 
      your_headers: req.headers,
      your_body: req.body
    });
});

// Registration route
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  // Check if user already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) return res.status(200).send({message: 'User already registered'});
  
  // Create new user and add to the list (you would hash the password in a real app)
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  res.status(201).send({message: 'User registered successfully'});
  console.log(`API: Created user "${newUser.username}"`)
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check if user exists and password matches
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(400).send('Invalid username or password');
  
  // Mock authentication success (you would use JWT or sessions in a real app)
  res.status(200).send('Logged in successfully');
});

// Logout route
router.post('/logout', (req, res) => {
  // Mock logout process
  res.status(200).send('Logged out successfully');
});

// Password reset route
router.post('/reset-password', (req, res) => {
  const { username, newPassword } = req.body;
  
  // Find the user
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).send('User not found');
  
  // Update password (in a real app, validate and hash the new password)
  user.password = newPassword;
  res.status(200).send('Password reset successfully');
});



// ******************************
//   OBJECT LEVEL DEMO
// ******************************
const day = 86400000
const date = new Date();


id = 1
const orders = [
  {id: id++, name: "Water Bottle", expected: date.getTime() + day * 2, complete: false},
  {id: id++, name: "Wireless Mouse", expected: date.getTime() + day * 7, complete: false},
  {id: id++, name: "CATAN Board Game", expected: date.getTime() + day * 4, complete: false}
]

// Get order route
router.get('/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  
  // Find the order
  const order = orders.find(o => o.id == orderId);
  if (!order) return res.status(404).send('Order not found');
  
  // Return order
  res.status(200).send(`
    <body style="display: flex; justify-content: center; margin: auto; font-family: arial">
      <div style="margin-top: 300px; width: 300px; height: 150px; padding: 15px; border: solid black 1px; border-radius: 4px">
        <h2>${order.name}</h2>
        <h3>Expected: ${new Date(order.expected).toDateString()}</h3>
        <h3>Complete: ${order.complete ? 'complete' : 'incomplete'}</h3>
      </div>
    </body>
  `);
});


// Complete order route
router.get('/orders/:orderId/complete', (req, res) => {
  const orderId = req.params.orderId;
  
  // Find the order
  const order = orders.find(o => o.id == orderId);
  if (!order) return res.status(404).send('Order not found');
  
  // Complete order
  order.complete = true;
  res.status(200).send(`<h2>Order complete</h2>`);
  console.log(`API: Order ${order.id} completed`)
});



// ******************************
//   OBJECT-PROPERTY LEVEL DEMO
// ******************************

// Mock store data
id = 1
const items = [
  {id: id++, name: 'Wireless Earbuds', price: 49.99, date: date.getTime() - day * 15, verified: true},
  {id: id++, name: 'Water Bottle', price: 27.50, date: date.getTime() - day * 5},
  {id: id++, name: 'Yoga Mat', price: 35.00, date: date.getTime() - day * 42},
  {id: id++, name: 'Desk Lamp', price: 15.00, date: date.getTime() - day * 20},
  {id: id++, name: 'Wireless Mouse', price: 45.00, date: date.getTime() - day * 21, verified: true},
  {id: id++, name: 'CATAN Board Game', price: 25.00, date: date.getTime() - day * 33}
]

// Sort items by first "verified" then second "date"
function sortItems() {
  items.sort((item1, item2) => {
    if ((item1.verified || false) != (item2.verified || false)) return (item2.verified || false) - (item1.verified || false);
    return item2.date - item1.date;
  });
}

// Get items from store route
router.get('/store', (req, res) => {
  const query = req.query;
  // Return explicit item if given id
  if (query.id)
  {
    const item = items.find(i => i.id == query.id);
    if (!item) return res.status(400).send({message: "No item with this id"});
    return res.status(200).send({items: [item]});
  }
  // Return items in sorted order by first "verified" then second "date"
  sortItems()
  res.status(200).send({items: items});
});

// Add item listing to store route
router.post('/store', (req, res) => {
  const body = req.body;

  // Check if valid listing info is sent
  if (!body.name || !body.price) return res.status(400).send({message: 'Listing requires item name and price'});

  // Create item 
  const new_item = {id: id++, name: body.name, price: body.price, date: new Date().getTime()};

  // Check if item should be verified
  if (body.verified) {
    new_item.verified = true;
  }

  items.push(new_item)
  res.status(201).send({ message: "Item listed."});
  console.log(`API: Item listed "${body.name}"`)
});

module.exports = router;