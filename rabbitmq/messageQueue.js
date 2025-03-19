const amqp = require("amqplib");

class MessageQueue {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      console.log("Connected to RabbitMQ");
    } catch (error) {
      console.error("RabbitMQ Connection Error:", error);
      throw error;
    }
  }

  async createQueue(queueName) {
    try {
      await this.channel.assertQueue(queueName, {
        durable: true,
      });
      console.log(`Queue ${queueName} created`);
    } catch (error) {
      console.error(`Error creating queue ${queueName}:`, error);
      throw error;
    }
  }

  async createExchange(exchangeName, type = "topic") {
    try {
      await this.channel.assertExchange(exchangeName, type, {
        durable: true,
      });
      console.log(`Exchange ${exchangeName} created`);
    } catch (error) {
      console.error(`Error creating exchange ${exchangeName}:`, error);
      throw error;
    }
  }

  async bindQueue(queueName, exchangeName, routingKey) {
    try {
      await this.channel.bindQueue(queueName, exchangeName, routingKey);
      console.log(
        `Queue ${queueName} bound to exchange ${exchangeName} with routing key ${routingKey}`
      );
    } catch (error) {
      console.error(`Error binding queue ${queueName}:`, error);
      throw error;
    }
  }

  async publishToExchange(exchangeName, routingKey, message) {
    try {
      await this.channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
          contentType: "application/json",
        }
      );
      console.log(
        `Message published to exchange ${exchangeName} with routing key ${routingKey}`
      );
    } catch (error) {
      console.error(
        `Error publishing message to exchange ${exchangeName}:`,
        error
      );
      throw error;
    }
  }

  async publishToQueue(queueName, message) {
    try {
      await this.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
          contentType: "application/json",
        }
      );
      console.log(`Message published to queue ${queueName}`);
    } catch (error) {
      console.error(`Error publishing message to queue ${queueName}:`, error);
      throw error;
    }
  }

  async consume(queueName, callback) {
    try {
      await this.channel.consume(queueName, async (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          await callback(content);
          this.channel.ack(message);
        }
      });
      console.log(`Consumer started for queue ${queueName}`);
    } catch (error) {
      console.error(`Error consuming from queue ${queueName}:`, error);
      throw error;
    }
  }

  async close() {
    try {
      await this.channel.close();
      await this.connection.close();
      console.log("Disconnected from RabbitMQ");
    } catch (error) {
      console.error("Error closing RabbitMQ connection:", error);
      throw error;
    }
  }
}

module.exports = new MessageQueue();
