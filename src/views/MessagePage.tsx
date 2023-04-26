import React, { useState, useEffect } from 'react';
import { RouteProps, useParams, useNavigate } from 'react-router-dom';

import { Typography, makeStyles, TextField, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import ExpandableListItem from '../components/ExpandableListItem';

import { inject, observer } from 'mobx-react';
import { FILE_STORE, IFileStore } from '../stores/fileStore';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    height: '100vh',
    gridTemplateColumns: '1fr 2fr 1fr 1fr',
    gridTemplateRows: 'auto 3fr 4fr',
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
  nested: {
    paddingLeft: theme.spacing(5),
    backgroundColor: '#BCE9F7',
  },
}));

const MessagePageImpl: React.FC<RouteProps & { fileStore: IFileStore }> = (props) => {
  const { fileStore } = props;
  const params = useParams();
  const nav = useNavigate();
  const { messageIndex, fileId } = params as any;

  const classes = useStyles();
  const [[selectedSegmentIndex, selectedFieldIndex], setSelected] = useState([-1, -1]);

  useEffect(() => {
    fileStore.getMessage(fileId, parseInt(messageIndex));
    fileStore.getFile(fileId);
  }, [fileStore, fileId, messageIndex]);

  const filename = (fileStore.currentFile && fileStore.currentFile.filename) || 'Unknown File';
  const message = fileStore.currentMessage;
  return message ? (
    <div className={classes.container}>
      <Typography
        variant="h4"
        className={classes.title}
      >
        {filename}
      </Typography>
      <TextField
        className={classes.filter}
        placeholder="I.e. PID-5 = ERIC"
        label="Filter"
      />
      <TextField
        className={classes.messageSelector}
        type="number"
        value={message.messageNumWithinFile}
        label="Message Number"
        onChange={(event) => nav(`/app/files/${fileId}/messages/${event.target.value}`)}
      />
      <div className={classes.rawMessageContainer}>
        {message.rawMessage.split('\n').filter(segment => !!segment).map((segment, segmentIndex) => (
          <div
            className={selectedSegmentIndex === segmentIndex ? classes.selectedSegment : undefined}
            key={`rawSegment-${segmentIndex}`}
          >
            {segment.split('|').map((field, fieldIndex) => (
              <span
                key={`rawField-${segmentIndex}-${fieldIndex}`}
              >
                {fieldIndex !== 0 && '|'}
                <span
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
                  <div key={`field-${fieldIndex}`}>
                    {field.children ? (
                      <div>
                        <ExpandableListItem
                          field={field}
                          expandableKey={`parsedField-${segmentIndex}-${fieldIndex}`}
                          expandableClassName={selectedSegmentIndex === segmentIndex && selectedFieldIndex === fieldIndex ? classes.selectedField : classes.field}
                          expandableOnClick={() => setSelected([segmentIndex, fieldIndex])}
                          nestedClassName={[classes.nested, selectedSegmentIndex === segmentIndex && selectedFieldIndex === fieldIndex ? classes.selectedField : classes.field].join(' ')}
                        >
                        </ExpandableListItem>
                      </div>
                    ) : (
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
                    )}
                  </div>
                ))}
              </ul>
            </li>
          ))}
        </List>
      </div>
    </div>
  ) : (
    <div className={classes.container}>
      <Typography
        variant="h4"
        className={classes.title}
      >
        {filename}
      </Typography>
      <div className={classes.rawMessageContainer}>
        No messages available or could be retrieved.
      </div>
    </div>
  );
};

export const MessagePage = inject(FILE_STORE)(observer(MessagePageImpl));
