const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'mydb';
const secretKey = 'your-secret-key';
const iv = crypto.randomBytes(16);
const algorithm = 'aes-256-ctr';

const client = new MongoClient(mongoUrl);

app.get('/', (req, res) => {
  res.send('Backend is running.');
});

server.listen(3000, () => {
  console.log('Listener Server listening on port 3000');
});

const messageSchema = Joi.object({
  name: Joi.string().required(),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  secret_key: Joi.string().required()
});

io.on('connection', (socket) => {
  console.log('Listener: A new client connected');

  socket.on('encryptedData', async (encryptedData) => {
    const decryptedMessage = decryptMessage(encryptedData);
    const { error, value } = messageSchema.validate(decryptedMessage);

    if (error) {
      console.log('Listener: Invalid message:', error.details[0].message);
      return;
    }

    const isValid = await validateAndIntegrity(value);

    if (isValid) {
      const timestampedData = addTimestamp(value);
      await saveToMongo(timestampedData);
      console.log('Listener: Saved to MongoDB:', timestampedData);
    } else {
      console.log('Listener: Discarded compromised data:', value);
    }
  });
});

function decryptMessage(encryptedData) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'hex')), decipher.final()]);
  return JSON.parse(decrypted.toString());
}

async function validateAndIntegrity(decryptedMessage) {
  const receivedSecretKey = decryptedMessage.secret_key;
  delete decryptedMessage.secret_key;

  const sha256Hash = crypto.createHash('sha256').update(JSON.stringify(decryptedMessage)).digest('hex');

  return await bcrypt.compare(sha256Hash, receivedSecretKey);
}

async function saveToMongo(data) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('time_series_data');

    const currentTime = new Date();
    const currentMinute = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), currentTime.getMinutes());

    const existingDocument = await collection.findOne({ timestamp: currentMinute });
    if (existingDocument) {
      await collection.updateOne(
        { _id: existingDocument._id },
        { $push: { data } }
      );
    } else {
      await collection.insertOne({ timestamp: currentMinute, data: [data] });
    }
  } finally {
    await client.close();
  }
}
