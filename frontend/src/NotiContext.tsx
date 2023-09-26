import { Dispatch } from 'react'
import { useReducer, createContext, useContext, PropsWithChildren } from 'react'

const notiReducer = (
  state: { notiType: string; notiMsg: string },
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case 'login':
      return { notiType: 'notification', notiMsg: action.payload }
    case 'like':
      return { notiType: 'notification', notiMsg: action.payload }
    case 'create':
      return { notiType: 'notification', notiMsg: action.payload }
    case 'delete':
      return { notiType: 'notification', notiMsg: action.payload }
    case 'error':
      return { notiType: 'error', notiMsg: action.payload }
    case 'reset':
      return { notiType: '', notiMsg: '' }
    default:
      return state
  }
}

const NotiContext = createContext<{
  noti: { notiType: string; notiMsg: string }
  notiDispatch: Dispatch<{ type: string; payload: string }>
}>({
  noti: { notiType: '', notiMsg: '' },
  notiDispatch: () => null,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useNotiValue = () => {
  const valueAndDispatch = useContext(NotiContext)
  return valueAndDispatch.noti
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotiDispatch = () => {
  const valueAndDispatch = useContext(NotiContext)
  return valueAndDispatch.notiDispatch
}

export const NotiContextProvider = (props: PropsWithChildren) => {
  const [noti, notiDispatch] = useReducer(notiReducer, {
    notiType: '',
    notiMsg: '',
  })

  return (
    <NotiContext.Provider value={{ noti, notiDispatch }}>
      {props.children}
    </NotiContext.Provider>
  )
}

export default NotiContext

