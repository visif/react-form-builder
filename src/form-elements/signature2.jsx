import React, { useState } from 'react';
import ComponentHeader from './component-header';

const Signature2 = (props) => {
  const [ isSigned, setIsSigned ] = useState(false);

  const clickToSign = () => {
    setIsSigned(!isSigned);
  }

  const newProps = {
    name: props.data.field_name,
  };

  let baseClasses = 'SortableItem rfb-item';
  if (props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group" onClick={clickToSign}>
        <h5 style={{ textAlign: 'center' }}>{isSigned ? 'Already signed' : '(Click to sign)'}</h5>
        <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 8 }}>__________________</div>
        <h6 style={{ textAlign: 'center' }}>{props.data.position || 'Placeholder Text'}</h6>
      </div>
    </div>
  );
}

export default Signature2;
