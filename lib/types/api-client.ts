export interface ApiState<T> {
  isLoading: boolean
  isError: boolean
  data: T | null
}

interface ApiInitAction<T> {
  type: 'INIT'
  payload?: null
}

interface ApiSuccessAction<T> {
  type: 'SUCCESS'
  payload: T
}

interface ApiFailureAction<T> {
  type: 'FAILURE'
  payload?: T
}

interface ResetAction<T> {
  type: 'RESET'
  payload?: null
}

export type ApiActions<T> =
  | ApiInitAction<T>
  | ApiSuccessAction<T>
  | ApiFailureAction<T>
  | ResetAction<T>
