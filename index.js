const express = require('express');
const fs = require('fs');
var cors = require('cors');

const app = express();

const PORT = 3000;

// Middlewares
app.use(express.json());
// Define a CORS configuration with the allowed origin
const corsOptions = {
  origin: ['https://console.asgardeo.io', 'https://dev.console.asgardeo.io'],
  credentials: true, // Enable credentials (cookies, HTTP authentication)
};

app.use(cors(corsOptions));

// Index route.
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to the External Integrations API.',
  });
});

app.get('/integrations/applications', (req, res) => {
  const integrations = [];

  fs.readdirSync('./applications').forEach((directory) => {
    // check if the directory is actually a directory.
    if (!fs.lstatSync(`./applications/${directory}`).isDirectory()) {
      return;
    }

    fs.readdirSync(`./applications/${directory}`).forEach((file) => {
      if (file === 'info.json') {
        const info = require(`./applications/${directory}/${file}`);
        integrations.push(info);
      }
    });
  });

  res.status(200).json(integrations);
});

app.get('/integrations/applications/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json(require(`./applications/${id}/template.json`));
});

app.get('/integrations/applications/:id/metadata', (req, res) => {
  const { id } = req.params;
  res.status(200).json(require(`./applications/${id}/metadata.json`));
});

app.listen(PORT, () => {
  console.log(`The server has started on port ${PORT}...`);
});
