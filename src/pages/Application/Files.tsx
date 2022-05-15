import {
  Accordion,
  Group,
  Skeleton,
  Text,
  createStyles,
  ActionIcon,
  Tooltip,
  ScrollArea,
} from '@mantine/core'
import { useEffect, useRef, useState, ForwardedRef } from 'react'
import {
  FolderX,
  FolderPlus,
  Download,
  Folder,
  Trash,
  X,
} from 'tabler-icons-react'
import { getItems } from '../../lib/estuary'
import { useElectron } from '../../providers/ElectronProvider'
import { useEstuary } from '../../providers/EstuaryProvider'

function File({ item }: any) {
  return (
    <Group position="apart" py="xs" px="xl" sx={{ width: '100%' }}>
      <Text sx={{ maxWidth: '80%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {item.name.length > 32
          ? item.name.slice(0, item.name.length - 4).slice(0, 30) + '...'
          : item.name.slice(0, item.name.length - 4)}
      </Text>
      <Group>
        <Tooltip label="Download to device">
          <ActionIcon size="xs">
            <Download />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete permanently">
          <ActionIcon size="xs">
            <Trash />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  )
}

function Directory({ item, path }: any) {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState<Array<any> | null>(null)

  const { classes } = createStyles((theme, _params, getRef) => ({
    content: {
      padding: 0,
    },
    contentInner: {
      padding: 0,
    },
  }))()

  const loadData = () => {
    if (!data) setData(window.Main.sendSync('app:files:get', path + item.name))
    setLoaded(true)
  }

  const Label = ({ name }: any) => {
    return (
      <Group position="apart">
        <Text>
          {name.length > 32 ? item.name.slice(0, 30) + '...' : item.name}
        </Text>
        <Group>
          <Tooltip label="Download folder">
            <ActionIcon size="sm">
              <Download />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete folder">
            <ActionIcon size="sm">
              <Trash />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    )
  }

  return (
    <Accordion sx={{ width: '100%' }}>
      <Accordion.Item
        onTransitionEnd={loadData}
        label={<Label name={item.name} />}
        classNames={classes}
      >
        {!loaded || data === null ? (
          <>
            <Skeleton width="90%" height="20px" m="md" />
            <Skeleton width="90%" height="20px" m="md" />
            <Skeleton width="90%" height="20px" m="md" />
          </>
        ) : (
          <>
            {data.map((itm: any, i: number) => {
              if (itm.type == 'file') return <File key={i} item={itm} />
              else if (itm.type == 'directory')
                return (
                  <Directory key={i} item={itm} path={path + item.name + '/'} />
                )
            })}
          </>
        )}
      </Accordion.Item>
    </Accordion>
  )
}

function Display({ data }: any) {
  return (
    <>
      {data.length == 0 ? (
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
        <ScrollArea
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            paddingRight: '0.75rem',
          }}
        >
          {data.map((item: any, i: number) => {
            if (item.type == 'file') return <File key={i} item={item} />
            else if (item.type == 'directory')
              return <Directory key={i} item={item} path="/" />
          })}
        </ScrollArea>
      )}
    </>
  )
}

export function Files({ data }: any) {
  const { loaded } = useEstuary()

  return (
    <Group
      direction="column"
      position="center"
      align="center"
      sx={{ height: '80vh', width: '100vw' }}
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
        <Display data={data} />
      )}
    </Group>
  )
}
