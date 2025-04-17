import { getRabbitMQChannel, connectRabbitMQ } from '../config/rabbit';
import { sendNotificationEmail } from '../utils/email';
import dotenv from 'dotenv';

dotenv.config();

const QUEUE = 'ticket_created';

const startWorker = async () => {
  try {
    await connectRabbitMQ();
    const channel = getRabbitMQChannel();

    console.log(`📥 Notification Worker listening on queue: ${QUEUE}`);
    channel.consume(QUEUE, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        const { ticketId, subject } = data;

        console.log(`📧 Notifying support team: Ticket #${ticketId} - ${subject}`);

        // ✅ Send email
        await sendNotificationEmail(
          'himanshu6306singh@gmail.com', 
          `New Support Ticket Created (#${ticketId})`,
          `A new ticket has been created:\n\nSubject: ${subject}\nTicket ID: ${ticketId}`
        );

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('❌ Error in Notification Worker:', error);
    process.exit(1);
  }
};

startWorker();
