import { Message } from '../../types/message';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { lightBlue, blueGrey } from '@mui/material/colors';

import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';

type ChatBubbleProps = {
  type: 'from' | 'to';
  theme?: Theme;
};

const ChatBubble = styled('div')(({ type, theme }: ChatBubbleProps) => ({
  padding: 10,
  borderRadius: 10,
  background: type === 'from' ? lightBlue[100] : blueGrey[200],
  overflow: 'hidden',
  maxWidth: '50vw',
  color: theme.palette.background.default,
  whiteSpace: 'pre-line',
}));

const StyledAvatar = styled(Avatar)({
  marginRight: '1rem',
});

type MessageCardProps = {
  message: Message;
  currentUserId: number;
  recipientNickname?: string;
};

export const MessageCard = ({
  message,
  currentUserId,
  recipientNickname,
}: MessageCardProps): JSX.Element => {
  const cardType = currentUserId === message.authorId ? 'from' : 'to';
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: cardType === 'to' ? 'row' : 'row-reverse',
        alignItems: 'flex-end',
        p: 1,
        m: 1,
      }}
    >
      {cardType === 'to' && <StyledAvatar>{recipientNickname.charAt(0)}</StyledAvatar>}
      {/* <div> */}
      <ChatBubble type={cardType}>
        <Typography variant="body2" component="p">
          {message.body}
        </Typography>
      </ChatBubble>
      {/* <Typography component="p" variant="caption">
          {message.timestamp}
        </Typography> */}
      {/* </div> */}
    </Box>
  );
};

export default MessageCard;
