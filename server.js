import express from 'express';
import xss from 'xss';

const app = express();

// Set static folder
app.use(express.static('public'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Handle GET request to fetch users
app.get('/users', async (req, res) => {
  // const users = [
  //   { id: 1, name: 'John Doe' },
  //   { id: 2, name: 'Bob Williams' },
  //   { id: 3, name: 'Shannon Jackson' },
  // ];

  setTimeout(async () => {
    const limit = +req.query.limit || 10;

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=${limit}`
    );
    const users = await response.json();

    res.send(`
    <h1 class="text-2xl font-bold my-4">Users</h1>
    <ul>
      ${users.map((user) => `<li>${user.name}</li>`).join('')}
    </ul>
  `);
  }, 2000);
});

// Handle POST request for temp conversion
app.post('/convert', (req, res) => {
  setTimeout(() => {
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celsius = (fahrenheit - 32) * (5 / 9);

    res.send(`
      <p>
        ${fahrenheit} degrees Farenheit is equal to ${celsius} degrees Celsius
      </p>
    `);
  }, 2000);
});

let counter = 0;

// Handle GET request for polling example
app.get('/poll', (req, res) => {
  counter++;

  const data = { value: counter };

  res.json(data);
});

let currentTemperature = 20;

// Handle GET request for weather
app.get('/get-temperature', (req, res) => {
  currentTemperature += Math.random() * 2 - 1; // Random temp change
  res.send(currentTemperature.toFixed(1) + '°C');
});

const contacts = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Doe', email: 'jane@example.com' },
  { name: 'Alice Smith', email: 'alice@example.com' },
  { name: 'Bob Williams', email: 'bob@example.com' },
  { name: 'Mary Harris', email: 'mary@example.com' },
  { name: 'David Mitchell', email: 'david@example.com' },
];

// Handle POST request for contacts search
app.post('/search', (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send('<tr></tr>');
  }

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  setTimeout(() => {
    const searchResultHtml = searchResults
      .map(
        (contact) => `
      <tr>
        <td><div class="my-4 p-2">${contact.name}</div></td>
        <td><div class="my-4 p-2">${contact.email}</div></td>
      </tr>
    `
      )
      .join('');

    res.send(searchResultHtml);
  }, 1000);
});

// Handle POST request for contacts search from jsonplaceholder
app.post('/search/api', async (req, res) => {
  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send('<tr></tr>');
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const contacts = await response.json();

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  setTimeout(() => {
    const searchResultHtml = searchResults
      .map(
        (contact) => `
      <tr>
        <td><div class="my-4 p-2">${contact.name}</div></td>
        <td><div class="my-4 p-2">${contact.email}</div></td>
      </tr>
    `
      )
      .join('');

    res.send(searchResultHtml);
  }, 1000);
});

// Handle POST request for email validation
app.post('/contact/email', (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    message: 'That email is valid',
    class: 'text-green-700',
  };

  const isInvalid = {
    message: 'Please enter a valid email address',
    class: 'text-red-700',
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
        >Email Address</label
      >
      <input
        name="email"
        hx-post="/contact/email"
        class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        type="email"
        id="email"
        value="${submittedEmail}"
        required
      />
      <div class="${isInvalid.class}">${isInvalid.message}</div>
    </div>
      `
    );
  } else {
    return res.send(
      `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
        >Email Address</label
      >
      <input
        name="email"
        hx-post="/contact/email"
        class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
        type="email"
        id="email"
        value="${submittedEmail}"
        required
      />
      <div class="${isValid.class}">${isValid.message}</div>
    </div>
      `
    );
  }
});

// Handle GET request for profile edit
app.get('/profile/:id/edit', (req, res) => {
  // You can send an HTML form for editing here
  res.send(`
  <div
  class="container mx-auto py-8 max-w-lg"
  hx-target="this"
  hx-swap="outerHTML"
>
<form hx-put="/profile/1" hx-target="this" hx-swap="outerHTML">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <div class="mb-4">
        <label for="name" class="text-lg font-semibold">Name</label>
        <input type="text" id="name" name="name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400" value="John Doe">
      </div>
      <div class="mb-4">
        <label for="bio" class="text-lg font-semibold">Bio</label>
        <textarea id="bio" name="bio" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400" rows="6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vestibulum vestibulum elit, ac facilisis ipsum eleifend sed. Duis tincidunt augue nec neque cursus, nec aliquet purus tempor.</textarea>
      </div>
      <div class="mt-6">
      <button type="submit" class="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-600">Save Changes</button>
      <button type="button" hx-get="/profile.html" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg ml-2 hover:bg-gray-400">Cancel</button>
    </div>
    </div>
  </form>
</div>
  `);
});

// Handle PUT request for editing
app.put('/profile/:id', (req, res) => {
  const name = xss(req.body.name);
  const bio = xss(req.body.bio);

  // Send the updated profile back
  res.send(`
  <div
  class="container mx-auto py-8 max-w-lg"
  hx-target="this"
  hx-swap="outerHTML"
>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold mb-4">${name}</h1>
    <p class="text-gray-700">
      ${bio}
    </p>

    <button
      hx-get="/profile/1/edit"
      class="bg-indigo-700 text-white font-bold w-full py-2 px-4 rounded-lg mt-4 hover:bg-indigo-600"
    >
      Click To Edit
    </button>
  </div>
</div>
  `);
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
