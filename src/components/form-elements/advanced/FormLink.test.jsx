import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import FormLink from './FormLink'

const baseData = {
  id: 'fl-1',
  element: 'FormLink',
  field_name: 'form_link_1',
  label: 'Sub Form',
  formSource: 2,
}

describe('FormLink', () => {
  it('shows the linked form name loaded via getFormInfo', async () => {
    const getFormInfo = vi.fn().mockResolvedValue({ Name: 'Child Form Name' })

    render(<FormLink mutable data={baseData} getFormInfo={getFormInfo} />)

    expect(await screen.findByText('Child Form Name')).toBeTruthy()
    expect(getFormInfo).toHaveBeenCalledWith(2)
  })

  it('shows the selected form name from the form source list without getFormInfo', async () => {
    const getFormSource = vi
      .fn()
      .mockResolvedValue([{ id: 2, title: 'Customer Feedback Form' }])

    render(<FormLink mutable data={baseData} getFormSource={getFormSource} />)

    expect(await screen.findByText('Customer Feedback Form')).toBeTruthy()
  })

  it('falls back to the persisted element value when no list or info is available', async () => {
    render(<FormLink mutable data={{ ...baseData, value: 'Saved Form Name' }} />)

    expect(await screen.findByText('Saved Form Name')).toBeTruthy()
  })

  it('renders the button with primary style', async () => {
    render(<FormLink mutable data={baseData} />)

    const button = await screen.findByRole('button', { name: 'Please select a form' })
    expect(button.className).toContain('ant-btn-primary')
  })

  it('falls back to placeholder text when no form info is available', async () => {
    render(<FormLink mutable data={{ ...baseData, formSource: undefined }} />)

    expect(await screen.findByText('Please select a form')).toBeTruthy()
  })

  it('calls onSelectChildForm with the element id and formSource on click', async () => {
    const onSelectChildForm = vi.fn()
    const getFormInfo = vi.fn().mockResolvedValue({ Name: 'Child Form Name' })

    render(
      <FormLink
        mutable
        data={baseData}
        getFormInfo={getFormInfo}
        onSelectChildForm={onSelectChildForm}
      />
    )

    fireEvent.click(await screen.findByText('Child Form Name'))

    expect(onSelectChildForm).toHaveBeenCalledWith('fl-1', 2)
  })

  it('does not open a search dropdown when getFormSource is available', async () => {
    const getFormSource = vi.fn().mockResolvedValue([{ id: 2, title: 'Mock Form A' }])
    const getFormInfo = vi.fn().mockResolvedValue({ Name: 'Linked Form Name' })

    render(
      <FormLink
        mutable
        data={baseData}
        getFormSource={getFormSource}
        getFormInfo={getFormInfo}
      />
    )

    fireEvent.click(await screen.findByText('Linked Form Name'))

    expect(screen.queryByText('Mock Form A')).toBeNull()
  })

  it('shows a loading indicator while the form source is being fetched', async () => {
    let resolveForms
    const getFormSource = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveForms = resolve
        })
    )

    render(<FormLink mutable data={baseData} getFormSource={getFormSource} />)

    expect(screen.getByText('Loading...')).toBeTruthy()

    resolveForms([])
    await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull())
  })
})
