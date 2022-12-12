import React, { useState } from 'react';

import { ListItem, ListItemText, ListItemIcon, Collapse, List } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

import { Field } from '@amida-tech/hl7-parser';

const ExpandableListItem: React.FC<{
  field: Field;
  expandableKey: string;
  expandableClassName: string;
  expandableOnClick: () => void;
  nestedClassName: string
}> = (props) => {

  const [open, setOpen] = useState(false);

  const {
    field,
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
    >
      <ListItemText
        primary={field.value ? field.value : '(empty)'}
        secondary={field.definition && field.definition.description ? field.definition.description : field.name}
      />
      {open ? <ListItemIcon><ExpandLess /></ListItemIcon> : <ListItemIcon><ExpandMore /></ListItemIcon>}
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
              secondary={subfield.definition && subfield.definition.description ? subfield.definition.description : subfield.name}
            />
          </ListItem>
        ))}
      </List>
    </Collapse>
  </div>;

};

export default ExpandableListItem;