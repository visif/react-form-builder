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
