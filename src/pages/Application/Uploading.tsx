import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { Group, Text } from '@mantine/core'
import { Checkbox, CloudUpload, FileUpload, X } from 'tabler-icons-react'

function DropZoneChildren(status: DropzoneStatus) {
  window.Main.send('message', status)
  return (
    <Group
      align="center"
      position="center"
      direction="column"
      sx={{ width: '75vw', height: '70vh', justifyContent: 'center' }}
    >
      {status.accepted ? (
        <Checkbox size="32px" />
      ) : status.rejected ? (
        <X fontSize="32px" />
      ) : (
        <CloudUpload size="32px" />
      )}
      <Text>Drag files here or click to select files</Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        File size cannot exceed 32 GB
      </Text>
    </Group>
  )
}

export function Uploading() {
  return (
    <>
      <Dropzone
        onDrop={files => window.Main.send('message', files)}
        onReject={files => window.Main.send('message', files)}
        maxSize={32 * 1000 ** 3}
      >
        {status => DropZoneChildren(status)}
      </Dropzone>
    </>
  )
}
