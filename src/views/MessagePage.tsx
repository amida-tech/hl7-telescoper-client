import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import { Typography, makeStyles, TextField, List, ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import ExpandableListItem from '../components/ExpandableListItem';

import { inject, observer } from 'mobx-react';
import { FILE_STORE, IFileStore } from '../stores/fileStore';
var HL7DictionarySegments = require('hl7-dictionary').definitions['2.7'].segments;
console.log(require('hl7-dictionary').definitions['2.7'])

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
  const index = 0
  
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
        onChange={(event) => history.push(`/app/files/${fileId}/messages/${event.target.value}`)}
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
                  {HL7DictionarySegments[segment.name].desc ? HL7DictionarySegments[segment.name].desc  : segment.name}
                  {/* {segment.definition && segment.definition.description ? segment.definition.description : segment.name} */}
                </ListSubheader>
                {(segment.children as any[]).map((field, fieldIndex) => !field ? undefined : (
                  <div>
                    {field.children ? (
                      <div>
                      <ExpandableListItem
                        field={field}
                        fieldIndex={fieldIndex}
                        segmentName={segment.name}
                        expandableKey={`parsedField-${segmentIndex}-${fieldIndex}`}
                        expandableClassName={selectedSegmentIndex === segmentIndex && selectedFieldIndex === fieldIndex ? classes.selectedField : classes.field}
                        expandableOnClick={() => setSelected([segmentIndex, fieldIndex])}
                        {...console.log('if children',fieldIndex, field.name, field.definition && field.definition.description ? field.definition.description : field.name)}
                        // {...console.log('fieldindex', field.children,fieldIndex, field.name, field.definition && field.definition.description ? field.definition.description : field.name)}
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
                            {...console.log('if no children',fieldIndex, field.name, field.definition && field.definition.description ? field.definition.description : field.name)}
                            primary={field.value ? field.value : '(empty)'}
                            // {...console.log('----->', fieldIndex, HL7DictionarySegments[segment.name].fields[fieldIndex].desc ? HL7DictionarySegments[segment.name].fields[fieldIndex].desc : field.name)}
                            secondary={HL7DictionarySegments[segment.name].fields[fieldIndex].desc ? HL7DictionarySegments[segment.name].fields[fieldIndex].desc : field.name}
                            // secondary={field.definition && field.definition.description ? field.definition.description : field.name} //this line you change
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
