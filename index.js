const express = require('express');
const axios = require('axios');
const dapr = require('dapr-client');

const app = express();
const port = 3000;

// Initialize Dapr client
const daprClient = dapr();

// Define routes
app.get('/api/products', async (req, res) => {
  try {
    // Fetch secrets from Dapr
    const devicesApiKey = await daprClient.secrets.get('devicesapi-secret', 'api-key');
    const customersApiKey = await daprClient.secrets.get('customersapi-secret', 'api-key');

    // Call external APIs using Dapr HTTP bindings
    // const devicesResponse = await axios.post('http://localhost:3500/v1.0/invoke/devicesapi/method/getData', {});
    // const customersResponse = await axios.post('http://localhost:3500/v1.0/invoke/customersapi/method/getData', {});

    // Call external APIs with fetched secrets - WITHIN K8S cluster
    const devicesResponse = await axios.get('http://devicesapi.default.svc.cluster.local', {
      headers: { 'x-functions-key': devicesApiKey }
    });
    const customersResponse = await axios.get('http://customersapi.default.svc.cluster.local', {
      headers: { 'x-functions-key': customersApiKey }
    });

    // Return combined data
    res.json({
      devices: devicesResponse.data,
      customers: customersResponse.data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`ProductsAPI listening at http://localhost:${port}`);
});


