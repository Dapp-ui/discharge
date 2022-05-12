import { Center, Group, Text } from '@mantine/core'
import { useState } from 'react'
import { File, Settings, Upload } from 'tabler-icons-react'
import { Files } from './Files'
import { Preferences } from './Preferences'
import { Uploading } from './Uploading'

export function Application() {
  const [active, setActive] = useState('files')

  return (
    <>
      <Group grow sx={{ width: '100%' }}>
        <Center
          onClick={() => setActive('files')}
          p="md"
          sx={{
            cursor: 'pointer',
            transition: 'all 300ms',
            border: '1px solid #121212',
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
            border: '1px solid #121212',
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
            border: '1px solid #121212',
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
      {active == 'files' && <Files />}
      {active == 'upload' && <Uploading />}
      {active == 'settings' && <Preferences />}
    </>
  )
}
