import React, { useState } from 'react';
import ComponentHeader from './component-header';

const Signature2 = (props) => {
  const [ isSigned, setIsSigned ] = useState(false);
  const [ isError, setIsError ] = useState(false);

  const clickToSign = () => {
    if (typeof props.getActiveUserProperties !== 'function' ) {
      return;
    }

    const userProperties = props.getActiveUserProperties();
    let roleLists = (userProperties && userProperties.role) || [];
    roleLists = roleLists.concat([(userProperties && userProperties.name) || '']);

    const position = `${props.data.position}`.toLocaleLowerCase();

    if (roleLists.find(item => `${item}`.toLocaleLowerCase() === position)) {
      setIsSigned(!isSigned);
    } else {
      if (!isError) {
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 5000);
      }
      console.log('role annd name does not match');
    }
  }

  let baseClasses = 'SortableItem rfb-item';
  if (props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

  return (
    <div className={baseClasses}>
      <ComponentHeader {...props} />
      <div className="form-group" onClick={clickToSign} style={{ cursor: 'pointer' }}>
        <h5 style={{ textAlign: 'center' }}>{isSigned ? 'Already signed' : '(Click to sign)'}</h5>
        <div style={{ 
          textAlign: 'center', 
          marginTop: 8, 
          marginBottom: 8, 
          color: isError ? 'red' : 'inherit'
        }}>
          {isError ? 'You has no permission to sign' : '__________________'}
        </div>
        <h6 style={{ textAlign: 'center' }}>{props.data.position || 'Placeholder Text'}</h6>
      </div>
    </div>
  );
}

export default Signature2;
