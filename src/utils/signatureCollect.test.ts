import { describe, expect, it } from 'vitest'

import { isSignedSignatureValue, pickSignatureValue, sameFormItemId } from './signatureCollect'
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

  it('serializes dayjs-like objects so submit JSON stays readable', () => {
    const likeDayjs = { toISOString: () => '2026-09-19T05:00:00.000Z' }
    expect(serializeSignedDateTime(likeDayjs)).toBe('2026-09-19T05:00:00.000Z')
    expect(serializeSignedDateTime('2026-09-19T05:00:00.000Z')).toBe('2026-09-19T05:00:00.000Z')
  })
})
