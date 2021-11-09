import { GetServerSideProps } from 'next';
import { addConversation, getConversations } from '../services/conversation/conversation';
import { Conversation } from '../types/conversation';
import { getLoggedUserId } from '../utils/getLoggedUserId';
import { ConversationCard } from '../components/ConversationCard';
import AddIcon from '@mui/icons-material/Add';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';

import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { getUsers } from '../services/users/users';
import { User } from '../types/user';
import { useRouter } from 'next/router';

interface ConversationPageProps {
  conversations: Conversation[];
  snackbarOpen: boolean;
  users: User[];
}
const loggedUserId = getLoggedUserId();

export const getServerSideProps: GetServerSideProps<ConversationPageProps> = async context => {
  try {
    const conversations = await getConversations(loggedUserId);
    const users = await getUsers();

    return Promise.resolve({
      props: { conversations: conversations, snackbarOpen: false, users },
    });
  } catch (e) {
    return Promise.resolve({
      props: { conversations: [], snackbarOpen: true, users: [] },
    });
  }
};

interface UsersDialogProps {
  onClose: (value: string) => void;
  open: boolean;
  selectedValue: string;
  users: User[];
}

const UsersDialog = ({ onClose, open, selectedValue, users }: UsersDialogProps): JSX.Element => {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = value => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Nouvelle discution avec</DialogTitle>
      <List sx={{ pt: 0 }}>
        {users.map(user => (
          <ListItem button onClick={() => handleListItemClick(user.id)} key={user.id}>
            <ListItemAvatar>
              <Avatar>{user.nickname.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.nickname} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export const ConversationsPage = ({
  conversations,
  snackbarOpen,
  users,
}: ConversationPageProps): JSX.Element => {
  const [isSnackbarOpened, setIsSnackbarOpened] = useState(snackbarOpen);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');
  const router = useRouter();
  const [conversationsState, setConversationState] = useState(conversations.slice());
  const handleSnackbarClose = () => {
    setIsSnackbarOpened(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async value => {
    setOpen(false);
    if (value) {
      setSelectedValue(value);
      const conversation = await addConversation({
        senderNickname: users.filter(user => user.id === loggedUserId)[0].nickname,
        userId: loggedUserId,
        recipientId: value,
        recipientNickname: users.filter(user => user.id === value)[0].nickname,
      });

      if (!conversationsState.filter(conv => conv.id === conversation.data.id)[0]) {
        setConversationState([...conversationsState, conversation.data]);
      }

      router.push(`/conversation/${conversation.data.id}`);
    }
  };

  return (
    <Box sx={{ pb: 7 }}>
      <Snackbar open={isSnackbarOpened} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity="warning" sx={{ width: '100%' }}>
          Un problème est survenu durant la récupération des conversations
        </Alert>
      </Snackbar>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            Conversations
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <List>
        {conversationsState.map(conversation => (
          <ConversationCard
            key={conversation.id}
            conversation={conversation}
            currentUserId={loggedUserId}
          />
        ))}
      </List>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation showLabels>
          <BottomNavigationAction
            onClick={handleClickOpen}
            label="Nouvelle conversation"
            icon={<AddIcon />}
          />
        </BottomNavigation>
      </Paper>
      <UsersDialog open={open} onClose={handleClose} selectedValue={selectedValue} users={users} />
    </Box>
  );
};

export default ConversationsPage;
