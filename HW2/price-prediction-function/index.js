
exports.helloPubSub = async (message, context) => {
  const name = message.data ? Buffer.from(message.data, 'base64').toString() : undefined;
  console.log(name);
  if (name !== undefined) {
    const {PubSub} = require('@google-cloud/pubsub');
    const pubsub = new PubSub();
    const topicId = "price-estimate-available";
    console.log(`Publishing message to topic ${topicId}`);
    const topic = pubsub.topic(topicId);
    const messageObject = {
      data: {
        price: 100,
      },
    };
    const messageBuffer = Buffer.from(JSON.stringify(messageObject), 'utf8');

    // Publishes a message
    try {
      const result = await topic.publish(messageBuffer);
      console.log(`Published: ${result}`)
    } catch (err) {
      console.error(err);
    }
  }
}