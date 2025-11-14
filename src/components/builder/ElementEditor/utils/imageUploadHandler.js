/**
 * Handle image file upload for image elements
 * Reads file, uploads via callback, and updates element dimensions
 */
export const createImageUploadHandler = (setElement, props) => {
  return async (event) => {
    if (!event || !event.target || !event.target.files || !props.onImageUpload) {
      if (!props.onImageUpload) {
        setElement((prev) => {
          const updated = { ...prev }
          updated.src = 'Please provide upload callback'
          return updated
        })
      }
      return
    }

    try {
      const file = event.target.files[0]
      const imageUrl = await props.onImageUpload(file, props.element.id)

      const reader = new FileReader()
      reader.onload = function (e) {
        const img = new Image()
        img.onload = function () {
          setElement((prev) => {
            const updated = { ...prev }
            updated.width = img.width
            updated.height = img.height
            updated.src = imageUrl
            props.updateElement.call(props.preview, updated)
            return updated
          })
        }
        img.src = reader.result
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.log('error upload', error)
      setElement((prev) => {
        const updated = { ...prev }
        updated.src = 'cannot upload file'
        return updated
      })
    }
  }
}
