import React, { useState } from 'react';
import ComponentHeader from './component-header';

const Signature2 = (props) => {
  const [ isSigned, setIsSigned ] = useState(false);

  const clickToSign = () => {
    if (typeof props.getActiveUserProperties !== 'function' ) {
      return;
    }
    const userProperties = props.getActiveUserProperties();

    if (userProperties && 
      (`${userProperties.role}`.toLocaleLowerCase() === `${props.data.position}`.toLocaleLowerCase()
      || `${userProperties.name}`.toLocaleLowerCase() === `${props.data.position}`.toLocaleLowerCase())
    ) {
      setIsSigned(!isSigned);
    }
  }

  let baseClasses = 'SortableItem rfb-item';
  if (props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group" onClick={clickToSign} style={{ cursor: 'pointer' }}>
        <h5 style={{ textAlign: 'center' }}>{isSigned ? 'Already signed' : '(Click to sign)'}</h5>
        <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 8 }}>__________________</div>
        <h6 style={{ textAlign: 'center' }}>{props.data.position || 'Placeholder Text'}</h6>
      </div>
    </div>
  );
}

export default Signature2;
