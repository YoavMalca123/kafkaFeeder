"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const apiMovies = 'http://localhost:3001/api/movies';
const apiShows = 'http://localhost:3002/api/tvshows';
// Configure the Kafka client
const kafka = new kafkajs_1.Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'] // Update with your Kafka broker address
});
const producer = kafka.producer();
function sendToKafka(topic, message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield producer.connect();
        yield producer.send({
            topic,
            messages: [{ value: message }]
        });
        yield producer.disconnect();
    });
}
function fetchDataAndSendToKafka() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch data from both APIs
            const [response1, response2] = yield Promise.all([
                fetch(apiMovies),
                fetch(apiShows),
            ]);
            const [data1, data2] = yield Promise.all([
                response1.json(),
                response2.json(),
            ]);
            // Send data to Kafka
            for (let i = 0; i < data1.length; i++) {
                yield sendToKafka('test-topic1', JSON.stringify(data1[i]));
            }
            // await sendToKafka('api1-topic', JSON.stringify(data1));
            // await sendToKafka('api2-topic', JSON.stringify(data2));
            console.log('Data sent to Kafka successfully.');
        }
        catch (error) {
            console.error('Error fetching data or sending to Kafka:', error);
        }
    });
}
// Run the function to fetch data and send to Kafka
fetchDataAndSendToKafka();
