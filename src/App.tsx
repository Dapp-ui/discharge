import { GlobalStyle } from './styles/GlobalStyle'
import { MantineProvider, Group } from '@mantine/core'
import { ElectronProvider } from './providers/ElectronProvider'
import { Page } from './Page'

export function App() {
  return (
    <ElectronProvider>
      <MantineProvider
        theme={{ colorScheme: 'dark', fontFamily: 'Poppins' }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Group
          direction="column"
          position="center"
          align="center"
          sx={{ width: '100vw', height: '100vh', padding: '1rem' }}
        >
          <GlobalStyle />
          <Page />
        </Group>
      </MantineProvider>
    </ElectronProvider>
  )
}
