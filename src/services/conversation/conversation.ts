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

export const addConversation = async ({
  userId,
  recipientNickname,
  recipientId,
  senderNickname,
}: {
  userId: number;
  recipientId: number;
  senderNickname: string;
  recipientNickname: string;
}) => {
  const userConversations = await getConversations(userId);
  const existConversation = userConversations.filter(
    conversation => conversation.recipientId === recipientId && conversation.senderId === userId,
  )[0];

  if (existConversation) {
    return Promise.resolve({ data: existConversation });
  } else {
    return await axios.post<Conversation>(`http://localhost:3005/conversations/${userId}`, {
      recipientId,
      senderId: userId,
      lastMessageTimestamp: Date.now() / 1000,
      senderNickname,
      recipientNickname,
    });
  }
};

export const getConversationActors = async (
  userId: number,
  conversationId: number,
): Promise<[string, string]> => {
  const res = await getConversations(userId);

  const conversation = res.filter(conversation => conversation.id === conversationId)[0];
  const recipientNickname =
    conversation.recipientId === userId
      ? conversation.senderNickname
      : conversation.recipientNickname;

  return [conversation.senderNickname, recipientNickname];
};

//get 404 on delete request see swager
// export const deleteConversation = async (conversationId: number): Promise<Conversation> => {
//   const res = await axios.delete<Conversation>(
//     `http://localhost:3005/conversation/${conversationId}`,
//   );
//   return res.data;
// };
