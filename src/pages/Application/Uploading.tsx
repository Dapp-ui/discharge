import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { Group, Text } from '@mantine/core'
import { Checkbox, CloudUpload, FileUpload, X } from 'tabler-icons-react'

export function Uploading() {
  return (
    <>
      <input type="file" placeholder="no file" />
    </>
  )
}
