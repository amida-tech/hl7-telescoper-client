import React from 'react';
import { RouteComponentProps } from 'react-router';

import { Container, Paper, Typography, makeStyles, Grid, Button } from '@material-ui/core';
import { IFileStore, FILE_STORE } from '../stores/fileStore';
import { observer, inject } from 'mobx-react';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 4),
    margin: theme.spacing(3),
  },
  title: {
    padding: theme.spacing(0, 0, 3, 0),
  },
}));

const MessagePageImpl: React.FC<RouteComponentProps & { fileStore: IFileStore }> = (props) => {
  const { fileStore } = props
  const { files } = fileStore
  const classes = useStyles();
  return (
    <Container>
      <Typography
        variant="h4"
        className={classes.title}
      >
        Message
      </Typography>
    </Container>
  );
}

export const MessagePage = inject(FILE_STORE)(observer(MessagePageImpl))
