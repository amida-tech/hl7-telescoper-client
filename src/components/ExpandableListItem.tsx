import React from 'react';

import {ListItem, ListItemText, ListItemIcon, Collapse, List} from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';

import { Field } from 'health-level-seven-parser'

const ExpandableListItem: React.FC<{
  field: Field;
  expandableKey: string;
  expandableClassName: string;
  expandableOnClick: () => void;
  nestedClassName: string
}> = (props) => {

  const [open, setOpen] = React.useState(false);

  const {
    field,
    expandableKey,
    expandableClassName,
    expandableOnClick,
    nestedClassName
  } = props;

  function handleClick() {
    setOpen(!open);
  }

  return <div>
    <ListItem button
      key={expandableKey}
      className={expandableClassName}
      onClick={() => {
        expandableOnClick();
        handleClick();
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
          <div><ListItem button
             key={`${expandableKey}-${subfieldIndex}`}
             className={nestedClassName}
          >
            <ListItemText
              primary={subfield.value ? subfield.value : '(empty)'}
              secondary={subfield.definition && subfield.definition.description ? subfield.definition.description : subfield.name}
            />
          </ListItem></div>
        ))}
      </List>
    </Collapse>
  </div>;

}

export default ExpandableListItem