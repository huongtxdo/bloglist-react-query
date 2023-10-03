import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { NotiContextProvider } from './contexts/NotiContext'
import { LoginContextProvider } from './contexts/LoginContext'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NotiContextProvider>
    <LoginContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </LoginContextProvider>
  </NotiContextProvider>
)

