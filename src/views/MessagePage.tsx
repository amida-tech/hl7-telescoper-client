import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';

import { Typography, makeStyles, TextField, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import ExpandableListItem from '../components/ExpandableListItem';
import PreviousForwardButtons from '../components/PreviousForwardButtons'

import { inject, observer } from 'mobx-react';
import { FILE_STORE, IFileStore } from '../stores/fileStore';
import { HL7_DICT_OFFSET } from '../stores/userStore';
const HL7DictionarySegments = require('hl7-dictionary').definitions['2.7.1'].segments;

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
    cursor:'default'
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
    cursor:'default',
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

const MessagePageImpl: React.FC<RouteComponentProps & { fileStore: IFileStore }> = (props) => {
  const { history, match: { params }, fileStore: { getMessage, currentMessage, getFile, currentFile } } = props;
  const { messageIndex, fileId } = params as any;

  const classes = useStyles();
  const [[selectedSegmentIndex, selectedFieldIndex], setSelected] = useState([-1, -1]);

  useEffect(() => {
    getMessage(fileId, parseInt(messageIndex));
    getFile(fileId);
  }, [getFile, getMessage, fileId, messageIndex]);

  const filename = (currentFile && currentFile.filename) || 'Unknown File';
  const message = currentMessage;

  const messagePage = useCallback(
    (i: number) => () =>{
      var index = parseInt(messageIndex) + i
      index = (index < 0 ? 0 : index)
      history.push(`/app/files/${fileId}/messages/${index}`)
    },
    [history, fileId, messageIndex]
  );
  const jumpTo = (segmentIndex:number, fieldIndex:number) => {
    let div = (document.getElementById(`${segmentIndex}-${fieldIndex}`)!) // as HTMLInputElement is also valid
      div.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
  }

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
      <PreviousForwardButtons
        onBack={messagePage(-1)}
        value={message.messageNumWithinFile}
        onForward={messagePage(1)}
      >
      </PreviousForwardButtons>
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
                  onClick={() => {setSelected([segmentIndex, fieldIndex]); jumpTo(segmentIndex, fieldIndex);}}
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
                  {HL7DictionarySegments[segment.name].desc ? HL7DictionarySegments[segment.name].desc  : segment.name}
                </ListSubheader>
                {(segment.children as any[]).map((field, fieldIndex) => !field || fieldIndex === 0 ? undefined : (
                  <div id={`${segmentIndex}-${fieldIndex}`} key={`${segmentIndex}-${fieldIndex}`}>
                    {field.children ? (
                      <div>
                      <ExpandableListItem
                        field={field}
                        fieldIndex={fieldIndex}
                        segmentName={segment.name}
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
                            secondary={
                              segment.name === 'MSH' ? HL7DictionarySegments[segment.name].fields[fieldIndex].desc ? HL7DictionarySegments[segment.name].fields[fieldIndex].desc : field.name :
                              HL7DictionarySegments[segment.name].fields[fieldIndex-HL7_DICT_OFFSET].desc ? HL7DictionarySegments[segment.name].fields[fieldIndex-HL7_DICT_OFFSET].desc : field.name}
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
  ) : null;
};

export const MessagePage = inject(FILE_STORE)(observer(MessagePageImpl));
