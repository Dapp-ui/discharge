import { Center, Group, Text } from '@mantine/core'
import { useState, useEffect } from 'react'
import { File, Settings, Upload } from 'tabler-icons-react'
import { Files } from './Files'
import { Preferences } from './Preferences'
import { Uploading } from './Uploading'
import { useElectron } from '../../providers/ElectronProvider'
import { getItems } from '../../lib/estuary'
import { useEstuary } from '../../providers/EstuaryProvider'

export function Application() {
  const [active, setActive] = useState('files')
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState([{}])

  const { preferences } = useElectron()

  useEffect(() => {
    getItems(preferences.uid, '/').then(data => {
      setData(data)
      setLoaded(true)
    })
  }, [])

  return (
    <>
      <Group sx={{ width: '100%' }} spacing={0} grow>
        <Center
          onClick={() => setActive('files')}
          p="md"
          sx={{
            cursor: 'pointer',
            transition: 'all 300ms',
            borderBottom:
              active == 'files'
                ? '1px solid #333333'
                : '1px solid rgba(0,0,0,0)',
            backgroundColor: active == 'files' ? '#121212' : '',
            ':hover': {
              borderBottom: '1px solid #333333',
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
            borderBottom:
              active == 'upload'
                ? '1px solid #333333'
                : '1px solid rgba(0,0,0,0)',
            backgroundColor: active == 'upload' ? '#121212' : '',
            ':hover': {
              borderBottom: '1px solid #333333',
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
            borderBottom:
              active == 'settings'
                ? '1px solid #333333'
                : '1px solid rgba(0,0,0,0)',
            backgroundColor: active == 'settings' ? '#121212' : '',
            ':hover': {
              borderBottom: '1px solid #333333',
            },
          }}
        >
          <Settings />
        </Center>
      </Group>
      {active == 'files' && <Files data={data} loaded={loaded} />}
      {active == 'upload' && <Uploading />}
      {active == 'settings' && <Preferences />}
    </>
  )
}
