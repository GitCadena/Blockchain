// services/blockchainService.js

async function sendLogToBlockchain(log) {
    console.log('Simulando el envío del log a la blockchain:', log);
    // Simulación de una espera por la respuesta de una blockchain externa
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  module.exports = { sendLogToBlockchain };
  