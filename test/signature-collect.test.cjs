const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const collect = require('../lib/functions/signatureCollect')

describe('signatureCollect', () => {
  it('matches column child IDs across string/number types', () => {
    assert.equal(collect.sameFormItemId('12', 12), true)
    assert.equal(collect.sameFormItemId(12, 12), true)
    assert.equal(collect.sameFormItemId('12', '13'), false)
    assert.equal(collect.sameFormItemId(null, '12'), false)
  })

  it('resolves childItems entries that are IDs or nested objects', () => {
    const byId = {
      sig1: { id: 'sig1', element: 'Signature2', field_name: 'signature2_a' },
    }
    const findById = (id) => byId[id] || (String(id) === '12' ? byId.sig1 : null)

    assert.equal(collect.resolveColumnChild('sig1', findById).field_name, 'signature2_a')
    assert.equal(
      collect.resolveColumnChild({ id: 'sig1', element: 'Signature2' }, findById).field_name,
      'signature2_a'
    )
    assert.equal(collect.resolveColumnChild(null, findById), null)
  })

  it('keeps a signed value when the live ref is missing', () => {
    const stored = {
      isSigned: true,
      signedPerson: 'Ada Lovelace',
      signedPersonId: 9,
      signedDateTime: '2026-09-19T05:00:00.000Z',
    }
    assert.deepEqual(collect.pickSignatureValue(null, stored), stored)
    assert.equal(collect.pickSignatureValue({ isSigned: false }, ''), '')
  })

  it('serializes dayjs-like objects so submit JSON stays readable', () => {
    const likeDayjs = { toISOString: () => '2026-09-19T05:00:00.000Z' }
    assert.equal(collect.serializeSignedDateTime(likeDayjs), '2026-09-19T05:00:00.000Z')
    assert.equal(collect.serializeSignedDateTime('2026-09-19T05:00:00.000Z'), '2026-09-19T05:00:00.000Z')
  })

  it('walks TwoColumnRow/ThreeColumnRow childItems to find Signature2 cells', () => {
    const signature = {
      id: 'sig-cell',
      element: 'Signature2',
      field_name: 'signature2_cell',
    }
    const data = [
      {
        id: 'row-1',
        element: 'TwoColumnRow',
        childItems: [['sig-cell', null]],
      },
      signature,
    ]
    const children = collect.flattenColumnChildren(data, (id) =>
      data.find((item) => String(item.id) === String(id))
    )
    assert.equal(children.length, 1)
    assert.equal(children[0].field_name, 'signature2_cell')
  })
})
