import React, { useState } from 'react';
import { Link, RouteProps, useNavigate } from 'react-router-dom';

import { Container, Paper, Typography, makeStyles, Grid, TextField, Button } from '@material-ui/core';
import { IUserStore, USER_STORE } from '../stores/userStore';
import { observer, inject } from 'mobx-react';

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

const LoginPageImpl: React.FC<RouteProps & { userStore: IUserStore }> = (props) => {
  const { userStore } = props;
  const nav = useNavigate();

  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const signUpAction = async () => {
    try {
      setError(false);
      await userStore.login(username, password);
      nav('/app/files');
    } catch (error: any) {
      setError(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper className={classes.root}>
        <Typography
          align="center"
          variant="h2"
          className={classes.title}
        >
          HL7 Telescoper
        </Typography>
        <Grid
          container
          alignItems="center"
          direction="column"
          spacing={2}
        >
          <Grid item>
            <TextField
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          className={classes.button}
          onClick={() => signUpAction()}
        >
          sign in
        </Button>
        {error && (
          <Typography variant="body1">
            Error. Try Again.
          </Typography>
        )}
        <Link to="/auth/signup">Register here</Link>
      </Paper>
    </Container>
  );
};

export const LoginPage = inject(USER_STORE)(observer(LoginPageImpl));
