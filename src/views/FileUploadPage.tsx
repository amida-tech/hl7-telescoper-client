import React, { useState, ChangeEvent } from 'react';
import { RouteComponentProps } from 'react-router';

import { Container, Paper, Typography, makeStyles, Grid, TextField, Button } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import { telescoperApi } from '../services/api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 4),
    margin: theme.spacing(3),
  },
  title: {
    padding: theme.spacing(0, 0, 3, 0),
  },
  button: {
    margin: theme.spacing(4, 0, 0, 0),
  },
}));

const FileUploadPageImpl: React.FC<RouteComponentProps> = (props) => {
  const { history } = props;

  const classes = useStyles();
  const [error, setError] = useState(false);

  const uploadAction = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setError(false)
      await telescoperApi.uploadFile(event.target.files![0])
      history.push('/app/files')
    } catch {
      setError(true)
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper className={classes.root}>
        <Typography
          align="center"
          variant="h2"
          className={classes.title}
        >
         Upload a file
        </Typography>
        <Grid
          container
          alignItems="center"
          direction="column"
          spacing={2}
        >
          <Grid item>
          </Grid>
        </Grid>
        <Button
          fullWidth
          className={classes.button}
          component="label"
        >
          choose and upload file
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(event) => uploadAction(event)}
          />
        </Button>
        { error && (
          <Typography variant="body1">
            Error. Try Again.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export const FileUploadPage = FileUploadPageImpl
