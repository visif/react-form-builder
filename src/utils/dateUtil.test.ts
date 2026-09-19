import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import dayjs from 'dayjs'

import {
  formatDate,
  formatDatePickerDisplay,
  getDateFormat,
  nowAsSignatureUtcIso,
  parseStoredDate,
  serializeSignedDateTime,
  toStoredDateIso,
} from './dateUtil'

describe('dateUtil', () => {
  beforeEach(() => {
    localStorage.setItem('setting_date_format', 'dd/MM/yyyy')
    localStorage.setItem('setting_calendar_type', 'EN')
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('reads the system date format from localStorage', () => {
    expect(getDateFormat()).toBe('DD/MM/YYYY')
    expect(getDateFormat(true)).toBe('DD/MM/YYYY HH:mm')
  })

  it('falls back to the element dateFormat when localStorage is empty', () => {
    localStorage.removeItem('setting_date_format')
    expect(getDateFormat(false, 'dd MMMM yyyy')).toBe('DD MMMM YYYY')
    expect(getDateFormat(false, 'DD/MM/YYYY')).toBe('DD/MM/YYYY')
  })

  it('stores DatePicker values as real UTC ISO from the local wall-clock', () => {
    const localNoon = dayjs('2026-09-14T12:00:00')
    const stored = toStoredDateIso(localNoon)

    expect(stored).toBe(localNoon.toISOString())
    expect(formatDatePickerDisplay(stored, 'DD MMMM YYYY')).toBe('14 September 2026')
    expect(formatDatePickerDisplay(stored, 'DD/MM/YYYY')).toBe('14/09/2026')
  })

  it('parses a stored DatePicker ISO back without shifting the local day', () => {
    const stored = toStoredDateIso(dayjs('2026-09-14T00:00:00'))
    const parsed = parseStoredDate(stored, 'DD/MM/YYYY')

    expect(formatDatePickerDisplay(parsed, 'DD/MM/YYYY')).toBe('14/09/2026')
  })

  it('stamps Signature2 as local clock labeled UTC so formatDate does not shift', () => {
    const stamped = nowAsSignatureUtcIso()
    const localClock = dayjs().format('YYYY-MM-DDTHH:mm')

    expect(stamped.startsWith(localClock)).toBe(true)
    expect(stamped.endsWith('Z')).toBe(true)
    expect(formatDate(stamped)).toBe(dayjs().format('DD/MM/YYYY'))
  })

  it('formats DatePicker and Signature dates in Thai Buddhist when calendar is TH', () => {
    localStorage.setItem('setting_calendar_type', 'TH')
    localStorage.setItem('setting_date_format', 'dd MMMM yyyy')

    const stored = toStoredDateIso(dayjs('2026-09-18T00:00:00'))
    expect(formatDatePickerDisplay(stored, 'DD MMMM YYYY')).toBe('18 กันยายน 2569')
    expect(formatDate('2026-09-18T00:00:00.000Z')).toBe('18 กันยายน 2569')
  })

  it('serializes dayjs-like Signature2 values to ISO strings', () => {
    expect(serializeSignedDateTime({ toISOString: () => '2026-09-19T05:00:00.000Z' })).toBe(
      '2026-09-19T05:00:00.000Z'
    )
    expect(serializeSignedDateTime('2026-09-19T05:00:00.000Z')).toBe('2026-09-19T05:00:00.000Z')
    expect(serializeSignedDateTime(null)).toBeNull()
  })
})
