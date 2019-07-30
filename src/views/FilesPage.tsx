import React from 'react';
import { RouteComponentProps } from 'react-router';

import { Container, Paper, Typography, makeStyles, Grid, Card, CardContent, CardActions, Button } from '@material-ui/core';
import { IFileStore, FILE_STORE } from '../stores/fileStore';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 4),
    margin: theme.spacing(3),
  },
  title: {
    padding: theme.spacing(0, 0, 3, 0),
  },
}));

const FilesPageImpl: React.FC<RouteComponentProps & { fileStore: IFileStore }> = (props) => {
  const { fileStore } = props
  const { files } = fileStore
  const classes = useStyles();
  return (
    <Container maxWidth="sm">
      <Typography
        variant="h2"
        className={classes.title}
      >
        Files
      </Typography>
      <Grid
        container
        direction="column"
        spacing={2}
      >
        {files.map((f) => (
          <Grid item key={f.id}>
            <Card>
              <CardContent>
                <Typography>
                  {f.filename}
                </Typography>
              </CardContent>
              <CardActions>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link to={`/app/files/${f.id}`}>
                      <Button>
                        explore
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export const FilesPage = inject(FILE_STORE)(observer(FilesPageImpl))
