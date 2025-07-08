import React from 'react'
import dayjs from 'dayjs'
import { formatDate } from '../functions/dateUtil'
import ComponentHeader from './component-header'

class Signature2 extends React.Component {
  constructor(props) {
    super(props)
    this.inputField = React.createRef()

    this.state = {
      defaultValue: props.defaultValue && props.defaultValue.isSigned,
      isSigned: props.defaultValue && props.defaultValue.isSigned,
      signedPerson: props.defaultValue && props.defaultValue.signedPerson,
      signedPersonId: props.defaultValue && props.defaultValue.signedPersonId,
      signedDateTime: props.defaultValue && props.defaultValue.signedDateTime,
      isError: false,
    }
  }

  componentDidMount() {
    // If this is in a DynamicColumnRow and we have onElementChange,
    // notify parent that this component is now initialized
    if (this.props.data.parentId && this.props.onElementChange) {
      // Send initialization status to parent
      this.props.onElementChange({
        ...this.props.data,
        element: 'Signature2',
        initialized: true,
        position: this.props.data.position,
        specificRole: this.props.data.specificRole,
        required: this.props.data.required,
        readOnly: this.props.data.readOnly,
      })
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log('Signature getDerivedStateFromProps')
    if (props.defaultValue && props.defaultValue.isSigned !== state.defaultValue) {
      return {
        defaultValue: props.defaultValue && props.defaultValue.isSigned,
        isSigned: props.defaultValue && props.defaultValue.isSigned,
        isError: false,
        signedPerson: props.defaultValue.signedPerson,
        signedPersonId: props.defaultValue && props.defaultValue.signedPersonId,
      }
    }

    return state
  }

  clickToSign = () => {
    if (typeof this.props.getActiveUserProperties !== 'function') {
      return
    }

    const userProperties = this.props.getActiveUserProperties()
    let roleLists = (userProperties && userProperties.role) || []
    roleLists = roleLists.concat([(userProperties && userProperties.name) || ''])

    const position = `${this.props.data.position}`.toLocaleLowerCase().trim()

    if (
      this.props.data.specificRole === 'specific' &&
      roleLists.find((item) => `${item}`.toLocaleLowerCase().trim() === position)
    ) {
      this.setState((current) => ({
        ...current,
        isSigned: !current.isSigned,
        signedPerson: !current.isSigned ? userProperties.name : '',
        signedPersonId: !current.isSigned ? userProperties.userId : '',
        signedDateTime: !current.isSigned ? dayjs().utc(true) : null,
      }))
    } else if (this.props.data.specificRole === 'notSpecific') {
      this.setState((current) => ({
        ...current,
        isSigned: !current.isSigned,
        signedPerson: !current.isSigned ? userProperties.name : '',
        signedPersonId: !current.isSigned ? userProperties.userId : '',
        signedDateTime: !current.isSigned ? dayjs().utc(true) : null,
      }))
    } else {
      if (!this.state.isError) {
        this.setState({
          isError: true,
        })
        setTimeout(() => {
          this.setState({
            isError: false,
          })
        }, 5000)
      }
      console.log('role annd name does not match')
    }
  }

  render() {
    const userProperties =
      this.props.getActiveUserProperties && this.props.getActiveUserProperties()

    const savedEditor = this.props.editor
    let isSameEditor = true
    if (savedEditor && savedEditor.userId && !!userProperties) {
      isSameEditor =
        userProperties.userId === savedEditor.userId || userProperties.hasDCCRole === true
    }

    const hasRequiredLabel =
      this.props.data.hasOwnProperty('required') &&
      this.props.data.required === true &&
      !this.props.read_only

    return (
      <div
        ref={this.tableRef}
        className={`SortableItem rfb-item${
          this.props.data.pageBreakBefore ? ' alwaysbreak' : ''
        }`}
      >
        <ComponentHeader {...this.props} />
        <div
          className="form-group"
          onClick={() => {
            if (isSameEditor) {
              this.clickToSign()
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
            {this.state.isSigned ? 'Already signed' : '(Click to sign)'}
          </h5>
          <div
            style={{
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 8,
              color: this.state.isError ? 'red' : 'black',
            }}
          >
            {this.state.isError ? 'You have no permission to sign' : '__________________'}
          </div>
          <h6 style={{ textAlign: 'center', minHeight: 20 }}>
            {this.state.isSigned && `(${this.state.signedPerson})`}
          </h6>
          <h6 style={{ textAlign: 'center' }}>
            {this.props.data.position || 'Placeholder Text'}
          </h6>
          {this.state.signedDateTime && (
            <h6 style={{ textAlign: 'center' }}>
              {formatDate(this.state.signedDateTime)}
            </h6>
          )}
        </div>
      </div>
    )
  }
}

export default Signature2
