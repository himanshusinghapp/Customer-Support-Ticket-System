import { getRabbitMQChannel, connectRabbitMQ } from '@config/rabbit';
import { sendEmail } from '@utils/email';
import { Channel } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const QUEUE1 = 'ticket_created';
const QUEUE2 = 'ticket_replied';

const startNotificationWorker = async () => {
  let channel: Channel;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;

  const setupChannel = async () => {
    try {
      await connectRabbitMQ();
      channel = getRabbitMQChannel();
      
      // Handle channel errors
      channel.on('error', (err) => {
        console.error('❌ Channel error:', err.message);
      });
      
      channel.on('close', async () => {
        console.log('🔄 Channel closed, reconnecting...');
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          await new Promise(resolve => setTimeout(resolve, 5000));
          await setupChannel();
        } else {
          console.error('❌ Max reconnection attempts reached');
          process.exit(1);
        }
      });

      // Setup consumers
      await setupConsumers();
    } catch (error) {
      console.error('❌ Channel setup error:', error);
      throw error;
    }
  };

  const setupConsumers = async () => {
    try {
      // 📨 Listen for ticket creation
      console.log(`📥 Worker listening on queue: ${QUEUE1}`);
      await channel.consume(QUEUE1, async (msg) => {
        if (!msg) return;
        
        try {
          const { ticketId, subject, userEmail } = JSON.parse(msg.content.toString());
          
          if (!userEmail) {
            console.error(`❌ No recipient email for ticket ${ticketId}`);
            return;
          }

          console.log(`📧 Sending email for ticket creation: ${ticketId} to ${userEmail}`);
          await sendEmail(
            userEmail,
            `New Support Ticket Created (#${ticketId})`,
            `A new ticket has been created:\n\nSubject: ${subject}\nTicket ID: ${ticketId}`
          );
          
          // Ack only after successful processing
          channel.ack(msg);
        } catch (err) {
          console.error(`❌ Error processing message from ${QUEUE1}:`, err);
          // Nack the message (optional: requeue or dead-letter)
          channel.nack(msg, false, false);
        }
      });

      // 📨 Listen for ticket replies
      console.log(`📥 Worker listening on queue: ${QUEUE2}`);
      await channel.consume(QUEUE2, async (msg) => {
        if (!msg) return;
        
        try {
          const { ticketId, replyMessage, userEmail } = JSON.parse(msg.content.toString());
          
          if (!userEmail) {
            console.error(`❌ No recipient email for ticket reply ${ticketId}`);
            return;
          }

          console.log(`📧 Sending email for ticket reply: ${ticketId} to ${userEmail}`);
          await sendEmail(
            userEmail,
            `Reply Added to Your Support Ticket (#${ticketId})`,
            `Hi,\n\nYou have a new reply to your support ticket:\n\nTicket ID: ${ticketId}\nReply: ${replyMessage}\n\nThanks,\nSupport Team`
          );
          
          // Ack only after successful processing
          channel.ack(msg);
        } catch (err) {
          console.error(`❌ Error processing message from ${QUEUE2}:`, err);
          // Nack the message (optional: requeue or dead-letter)
          channel.nack(msg, false, false);
        }
      });

    } catch (error) {
      console.error('❌ Consumer setup error:', error);
      throw error;
    }
  };

  try {
    await setupChannel();
    console.log('✅ Notification worker running');
  } catch (error) {
    console.error('❌ Worker startup failed:', error);
    process.exit(1);
  }
};

startNotificationWorker();