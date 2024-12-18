// const kafka = require('kafka-node');
// const express = require('express');

// const app = express();
// const port = 5000;

// // Kafka Client
// const kafkaClient = new kafka.KafkaClient({ kafkaHost: '127.0.0.1:9092' });
// const producer = new kafka.Producer(kafkaClient);

// producer.on('ready', () => {
//   console.log('Kafka Producer is connected and ready.');
// });

// producer.on('error', (err) => {
//   console.error('Kafka Producer error:', err);
// });

// app.get('/send', (req, res) => {
//   const message = 'Hello from Express Service!';
//   producer.send([{ topic: 'broker_topic', messages: message }], (err) => {
//     if (err) {
//       return res.status(500).send('Error sending to Kafka');
//     }
//     res.send('Message sent from Express Service');
//   });
// });

// app.listen(port, () => {
//   console.log(`Express Service running on http://localhost:${port}`);
// });


const kafka = require('kafka-node');
const express = require('express');

const app = express();
const port = 5000;

// Kafka Client và Producer
const kafkaClient = new kafka.KafkaClient({ kafkaHost: '127.0.0.1:9092' });
const producer = new kafka.Producer(kafkaClient);

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (err) => {
  console.error('Kafka Producer error:', err);
});

// Endpoint gửi tin nhắn vào Kafka
app.get('/send', (req, res) => {
  const message = req.query.message || 'Hello from Express Service!';
  
  producer.send(
    [{ topic: 'support_chat', messages: message }],
    (err, data) => {
      if (err) {
        return res.status(500).send('Error sending message to Kafka');
      }
      res.send('Message sent to Kafka');
    }
  );
});

app.listen(port, () => {
  console.log(`Express Service running on http://localhost:${port}`);
});
