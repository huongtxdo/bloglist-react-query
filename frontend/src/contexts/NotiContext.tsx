import { Dispatch } from 'react';
import {
  useReducer,
  createContext,
  useContext,
  PropsWithChildren,
} from 'react';

const emptyState = { notiType: '', notiMsg: '' };

const notiReducer = (
  state: { notiType: string; notiMsg: string },
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case 'login':
    case 'register':
    case 'like':
    case 'create':
    case 'delete':
      return { notiType: 'notification', notiMsg: action.payload };
    case 'logout':
      return { notiType: 'logoutNoti', notiMsg: action.payload };
    case 'error':
      return { notiType: 'error', notiMsg: action.payload };
    case 'reset':
      return emptyState;
    default:
      return state;
  }
};

interface NotiContext {
  noti: { notiType: string; notiMsg: string };
  notiDispatch: Dispatch<{ type: string; payload: string }>;
}

const NotiContext = createContext<NotiContext | null>({
  noti: emptyState,
  notiDispatch: () => null,
});

export const NotiProvider = (props: PropsWithChildren) => {
  const [noti, notiDispatch] = useReducer(notiReducer, emptyState);

  return (
    <NotiContext.Provider value={{ noti, notiDispatch }}>
      {props.children}
    </NotiContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotiValue = () => {
  const valueAndDispatch = useContext(NotiContext);
  if (!valueAndDispatch)
    throw new Error('useNotiValue must be used within NotiProvider');
  return valueAndDispatch.noti;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotiDispatch = () => {
  const valueAndDispatch = useContext(NotiContext);
  if (!valueAndDispatch)
    throw new Error('useNotiDispatch must be used within NotiProvider');
  return valueAndDispatch.notiDispatch;
};

export default NotiContext;

