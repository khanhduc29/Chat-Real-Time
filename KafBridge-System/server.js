// const express = require('express');
// const kafka = require('kafka-node');
// const WebSocket = require('ws');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Kafka Setup
// const kafkaClient = new kafka.KafkaClient({ kafkaHost: '127.0.0.1:9092' });


// const producer = new kafka.Producer(kafkaClient);
// const consumer = new kafka.Consumer(
//   kafkaClient,
//   [{ topic: 'broker_topic', partition: 0 }],
//   { autoCommit: true }
// );

// // WebSocket Setupa
// const wss = new WebSocket.Server({ port: 4000 });

// wss.on('connection', (ws) => {
//   console.log('Client connected to WebSocket');
//   ws.on('message', (message) => {
//     console.log(`Received from client: ${message}`);
//     producer.send([{ topic: 'broker_topic', messages: message }], (err, data) => {
//       if (err) console.error('Kafka send error:', err);
//     });
//   });
// });

// consumer.on('message', (message) => {
//   console.log(`Received from Kafka: ${message.value}`);
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(message.value);
//     }
//   });
// });

// app.listen(port, () => {
//   console.log(`Express Broker running on http://localhost:${port}`);
// });


const express = require('express');
const kafka = require('kafka-node');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Kafka Client, Consumer và Producer
const kafkaClient = new kafka.KafkaClient({ kafkaHost: '127.0.0.1:9092' });

const producer = new kafka.Producer(kafkaClient);
const consumer = new kafka.Consumer(
  kafkaClient,
  [{ topic: 'support_chat', partition: 0 }],
  { autoCommit: true }
);

// WebSocket Server (cổng 4000)
const wss = new WebSocket.Server({ port: 4000 });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.on('message', (message) => {
    console.log(`Received from client: ${message}`);
    
    // Gửi tin nhắn từ WebSocket client vào Kafka
    producer.send(
      [{ topic: 'support_chat', messages: message }],
      (err, data) => {
        if (err) {
          console.error('Kafka send error:', err);
        }
      }
    );
  });
});

// Kafka Consumer: nhận tin nhắn từ Kafka và gửi tới WebSocket clients
consumer.on('message', (message) => {
  console.log(`Received from Kafka: ${message.value}`);
  
  // Gửi tin nhắn từ Kafka đến tất cả WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.value);
    }
  });
});

app.listen(port, () => {
  console.log(`Express Broker running on http://localhost:${port}`);
});
