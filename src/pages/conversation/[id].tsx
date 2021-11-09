import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getConversation, getConversationActors } from '../../services/conversation/conversation';
import { getLoggedUserId } from '../../utils/getLoggedUserId';
import { MessageCard } from '../../components/MessageCard';
import { ConversationForm } from '../../components/ConversationForm';
import { Message } from '../../types/message';
import { sendMessage } from '../../services/messages/messages';
import { styled } from '@mui/system';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const loggedUserId = getLoggedUserId();

interface ConversationPageProps {
  messages: Message[];
  conversationId: number;
  snackbarOpen: boolean;
  senderNickname: string;
  recipientNickname: string;
}

export const getServerSideProps: GetServerSideProps<ConversationPageProps> = async context => {
  const { id } = context.query;

  try {
    const messages = await getConversation(Number(id));
    const [senderNickname, recipientNickname] = await getConversationActors(
      loggedUserId,
      Number(id),
    );

    return Promise.resolve({
      props: {
        messages: messages,
        conversationId: Number(id),
        snackbarOpen: false,
        senderNickname,
        recipientNickname,
      },
    });
  } catch (e) {
    return Promise.resolve({
      props: {
        messages: [],
        conversationId: Number(id),
        snackbarOpen: true,
        senderNickname: '',
        recipientNickname: '',
      },
    });
  }
};

const MessagesContainer = styled('div')({
  overflow: 'auto',
  flex: 1,
});

const MessagesLayout = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const FormContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: '0',
  width: '100%',
  padding: '1rem',
  top: 'auto',
  backgroundColor: theme.palette.background.default,
}));

MessagesLayout;

export const ConversationPage = ({
  messages,
  conversationId,
  snackbarOpen,
  senderNickname,
  recipientNickname,
}: ConversationPageProps): JSX.Element => {
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (currentMessage === '') {
      return;
    }

    const msg = await sendMessage({
      message: currentMessage,
      conversationId,
      authorId: loggedUserId,
    });
    setMessages([...stateMessages, msg.data]);
    setCurrentMessage('');
  };

  const handleFormChange = async (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setCurrentMessage(target.value);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpened(false);
  };

  const [stateMessages, setMessages] = useState(messages.slice());
  const [currentMessage, setCurrentMessage] = useState('');
  const [firstLoading, setfirstLoading] = useState(true);
  const [isSnackbarOpened, setIsSnackbarOpened] = useState(snackbarOpen);

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: firstLoading ? 'auto' : 'smooth',
    });

    firstLoading && setfirstLoading(false);
  }, [stateMessages]);

  return (
    <>
      <Snackbar open={isSnackbarOpened} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity="warning" sx={{ width: '100%' }}>
          Un problème est survenu durant la récupération des messages
        </Alert>
      </Snackbar>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Link href="/">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography variant="h6" color="inherit" component="div">
            {recipientNickname}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <MessagesLayout>
          <MessagesContainer>
            {stateMessages.map(message => (
              <MessageCard
                key={message.id}
                recipientNickname={recipientNickname}
                message={message}
                currentUserId={loggedUserId}
              />
            ))}
          </MessagesContainer>
        </MessagesLayout>
      </Container>
      <Toolbar />
      <FormContainer>
        <ConversationForm handleSubmit={handleSubmit} handleChangeValue={handleFormChange} />
      </FormContainer>
    </>
  );
};

export default ConversationPage;
