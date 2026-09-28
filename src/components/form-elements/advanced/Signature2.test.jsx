import React from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Signature2 from './Signature2'

const data = {
  id: 'sig-1',
  element: 'Signature2',
  field_name: 'sig_1',
  parentId: 'row-1',
  position: 'Placeholder Text',
  specificRole: 'notSpecific',
  required: false,
  readOnly: false,
}

describe('Signature2 column init', () => {
  it('notifies the parent once, matching componentDidMount', () => {
    const onElementChange = vi.fn()
    const { rerender } = render(
      <Signature2 mutable data={data} onElementChange={onElementChange} />
    )

    expect(onElementChange).toHaveBeenCalledTimes(1)

    rerender(
      <Signature2
        mutable
        data={{ ...data, initialized: true }}
        onElementChange={vi.fn()}
        getActiveUserProperties={() => ({ name: 'A', role: [], userId: 1 })}
      />
    )

    expect(onElementChange).toHaveBeenCalledTimes(1)
  })
})
