import axios from 'axios';
import { User } from '../../types/user';

export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get<User[]>(`http://localhost:3005/users`);

  return res.data;
};
