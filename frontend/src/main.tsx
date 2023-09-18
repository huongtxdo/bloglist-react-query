import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { NotiContextProvider } from './NotiContext'
import { LoginContextProvider } from './LoginContext'
import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NotiContextProvider>
    <LoginContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </LoginContextProvider>
  </NotiContextProvider>
)

