import { Loader, Group, Skeleton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { ESTUARY_API_KEY, getFiles } from '../../lib/estuary'
import { useElectron } from '../../providers/ElectronProvider'

export function Files() {
  const { preferences } = useElectron()

  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState(null)

  useEffect(() => {
    getFiles(preferences.uid).then(data => {
      setFiles(data)
      setLoading(false)
    })
  }, [])

  return (
    <Group
      direction="column"
      position="center"
      align="center"
      sx={{ height: '75vh', width: '90vw' }}
    >
      {loading ? (
        <>
          <Skeleton width="100%" height="10vh" />
          <Skeleton width="100%" height="10vh" />
          <Skeleton width="100%" height="10vh" />
          <Skeleton width="100%" height="10vh" />
          <Skeleton width="100%" height="10vh" />
          <Skeleton width="100%" height="10vh" />
        </>
      ) : null}
    </Group>
  )
}
