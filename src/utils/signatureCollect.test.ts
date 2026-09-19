import { describe, expect, it } from 'vitest'

import {
  flattenColumnChildren,
  isSignedSignatureValue,
  pickSignatureValue,
  resolveColumnChild,
  sameFormItemId,
} from './signatureCollect'
import { serializeSignedDateTime } from './dateUtil'

describe('signatureCollect', () => {
  it('matches column child IDs across string/number types', () => {
    expect(sameFormItemId('12', 12)).toBe(true)
    expect(sameFormItemId(12, 12)).toBe(true)
    expect(sameFormItemId('12', '13')).toBe(false)
    expect(sameFormItemId(null, '12')).toBe(false)
  })

  it('keeps a signed value when the live ref is missing', () => {
    const stored = {
      isSigned: true,
      signedPerson: 'Ada Lovelace',
      signedPersonId: 9,
      signedDateTime: '2026-09-19T05:00:00.000Z',
    }
    expect(pickSignatureValue(null, stored)).toEqual(stored)
    expect(pickSignatureValue({ isSigned: false }, '')).toBe('')
    expect(isSignedSignatureValue(stored)).toBe(true)
  })

  it('resolves column children from ids or nested objects', () => {
    const byId = { id: 'sig-1', element: 'Signature2', field_name: 'sig_field' }
    expect(resolveColumnChild('sig-1', (id) => (id === 'sig-1' ? byId : null))).toEqual(byId)
    expect(
      resolveColumnChild({ id: 'missing', element: 'Signature2', field_name: 'nested' }, () => null)
    ).toEqual({ id: 'missing', element: 'Signature2', field_name: 'nested' })
    expect(resolveColumnChild(null)).toBeNull()
  })

  it('flattens TwoColumnRow / ThreeColumnRow children even when they are nested objects', () => {
    const data = [
      {
        id: 'row-1',
        element: 'TwoColumnRow',
        childItems: [
          'sig-top',
          { id: 'sig-nested', element: 'Signature2', field_name: 'sig_nested' },
        ],
      },
      { id: 'sig-top', element: 'Signature2', field_name: 'sig_top' },
    ]
    const children = flattenColumnChildren(data, (id) => data.find((item) => item.id === id))
    expect(children.map((child) => child.field_name)).toEqual(['sig_top', 'sig_nested'])
  })

  it('serializes dayjs-like objects so submit JSON stays readable', () => {
    const likeDayjs = { toISOString: () => '2026-09-19T05:00:00.000Z' }
    expect(serializeSignedDateTime(likeDayjs)).toBe('2026-09-19T05:00:00.000Z')
    expect(serializeSignedDateTime('2026-09-19T05:00:00.000Z')).toBe('2026-09-19T05:00:00.000Z')
  })
})
