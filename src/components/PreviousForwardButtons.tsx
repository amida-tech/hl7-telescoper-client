import React from 'react';
import { Button } from '@material-ui/core'

const PreviousForwardButtons: React.FC<{
    onBack: (event: any) => void;
    value: number;
    onForward: (event: any) => void
  }> = (props) => {
    const {
        onBack,
        value,
        onForward,
      } = props;
    
      return <div>
        <Button className='button' onClick={onBack}>
          Prev
        </Button>
        {value}
        <Button className='button' onClick={onForward}>
          Next
        </Button>

      </div>
  }
  export default PreviousForwardButtons;