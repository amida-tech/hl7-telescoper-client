import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';

import { Container, Paper, Typography, TextField, makeStyles, Grid, Button } from '@material-ui/core';

import { IUserStore, USER_STORE } from '../stores/userStore';
import { Link } from 'react-router-dom';

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

// TODO loading state during request
const SignUpPageImpl: React.FC<RouteComponentProps & { userStore: IUserStore }> = (props) => {
  const { userStore, history } = props;
  const { signUp } = userStore;

  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const signUpAction = async () => {
    try {
      setError(false);
      await signUp(email, username, password);
      history.push('/auth/login');
    } catch {
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
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Grid>
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
          onClick={signUpAction}
        >
          sign up
        </Button>
        { error && (
          <Typography variant="body1">
            Error. Try Again.
          </Typography>
        )}
        <Link to="/auth/login">Login here</Link>
      </Paper>
    </Container>
  );
};

export const SignUpPage = inject(USER_STORE)(observer(SignUpPageImpl));
