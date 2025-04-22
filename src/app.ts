import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '@config/db';
import { connectRabbitMQ } from '@config/rabbit';
import { setupSwagger } from '@config/swagger';
// import authRoutes from '@routes/v1/auth.routes';
// import userRoutes from '@routes/v1/user.routes';
// import ticketRoutes from '@routes/v1/ticket.routes';
// import replyRoutes from '@routes/v1/reply.routes';
import routes from './routes';
import { loggerMiddleware } from '@config/logger';

import cors from 'cors';
//import morgan from 'morgan';


dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());
//app.use(morgan('dev'));
app.use(loggerMiddleware);

connectDB();
connectRabbitMQ().catch(err => {
    console.error('RabbitMQ connection failed:', err);
    process.exit(1);
  });

setupSwagger(app);

app.use(routes);
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/tickets', ticketRoutes);
// app.use('/api/replies', replyRoutes); // nested under /tickets/:id


export default app;
