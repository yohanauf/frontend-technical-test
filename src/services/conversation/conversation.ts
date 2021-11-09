import axios from 'axios';
import { Conversation } from '../../types/conversation';
import { Message } from '../../types/message';
import { getMessages } from '../messages/messages';

export const getConversations = async (userId: number): Promise<Conversation[]> => {
  const res = await axios.get<Conversation[]>(`http://localhost:3005/conversations/${userId}`);

  return res.data;
};

export const getConversation = async (conversationId: number): Promise<Message[]> => {
  return await getMessages(conversationId);
};
