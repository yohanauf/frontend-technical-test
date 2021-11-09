import { Conversation } from '../../types/conversation';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Link from 'next/link';

import { getDistanceDateFromTimestamp } from '../../utils/date';
import React from 'react';

type ConversationCardProps = {
  conversation: Conversation;
  currentUserId: number;
};

export const ConversationCard = ({
  conversation,
  currentUserId,
}: ConversationCardProps): JSX.Element => {
  const cardTitle =
    currentUserId === conversation.senderId
      ? conversation.recipientNickname
      : conversation.senderNickname;

  return (
    <Link href={`/conversation/${conversation.id}`}>
      <CardActionArea>
        <ListItem>
          <ListItemAvatar>
            <Avatar>{cardTitle.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={cardTitle}
            secondary={
              <Typography color="text.secondary" variant="caption">
                {getDistanceDateFromTimestamp(conversation.lastMessageTimestamp)}
              </Typography>
            }
            color="text.primary"
          />
        </ListItem>
      </CardActionArea>
    </Link>
  );
};

export default ConversationCard;
