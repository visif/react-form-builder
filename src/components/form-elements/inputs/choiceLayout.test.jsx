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
