/** True only when dist was produced with `yarn build:local` / `yarn link:local`. */
const IS_LOCAL_BUILD = import.meta.env.VITE_LOCAL_BUILD === 'true'

export default IS_LOCAL_BUILD
export { IS_LOCAL_BUILD }
