Real-time Data Processing Application
This is a small backend and frontend application that demonstrates real-time data processing. The application consists of three main components: Emitter Service, Listener Service, and Frontend.

Emitter Service
The Emitter Service generates and emits an encrypted data stream containing random messages at periodic intervals.

Technology Stack:

Node.js
Socket.IO
Crypto.js
File System
Functionality:
Load predefined data from data.json file.
Establish a Socket.IO server and listen for client connections.
Periodically emit a random encrypted data stream every 10 seconds.
Each message in the data stream contains random values for name, origin, and destination.
Encrypt each message using the AES-256-CTR encryption algorithm.
Emit the encrypted data stream over the socket connection.
Listener Service
The Listener Service receives and processes the encrypted data stream, decrypts it, validates the data, and stores it in a MongoDB collection.

Technology Stack:

Node.js
Express
Socket.IO
Crypto.js
MongoDB
Bcrypt.js
Hapi/Joi
Functionality:
Create an Express server to host the Listener Service.
Establish a Socket.IO connection to listen for the encrypted data stream.
Decrypt each received encrypted message.
Validate data integrity using the secret_key.
For valid data, add a timestamp and save it to a MongoDB collection.
Design the MongoDB schema for time-series data storage.
Use Hapi/Joi for data validation and Bcrypt.js for data integrity validation.
Frontend
The Frontend connects to the Listener Service and displays valid data in real-time.

Technology Stack:

HTML
JavaScript
Socket.IO
Functionality:
Create a simple HTML page to display the received data.
Establish a Socket.IO connection to the Listener Service.
Receive and display valid data in real-time.
Calculate and display the success rate for data transmission and decoding.
Getting Started
Install Node.js on your system.
Clone the repository and navigate to the project directory.
Run npm install to install the required dependencies.
Run the Emitter Service using node emitter.js and the Listener Service using node listener.js.
Open the index.html file in a web browser to see the Frontend display.
Conclusion
This application demonstrates how to create a real-time data processing pipeline using Node.js, Socket.IO, Crypto.js, MongoDB, and other libraries. It showcases the process of generating, transmitting, receiving, validating, and storing encrypted data in real-time. Feel free to extend and customize the application to meet your specific requirements and use cases.
