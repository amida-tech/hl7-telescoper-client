import React from 'react';
import { RouteComponentProps } from 'react-router';

import { Container, Paper, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 4),
    margin: theme.spacing(3),
  },
  title: {
    padding: theme.spacing(0, 0, 3, 0),
  },
}));

const FilesPageImpl: React.FC<RouteComponentProps> = (props) => {
  const classes = useStyles();
  return (
    <Container maxWidth="sm">
      <Paper className={classes.root}>
        <Typography
          align="center"
          variant="h2"
          className={classes.title}
        >
          Files
        </Typography>
      </Paper>
    </Container>
  );
}

export const FilesPage = FilesPageImpl
