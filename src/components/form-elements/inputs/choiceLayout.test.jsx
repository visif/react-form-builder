import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Checkboxes from './Checkboxes'
import RadioButtons from './RadioButtons'

const options = [
  { key: 'a', value: '1', text: 'Alpha' },
  { key: 'b', value: '2', text: 'Beta' },
]

const data = {
  field_name: 'choices_1',
  isShowLabel: true,
  label: 'Choices',
  options,
}

describe('checkbox and multiple choice layout', () => {
  it('stacks options when display horizontal is off', () => {
    const { container } = render(<Checkboxes mutable data={{ ...data, inline: false }} />)

    const optionNodes = container.querySelectorAll('.rfb-option-info-row')
    expect(optionNodes).toHaveLength(2)
    expect(container.querySelector('.option-inline')).toBeNull()
    expect(optionNodes[0].parentElement).toHaveStyle({ display: 'block' })
  })

  it('places checkbox options side by side when display horizontal is on', () => {
    render(<Checkboxes mutable data={{ ...data, inline: true }} />)

    expect(screen.getByText('Alpha').closest('.option-inline')).toHaveStyle({
      display: 'inline-block',
    })
    expect(screen.getByText('Beta').closest('.option-inline')).toHaveStyle({
      display: 'inline-block',
    })
  })

  it('places multiple choice options side by side when display horizontal is on', () => {
    render(<RadioButtons mutable data={{ ...data, inline: true }} />)

    expect(screen.getByText('Alpha').closest('.option-inline')).toHaveStyle({
      display: 'inline-block',
    })
    expect(screen.getByText('Beta').closest('.option-inline')).toHaveStyle({
      display: 'inline-block',
    })
  })
})

const infoOptions = [
  { key: 'a', value: '1', text: 'Send to QA', info: true },
  { key: 'b', value: '2', text: 'Return stock', info: true },
]

const selectedInfo = [{ key: 'a', value: true, info: '1' }]

describe('choice info input edit lock', () => {
  it('keeps the checkbox info input editable while the checkbox can be edited', () => {
    render(
      <Checkboxes
        mutable
        data={{ ...data, options: infoOptions }}
        defaultValue={selectedInfo}
      />
    )

    expect(screen.getByRole('textbox')).toBeEnabled()
  })

  it('disables the checkbox info input when the checkbox is locked for edit', () => {
    render(
      <Checkboxes
        mutable
        read_only
        data={{ ...data, options: infoOptions }}
        defaultValue={selectedInfo}
      />
    )

    expect(screen.getByRole('checkbox', { name: 'Send to QA' })).toBeDisabled()
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('disables the checkbox info input when the field readOnly flag is set', () => {
    render(
      <Checkboxes
        mutable
        data={{ ...data, readOnly: true, options: infoOptions }}
        defaultValue={selectedInfo}
      />
    )

    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('disables the multiple choice info input when the radio is locked for edit', () => {
    render(
      <RadioButtons
        mutable
        read_only
        data={{ ...data, options: infoOptions }}
        defaultValue={selectedInfo}
      />
    )

    expect(screen.getByRole('radio', { name: 'Send to QA' })).toBeDisabled()
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('keeps the multiple choice info input editable while the radio can be edited', () => {
    render(
      <RadioButtons
        mutable
        data={{ ...data, options: infoOptions }}
        defaultValue={selectedInfo}
      />
    )

    expect(screen.getByRole('textbox')).toBeEnabled()
  })
})
