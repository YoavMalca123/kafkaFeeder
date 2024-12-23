
import { Kafka } from 'kafkajs';

const apiMovies = 'http://localhost:3001/api/movies';
const apiShows = 'http://localhost:3002/api/tvshows';

// Configure the Kafka client
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'] // Update with your Kafka broker address
});

const producer = kafka.producer();

async function sendToKafka(topic: string, message: string) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: message }]
  });
  await producer.disconnect();
}

async function fetchDataAndSendToKafka() {
  try {
    // Fetch data from both APIs
    const [response1, response2] = await Promise.all([
        fetch(apiMovies),
        fetch(apiShows),
    ]);

    const [data1, data2] = await Promise.all([
        response1.json(),
        response2.json(),
    ]);

    // Send data to Kafka
    for (let i = 0; i < data1.length; i++) {
        await sendToKafka('test-topic1', JSON.stringify(data1[i]));
    }
    for (let i = 0; i < data2.length; i++) {
      await sendToKafka('test-topic2', JSON.stringify(data2[i]));
    }
    // await sendToKafka('api1-topic', JSON.stringify(data1));
    // await sendToKafka('api2-topic', JSON.stringify(data2));

    console.log('Data sent to Kafka successfully.');
  } catch (error) {
    console.error('Error fetching data or sending to Kafka:', error);
  }
}

// Run the function to fetch data and send to Kafka
fetchDataAndSendToKafka();
