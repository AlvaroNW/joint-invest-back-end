import { Router } from 'express';
import * as MessagesController from '../controllers/messsageController.js';

const MessagesRoutes = Router();

MessagesRoutes.route('/:userId').get(MessagesController.getMessages);

export default MessagesRoutes;
