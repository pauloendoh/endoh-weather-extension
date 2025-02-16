import { NotificationsProvider } from '@mantine/notifications'

import { MantineProvider, Paper } from '@mantine/core'
import React from 'react'
import ReactDOM from 'react-dom'
import { PopupContent } from './components/popup/PopupContent/PopupContent'
import { myTheme } from './utils/myTheme'

const Popup = () => {
  return (
    <Paper sx={{ width: 300, minHeight: 300, padding: 16 }}>
      <PopupContent />
    </Paper>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        ...myTheme,
        colorScheme: 'dark',
      }}
    >
      <NotificationsProvider>
        <Popup />
      </NotificationsProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
