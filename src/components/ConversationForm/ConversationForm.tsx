import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/system';

type ConversationCardProps = {
  handleSubmit: (e: React.SyntheticEvent) => void;
  handleChangeValue: (e: React.SyntheticEvent) => void;
};

const StyledForm = styled('form')({
  display: 'flex',

  '> :first-child': {
    flex: 1,
  },
});

export const ConversationForm = ({
  handleSubmit,
  handleChangeValue,
}: ConversationCardProps): JSX.Element => {
  const [stateMessage, setMessage] = useState('');

  const onChangerHandler = (e: React.SyntheticEvent) => {
    handleChangeValue(e);
    const target = e.target as HTMLInputElement;
    setMessage(target.value);
  };

  const submitHandler = (e: React.SyntheticEvent) => {
    handleSubmit(e);
    setMessage('');
  };

  return (
    <StyledForm onSubmit={submitHandler}>
      <TextField
        multiline
        maxRows={4}
        value={stateMessage}
        onChange={onChangerHandler}
        variant="standard"
        placeholder="message..."
      />
      <IconButton type="submit">
        <SendIcon />
      </IconButton>
    </StyledForm>
  );
};

export default ConversationForm;
