import { Dispatch } from 'react'
import { useReducer, createContext, useContext, PropsWithChildren } from 'react'

const notiReducer = (
  state: string,
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case 'login':
      return action.payload
    case 'like':
      return action.payload
    case 'create':
      return action.payload
    case 'delete':
      return action.payload
    case 'error':
      return action.payload
    case 'reset':
      return ''
    default:
      return state
  }
}

const NotiContext = createContext<{
  notiMessage: string
  notiMessageDispatch: Dispatch<{ type: string; payload: string }>
}>({
  notiMessage: '',
  notiMessageDispatch: () => null,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageValue = () => {
  const valueAndDispatch = useContext(NotiContext)
  return valueAndDispatch.notiMessage
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageDispatch = () => {
  const valueAndDispatch = useContext(NotiContext)
  return valueAndDispatch.notiMessageDispatch
}

export const NotiContextProvider = (props: PropsWithChildren) => {
  const [notiMessage, notiMessageDispatch] = useReducer(notiReducer, '')

  return (
    <NotiContext.Provider value={{ notiMessage, notiMessageDispatch }}>
      {props.children}
    </NotiContext.Provider>
  )
}

export default NotiContext

