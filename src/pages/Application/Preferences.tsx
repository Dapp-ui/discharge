import {
  ActionIcon,
  Badge,
  Button,
  Code,
  Divider,
  Group,
  Select,
  Slider,
  Text,
  Tooltip,
} from '@mantine/core'
import { Edit } from 'tabler-icons-react'
import { useElectron } from '../../providers/ElectronProvider'
import { useState } from 'react'
import { DirectoryButton } from './styles'

function Setting({ label, children }: any) {
  return (
    <>
      <Divider sx={{ width: '90vw' }} label={label} />
      <Group direction="column" sx={{ width: '90vw', minHeight: '8vh' }} grow>
        {children}
      </Group>
    </>
  )
}

export function Preferences() {
  const { preferences } = useElectron()

  const chooseDirectory = () => window.Main.send('app:preferences:set:path')

  const data = [
    { label: 'Automatically', value: 'auto' },
    { label: 'Every 1 hour', value: 'hr' },
    { label: 'Every 24 hours', value: 'day' },
    { label: 'Every 1 week', value: 'week' },
    { label: "Don't Sync", value: 'disabled' },
  ]

  const updateSync = (value: string) =>
    window.Main.send('app:preferences:set:sync', value)

  return (
    <Group direction="column">
      <Setting label="Upload Path">
        <DirectoryButton onClick={chooseDirectory}>
          {preferences.path}
        </DirectoryButton>
      </Setting>
      <Setting label="Sync">
        <Select
          variant="default"
          value={preferences.sync}
          onChange={updateSync}
          data={data}
        />
      </Setting>
      <Setting label="Admin">
        <Code>{preferences.uid}</Code>
        <Button color="red" variant="light" fullWidth>
          Delete All Data
        </Button>
      </Setting>
    </Group>
  )
}
