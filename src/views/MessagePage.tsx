import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';

import { Typography, makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    height: '100vh',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gridTemplateRows: '1fr 8fr',
    gridTemplateAreas: `
      "title filter filter select"
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
    boxShadow: 'inset -10px 0 10px -10px #b0b0b0',
    padding: theme.spacing(2, 1),
    fontSize: '1.2em',
    lineHeight: '1.3em',
    whiteSpace: 'nowrap',
  },
  segmentListContainer: {
    gridArea: 'list',
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
  const message = {
    rawMessage: `
MSH|^~\\&|App3|Facility2|App6|Facility5|201906191553||SIU^S12|2226282|D^R|2.3.1
SCH|33910|33910||||RWMA-FOLLOWUP|Test Appointment|RWFU^RWMA-FOLLOWUP|15|minutes|^^^201505191300|||||username|||||||||BOOKED
PID||7251|7251||NICOLAS^NOLA^^V||19750513|M||2054-5|136 ARMSTRONG DIVIDE^SUITE 027^RUPERTSTAD^WY^17138||568-892-0027|524-520-7726|eng^English|S||PATID7251^0^M10|353-672-2203|53850057^WY||2054-5^
PD1||||A85832^SAUER^ALEXIS
PV1||O|1000^2019^01||||371^WILKINSON^SABRINA|90648^HERMANN^JASPER|||||||||||16747007|||||||||||||||||||||||||201906191553||||||33910
AIG|||providerusername|||||201505191300|||15|minutes
AIL|||2^TEST DEPARTMENT|||201505191300|||15|minutes
    `,
    fileId: 'somelongstringofnumbers',
    messageNumWithinFile: 0,
    parsedMessage: {
    },
  };
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
        {message.rawMessage.split(/(\r\n)|(\r)|(\n)/).filter(segment => !!segment).map((segment, segmentIndex) => (
          <div
            className={selectedSegmentIndex === segmentIndex ? classes.selectedSegment : undefined}
          >
            {segment.split('|').map((field, fieldIndex) => (
              <span>
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
      <div className={classes.segmentListContainer}>
      </div>
    </div>
  );
}

export const MessagePage = MessagePageImpl
