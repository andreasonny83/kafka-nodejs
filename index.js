import express from 'express';
import bodyParser from 'body-parser';
import controllers from './controller.js';
import KafkaConfig from './config.js';
import Ably from 'ably';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const jsonParser = bodyParser.json();
const kafkaConfig = new KafkaConfig();

let ably;
try {
  ably = new Ably.Realtime(process.env.ABLY_API_KEY);
} catch (err) {
  console.log('\nERROR: Missing or wrong ABLY_API_KEY. Please check your .env file\n');
  process.exit(1);
}
const ablyChannel = ably.channels.get('channel2');

ablyChannel.subscribe(function (message) {
  console.log('got message', message);
});

app.post('/api/send', jsonParser, controllers.sendMessageToKafka);

// consume from topic "my-topic"
kafkaConfig.consume('my-topic', (value) => {
  console.log('📨 Receive message: ', value);
  ablyChannel.publish('kafka-event', value);
});

// setInterval(() => {
//   console.log('sending message');
//   const messages = [{ key: 'key1', value: 'hi there' }];
//   kafkaConfig.produce('my-topic', messages);
// }, 5000);

app.listen(8080, () => {
  console.log(`Server is running on port 8080.`);
});
