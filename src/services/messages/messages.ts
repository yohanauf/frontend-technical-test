import axios from 'axios';
import { Message } from '../../types/message';

export const getMessages = async (conversationId: number): Promise<Message[]> => {
  const res = await axios.get<Message[]>(`http://localhost:3005/messages/${conversationId}`);

  return res.data;
};

export const sendMessage = async ({
  message,
  conversationId,
  authorId,
}: {
  message: string;
  conversationId: number;
  authorId: number;
}) => {
  const res = await axios.post<Message>(`http://localhost:3005/messages/${conversationId}`, {
    body: message,
    conversationId,
    timestamp: Date.now() / 1000,
    authorId,
  });

  return res;
};
