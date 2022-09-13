const express = require('express');
const cors = require('cors');
const { randomIntFromInterval } = require('./utils.js');

// variables block
const app = express();
const PORT = 3001;
let clients = [];
let listCurrencyMonitoring = ["USD"]; // USD is default currency to monitoring cost at client, server logic
let currencyCost = {};

app.listen(PORT, () => {
  console.log(`listCurrencyMonitoring service listening at http://localhost:${PORT}`);

  setInterval(() => {
    const result = {};
    if (listCurrencyMonitoring.length) {
        for (const value of listCurrencyMonitoring) {
            result[value] = randomIntFromInterval(100, 1000)
        }
        currencyCost = result;
    }
    pushNewDataToClients();
}, 2000);
});


app.use(cors());
app.use(express.json());

// Routes
app.get('/status', (response) => response.json({clients: clients.length}));
app.get('/monitoring', monitoringHandler);
app.post('/update', updateListMonitoringHandler);


// Methods to handle request from routes (endpoints)
function pushNewDataToClients() {
  // This method is a push (SSE)
  clients.forEach(client => client.response.write(`data: ${JSON.stringify(currencyCost)}\n\n`))
}

function monitoringHandler(request, response) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);
  const data = `data: ${JSON.stringify(currencyCost)}\n\n`;
  response.write(data);
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    response
  };
  clients.push(newClient);
  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
}

function updateListMonitoringHandler(request, respsonse) {
  listCurrencyMonitoring = request.body;
  respsonse.json({ updateComplete: true });
  return sendEventsToAll();
}