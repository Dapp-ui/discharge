import { Center, Group, Text } from '@mantine/core'
import { useState, useEffect } from 'react'
import { File, Settings, Upload } from 'tabler-icons-react'
import { Files } from './Files'
import { Preferences } from './Preferences'
import { Uploading } from './Uploading'
import { useElectron } from '../../providers/ElectronProvider'
import { getFiles } from '../../lib/estuary'
import { useEstuary } from '../../providers/EstuaryProvider'

export function Application() {
  const [active, setActive] = useState('files')

  const { preferences } = useElectron()
  const { files } = useEstuary()

  return (
    <>
      <Group grow sx={{ width: '100%' }}>
        <Center
          onClick={() => setActive('files')}
          p="md"
          sx={{
            cursor: 'pointer',
            transition: 'all 300ms',
            border:
              active == 'files' ? '1px solid #333333' : '1px solid #121212',
            backgroundColor: active == 'files' ? '#121212' : '',
            borderRadius: '4px',
            ':hover': {
              border: '1px solid #333333',
            },
          }}
        >
          <File />
        </Center>
        <Center
          onClick={() => setActive('upload')}
          p="md"
          sx={{
            cursor: 'pointer',
            transition: 'all 300ms',
            border:
              active == 'upload' ? '1px solid #333333' : '1px solid #121212',
            backgroundColor: active == 'upload' ? '#121212' : '',
            borderRadius: '4px',
            ':hover': {
              border: '1px solid #333333',
            },
          }}
        >
          <Upload />
        </Center>
        <Center
          onClick={() => setActive('settings')}
          p="md"
          sx={{
            cursor: 'pointer',
            transition: 'all 300ms',
            border:
              active == 'settings' ? '1px solid #333333' : '1px solid #121212',
            backgroundColor: active == 'settings' ? '#121212' : '',
            borderRadius: '4px',
            ':hover': {
              border: '1px solid #333333',
            },
          }}
        >
          <Settings />
        </Center>
      </Group>
      {active == 'files' && <Files files={files} />}
      {active == 'upload' && <Uploading />}
      {active == 'settings' && <Preferences />}
    </>
  )
}
