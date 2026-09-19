import { serializeSignedDateTime } from './dateUtil'

export { serializeSignedDateTime }

export const sameFormItemId = (a: unknown, b: unknown): boolean => {
  if (a == null || b == null || a === '' || b === '') {
    return false
  }
  return a === b || String(a) === String(b)
}

export const isSignedSignatureValue = (value: unknown): boolean =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value) && (value as { isSigned?: boolean }).isSigned)

type SignatureValue = {
  isSigned: boolean
  signedPerson?: unknown
  signedPersonId?: unknown
  signedDateTime?: unknown
}

type ColumnChildRef = {
  id?: unknown
  element?: string
  field_name?: string
}

export const resolveColumnChild = (
  childRef: unknown,
  findById?: (id: unknown) => ColumnChildRef | null | undefined
): ColumnChildRef | null => {
  if (childRef == null || childRef === '') {
    return null
  }
  if (typeof childRef === 'object') {
    const nested = childRef as ColumnChildRef
    if (nested.element || nested.field_name) {
      return (typeof findById === 'function' && nested.id != null ? findById(nested.id) : null) || nested
    }
    return null
  }
  return typeof findById === 'function' ? findById(childRef) || null : null
}

export const pickSignatureValue = (
  refState: SignatureValue | null | undefined,
  storedValue: unknown
): SignatureValue | '' => {
  if (refState && refState.isSigned) {
    return {
      isSigned: true,
      signedPerson: refState.signedPerson,
      signedPersonId: refState.signedPersonId,
      signedDateTime: serializeSignedDateTime(refState.signedDateTime),
    }
  }
  if (isSignedSignatureValue(storedValue)) {
    const stored = storedValue as SignatureValue
    return {
      isSigned: true,
      signedPerson: stored.signedPerson,
      signedPersonId: stored.signedPersonId,
      signedDateTime: serializeSignedDateTime(stored.signedDateTime),
    }
  }
  return ''
}

export const flattenColumnChildren = (
  data: Array<{ childItems?: unknown } | null | undefined> | null | undefined,
  findById?: (id: unknown) => ColumnChildRef | null | undefined
): ColumnChildRef[] => {
  const children: ColumnChildRef[] = []
  const seen = new Set<string>()
  ;(data || []).forEach((item) => {
    if (!item || !item.childItems) {
      return
    }
    const rows = Array.isArray((item.childItems as unknown[])[0])
      ? (item.childItems as unknown[][])
      : [item.childItems as unknown[]]
    rows.forEach((row) => {
      ;(row || []).forEach((childRef) => {
        const child = resolveColumnChild(childRef, findById)
        if (!child) {
          return
        }
        const key = child.id != null ? String(child.id) : child.field_name
        if (key && seen.has(String(key))) {
          return
        }
        if (key) {
          seen.add(String(key))
        }
        children.push(child)
      })
    })
  })
  return children
}
