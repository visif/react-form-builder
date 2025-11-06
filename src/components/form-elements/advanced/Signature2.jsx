import React from 'react'

import dayjs from 'dayjs'

import { formatDate } from '../../../utils/dateUtil'
import ComponentHeader from '../shared/ComponentHeader'

const Signature2 = (props) => {
  const inputField = React.useRef(null)
  const tableRef = React.useRef(null)

  const [isSigned, setIsSigned] = React.useState(props.defaultValue && props.defaultValue.isSigned)
  const [signedPerson, setSignedPerson] = React.useState(
    props.defaultValue && props.defaultValue.signedPerson
  )
  const [signedPersonId, setSignedPersonId] = React.useState(
    props.defaultValue && props.defaultValue.signedPersonId
  )
  const [signedDateTime, setSignedDateTime] = React.useState(
    props.defaultValue && props.defaultValue.signedDateTime
  )
  const [isError, setIsError] = React.useState(false)

  // Initialize form context with initial value
  React.useEffect(() => {
    if (props.handleChange && props.defaultValue && props.defaultValue.isSigned) {
      props.handleChange(props.data.field_name, {
        isSigned: props.defaultValue.isSigned,
        signedPerson: props.defaultValue.signedPerson,
        signedPersonId: props.defaultValue.signedPersonId,
        signedDateTime: props.defaultValue.signedDateTime,
      })
    }
  }, []) // Only on mount

  React.useEffect(() => {
    // If this is in a DynamicColumnRow and we have onElementChange,
    // notify parent that this component is now initialized
    if (props.data.parentId && props.onElementChange) {
      // Send initialization status to parent
      props.onElementChange({
        ...props.data,
        element: 'Signature2',
        initialized: true,
        position: props.data.position,
        specificRole: props.data.specificRole,
        required: props.data.required,
        readOnly: props.data.readOnly,
      })
    }
  }, [props])

  React.useEffect(() => {
    if (props.defaultValue && props.defaultValue.isSigned !== isSigned) {
      setIsSigned(props.defaultValue && props.defaultValue.isSigned)
      setSignedPerson(props.defaultValue.signedPerson)
      setSignedPersonId(props.defaultValue && props.defaultValue.signedPersonId)
      setIsError(false)
    }
  }, [props.defaultValue, isSigned])

  const clickToSign = React.useCallback(() => {
    if (typeof props.getActiveUserProperties !== 'function') {
      return
    }

    const userProperties = props.getActiveUserProperties()
    let roleLists = (userProperties && userProperties.role) || []
    roleLists = roleLists.concat([(userProperties && userProperties.name) || ''])

    const position = `${props.data.position}`.toLocaleLowerCase().trim()

    if (
      props.data.specificRole === 'specific' &&
      roleLists.find((item) => `${item}`.toLocaleLowerCase().trim() === position)
    ) {
      const newIsSigned = !isSigned
      const newSignedPerson = !isSigned ? userProperties.name : ''
      const newSignedPersonId = !isSigned ? userProperties.userId : ''
      const newSignedDateTime = !isSigned ? dayjs().utc(true) : null

      setIsSigned(newIsSigned)
      setSignedPerson(newSignedPerson)
      setSignedPersonId(newSignedPersonId)
      setSignedDateTime(newSignedDateTime)

      // Update form context
      if (props.handleChange) {
        props.handleChange(props.data.field_name, {
          isSigned: newIsSigned,
          signedPerson: newSignedPerson,
          signedPersonId: newSignedPersonId,
          signedDateTime: newSignedDateTime,
        })
      }
    } else if (props.data.specificRole === 'notSpecific') {
      const newIsSigned = !isSigned
      const newSignedPerson = !isSigned ? userProperties.name : ''
      const newSignedPersonId = !isSigned ? userProperties.userId : ''
      const newSignedDateTime = !isSigned ? dayjs().utc(true) : null

      setIsSigned(newIsSigned)
      setSignedPerson(newSignedPerson)
      setSignedPersonId(newSignedPersonId)
      setSignedDateTime(newSignedDateTime)

      // Update form context
      if (props.handleChange) {
        props.handleChange(props.data.field_name, {
          isSigned: newIsSigned,
          signedPerson: newSignedPerson,
          signedPersonId: newSignedPersonId,
          signedDateTime: newSignedDateTime,
        })
      }
    } else {
      if (!isError) {
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 5000)
      }
      console.log('role annd name does not match')
    }
  }, [props, isError, isSigned])

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor =
      userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
  }

  const hasRequiredLabel =
    props.data.hasOwnProperty('required') && props.data.required === true && !props.read_only

  return (
    <div
      ref={tableRef}
      className={`SortableItem rfb-item${props.data.pageBreakBefore ? ' alwaysbreak' : ''}`}
    >
      <ComponentHeader {...props} />
      <div
        className="form-group"
        onClick={() => {
          if (isSameEditor) {
            clickToSign()
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        {hasRequiredLabel && (
          <span
            className="label-required badge badge-danger"
            style={{
              marginLeft: '60%',
            }}
          >
            Required
          </span>
        )}
        <h5 style={{ textAlign: 'center' }}>{isSigned ? 'Already signed' : '(Click to sign)'}</h5>
        <div
          style={{
            textAlign: 'center',
            marginTop: 4,
            marginBottom: 4,
            color: isError ? 'red' : 'black',
          }}
        >
          {isError ? 'You have no permission to sign' : '__________________'}
        </div>
        <h6 style={{ textAlign: 'center', minHeight: 20, margin: '4px 0' }}>{isSigned && `(${signedPerson})`}</h6>
        <h6 style={{ textAlign: 'center', margin: '4px 0' }}>{props.data.position || 'Placeholder Text'}</h6>
        {signedDateTime && <h6 style={{ textAlign: 'center', margin: '4px 0' }}>{formatDate(signedDateTime)}</h6>}
      </div>
    </div>
  )
}

export default Signature2
