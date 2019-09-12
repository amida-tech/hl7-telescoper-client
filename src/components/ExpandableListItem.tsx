import React, { useState } from 'react';

import {ListItem, ListItemText, ListItemIcon, Collapse, List} from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

import { Field } from 'health-level-seven-parser';
var HL7Dictionary = require('hl7-dictionary').definitions['2.7'];

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
  console.log('segment:', segmentName)
  return <div>
    <ListItem button
      key={expandableKey}
      className={expandableClassName}
      onClick={() => {
        expandableOnClick();
        setOpen(!open);
      }}
    >
      <ListItemText
        primary={field.value ? field.value : '(empty)'}
        secondary={field.definition && field.definition.description ? field.definition.description : field.name}
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
              // datatype={...HL7Dictionary.segments[segmentName].fields[fieldIndex].datatype}
              // {...console.log(field.name, field.value, HL7Dictionary.segments[segmentName].fields[fieldIndex].datatype, fieldIndex, subfield.name, subfieldIndex)}
              // {...console.log("lets see", HL7Dictionary.fields[HL7Dictionary.segments[segmentName].fields[fieldIndex].datatype].subfields[subfieldIndex])}
              // {...console.log('*****', HL7Dictionary.fields[HL7Dictionary.segments[segmentName].fields[fieldIndex].datatype].subfields.desc == 'Extended Address' ? 'HL7Dictionary.fields[HL7Dictionary.segments[segmentName].fields[fieldIndex].datatype].subfields[subfieldIndex].desc' : 'subfield.name')}
              secondary={HL7Dictionary.fields[HL7Dictionary.segments[segmentName].fields[fieldIndex].datatype].subfields[subfieldIndex] ? HL7Dictionary.fields[HL7Dictionary.segments[segmentName].fields[fieldIndex].datatype].subfields[subfieldIndex].desc : subfield.name}
              // secondary={subfield.definition && subfield.definition.description ? subfield.definition.description : subfield.name}
            />
          </ListItem>
        ))}
      </List>
    </Collapse>
  </div>;

};

export default ExpandableListItem;