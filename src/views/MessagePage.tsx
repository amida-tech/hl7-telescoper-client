import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { Typography, makeStyles, TextField, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';

import mockMessage from '../data/mockMessage';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    height: '100vh',
    gridTemplateColumns: '1fr 2fr 1fr 1fr',
    gridTemplateRows: 'auto 3fr 4fr',
    // gridTemplateAreas: `
    //   "title filter filter select"
    //   "raw raw raw raw"
    //   "list list list list"
    // `,
    gridTemplateAreas: `
      "title filter filter select"
      "raw raw list list"
      "raw raw list list"
    `,
  },
  title: {
    gridArea: 'title',
    alignSelf: 'center',
    paddingLeft: theme.spacing(1),
  },
  filter: {
    gridArea: 'filter',
    alignSelf: 'center',
  },
  messageSelector: {
    marginLeft: 'auto',
    gridArea: 'select',
    alignSelf: 'center',
    textAlign: 'right',
  },
  rawMessageContainer: {
    gridArea: 'raw',
    fontFamily: 'monospace',
    overflow: 'scroll',
    boxShadow: 'inset 0 10px 10px -10px #b0b0b0',
    marginTop: theme.spacing(1),
    padding: theme.spacing(2, 1),
    fontSize: '1.2em',
    lineHeight: '1.3em',
    whiteSpace: 'nowrap',
    // resize: 'vertical',
  },
  segmentListContainer: {
    gridArea: 'list',
    overflow: 'scroll',
    marginTop: theme.spacing(1),
  },
  listSection: {
    backgroundColor: 'white',
  },
  listSectionList: {
    backgroundColor: 'white',
    padding: 0,
  },
  selectedListSectionList: {
    backgroundColor: 'lightblue',
    padding: 0,
  },
  listSectionListHeader: {
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  selectedSegment: {
    width: 'max-content',
    backgroundColor: 'lightblue',
  },
  selectedField: {
    backgroundColor: 'lightgreen',
  },
  field: {
    '&:hover': {
      backgroundColor: 'yellow',
      cursor: 'pointer',
    },
  },
}));

const MessagePageImpl: React.FC<RouteComponentProps> = (props) => {
  const classes = useStyles();
  const fileName = 'Mock File';
  const message = mockMessage;
  const [[selectedSegmentIndex, selectedFieldIndex], setSelected] = useState([-1, -1]);
  return (
    <div className={classes.container}>
      <Typography
        variant="h4"
        className={classes.title}
      >
        {fileName}
      </Typography>
      <TextField
        className={classes.filter}
        placeholder='I.e. PID-2 = Eric'
        label="Filter"
      />
      <TextField
        className={classes.messageSelector}
        type="number"
        value={message.messageNumWithinFile}
        label="Message Number"
      />
      <div className={classes.rawMessageContainer}>
        {message.rawMessage.split('\n').filter(segment => !!segment).map((segment, segmentIndex) => (
          <div
            className={selectedSegmentIndex === segmentIndex ? classes.selectedSegment : undefined}
            key={`rawSegment-${segmentIndex}`}
          >
            {segment.split('|').map((field, fieldIndex) => (
              <span>
                {fieldIndex !== 0 && '|'}
                <span
                  key={`rawField-${segmentIndex}-${fieldIndex}`}
                  className={selectedSegmentIndex === segmentIndex && selectedFieldIndex === fieldIndex ? classes.selectedField : classes.field}
                  onClick={() => setSelected([segmentIndex, fieldIndex])}
                >
                  {field}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div
        className={classes.segmentListContainer}
      >
        <List
          subheader={<li />}
        >
          {message.parsedMessage.map((segment, segmentIndex) => (
            <li
              className={classes.listSection}
              key={`parsedSegment-${segmentIndex}`}
            >
              <ul
                className={selectedSegmentIndex === segmentIndex ? classes.selectedListSectionList : classes.listSectionList}
              >
                <ListSubheader
                  className={classes.listSectionListHeader}
                >
                  {segment.definition && segment.definition.description ? segment.definition.description : segment.name}
                </ListSubheader>
                {(segment.children as any[]).map((field, fieldIndex) => !field ? undefined : (
                  <ListItem
                    key={`parsedField-${segmentIndex}-${fieldIndex}`}
                    className={selectedSegmentIndex === segmentIndex && selectedFieldIndex === fieldIndex ? classes.selectedField : classes.field}
                    onClick={() => setSelected([segmentIndex, fieldIndex])}
                    >
                    <ListItemText
                      primary={field.value ? field.value : '(empty)'}
                      secondary={field.definition && field.definition.description ? field.definition.description : field.name}
                    />
                  </ListItem>
                ))}
              </ul>
            </li>
          ))}
        </List>
      </div>
    </div>
  );
}

export const MessagePage = MessagePageImpl
