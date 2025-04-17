import amqplib from 'amqplib';

let channel: amqplib.Channel;

export const connectRabbitMQ = async () => {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL!);
  channel = await connection.createChannel();
  await channel.assertQueue('ticket_created');
  console.log('✅ Connected to RabbitMQ');
};

export const getRabbitMQChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  return channel;
};

// ✅ This is what makes publishToQueue work
export const publishToQueue = async (queue: string, data: any) => {
  const channel = getRabbitMQChannel();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
};
