import React, { useState } from 'react';

import {ListItem, ListItemText, ListItemIcon, Collapse, List} from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { HL7_DICT_OFFSET } from '../stores/userStore';
import { Field } from 'health-level-seven-parser';
const HL7Dictionary = require('hl7-dictionary').definitions['2.7.1'];

const ExpandableListItem: React.FC<{
  field: Field;
  fieldIndex: number;
  segmentName: string;
  expandableKey: string;
  expandableClassName: string;
  expandableOnClick: () => void;
  nestedClassName: string
}> = (props) => {

  const [open, setOpen] = useState(false);

  const {
    field,
    fieldIndex,
    segmentName,
    expandableKey,
    expandableClassName,
    expandableOnClick,
    nestedClassName,
  } = props;
  return <div>
    <ListItem button
      key={expandableKey}
      className={expandableClassName}
      onClick={() => {
        expandableOnClick();
        setOpen(!open);
      }}
      /* ***hl7-dictionary library has it's segment field names offset off by one*** */
    >
      <ListItemText
        primary={field.value ? field.value : '(empty)'}
        secondary={
          segmentName === 'MSH' ? HL7Dictionary.segments[segmentName].fields[fieldIndex].desc ? HL7Dictionary.segments[segmentName].fields[fieldIndex].desc : field.name :
          HL7Dictionary.segments[segmentName].fields[fieldIndex-HL7_DICT_OFFSET].desc ? HL7Dictionary.segments[segmentName].fields[fieldIndex-HL7_DICT_OFFSET].desc : field.name}
      />
      {open ? <ListItemIcon><ExpandLess/></ListItemIcon> : <ListItemIcon><ExpandMore/></ListItemIcon>}
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {(field.children as any[]).map((subfield, subfieldIndex) => !subfield ? undefined : (
          <ListItem button
             key={`${expandableKey}-${subfieldIndex}`}
             className={nestedClassName}
          >
            <ListItemText
              primary={subfield.value ? subfield.value : '(empty)'}
              secondary={
                segmentName === 'MSH' ? HL7Dictionary.fields[HL7Dictionary.segments[segmentName].fields[fieldIndex].datatype].subfields[subfieldIndex] ? 
                HL7Dictionary.fields[HL7Dictionary.segments[segmentName].fields[fieldIndex].datatype].subfields[subfieldIndex].desc : subfield.name : 
                HL7Dictionary.fields[HL7Dictionary.segments[segmentName].fields[fieldIndex - HL7_DICT_OFFSET].datatype].subfields[subfieldIndex] ? 
                HL7Dictionary.fields[HL7Dictionary.segments[segmentName].fields[fieldIndex-HL7_DICT_OFFSET].datatype].subfields[subfieldIndex].desc : 
                HL7Dictionary.fields[HL7Dictionary.segments[segmentName].fields[fieldIndex-HL7_DICT_OFFSET].datatype].desc}
            />
          </ListItem>
        ))}
      </List>
    </Collapse>
  </div>;

};

export default ExpandableListItem;