import React from 'react'
import dayjs from 'dayjs'
import { formatDate } from '../functions/dateUtil'
import ComponentHeader from './component-header'

const Signature2 = (props) => {
  const inputField = React.useRef(null)
  const tableRef = React.useRef(null)

  const [isSigned, setIsSigned] = React.useState(
    props.defaultValue && props.defaultValue.isSigned
  )
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
    console.log('Signature getDerivedStateFromProps')
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
      setIsSigned((current) => !current)
      setSignedPerson((current) => (!current ? userProperties.name : ''))
      setSignedPersonId((current) => (!current ? userProperties.userId : ''))
      setSignedDateTime((current) => (!current ? dayjs().utc(true) : null))
    } else if (props.data.specificRole === 'notSpecific') {
      setIsSigned((current) => !current)
      setSignedPerson((current) => (!current ? userProperties.name : ''))
      setSignedPersonId((current) => (!current ? userProperties.userId : ''))
      setSignedDateTime((current) => (!current ? dayjs().utc(true) : null))
    } else {
      if (!isError) {
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 5000)
      }
      console.log('role annd name does not match')
    }
  }, [props, isError])

  const userProperties = props.getActiveUserProperties && props.getActiveUserProperties()

  const savedEditor = props.editor
  let isSameEditor = true
  if (savedEditor && savedEditor.userId && !!userProperties) {
    isSameEditor = userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
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
        <h5 style={{ textAlign: 'center' }}>
          {isSigned ? 'Already signed' : '(Click to sign)'}
        </h5>
        <div
          style={{
            textAlign: 'center',
            marginTop: 8,
            marginBottom: 8,
            color: isError ? 'red' : 'black',
          }}
        >
          {isError ? 'You have no permission to sign' : '__________________'}
        </div>
        <h6 style={{ textAlign: 'center', minHeight: 20 }}>
          {isSigned && `(${signedPerson})`}
        </h6>
        <h6 style={{ textAlign: 'center' }}>{props.data.position || 'Placeholder Text'}</h6>
        {signedDateTime && (
          <h6 style={{ textAlign: 'center' }}>{formatDate(signedDateTime)}</h6>
        )}
      </div>
    </div>
  )
}

export default Signature2
