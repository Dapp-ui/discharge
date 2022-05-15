import { Group, Skeleton, Text } from '@mantine/core'
import { Folder } from 'tabler-icons-react'
import { useEstuary } from '../../providers/EstuaryProvider'

function File({ file }: any) {
  window.Main.send('message', file)
  return (
    <Group position="apart" sx={{ width: '100%' }}>
      <Text>{file.name.slice(0, file.name.length - 4)}</Text>
    </Group>
  )
}

function Display({ files }: any) {
  return (
    <>
      {files.length == 0 ? (
        <Group
          direction="column"
          align="center"
          sx={{ width: '100%', height: '100%', justifyContent: 'center' }}
        >
          <Folder size="50px" color="#999999" />
          <Text size="sm" color="dimmed">
            Nothing here! <br /> Add files to get started.
          </Text>
        </Group>
      ) : (
        <Group direction="column" sx={{ width: '100%' }}>
          {files.map((file: any, i: number) => (
            <File key={i} file={file} />
          ))}
        </Group>
      )}
    </>
  )
}

export function Files({ files }: any) {
  const { loaded } = useEstuary()

  return (
    <Group
      direction="column"
      position="center"
      align="center"
      sx={{ height: '75vh', width: '90vw' }}
    >
      {!loaded ? (
        <>
          <Skeleton width="100%" height="10vh" />
          <Skeleton width="100%" height="10vh" />
          <Skeleton width="100%" height="10vh" />
          <Skeleton width="100%" height="10vh" />
          <Skeleton width="100%" height="10vh" />
          <Skeleton width="100%" height="10vh" />
        </>
      ) : (
        <Display files={files} />
      )}
    </Group>
  )
}
