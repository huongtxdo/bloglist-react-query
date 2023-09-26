import { useNotiValue } from '../NotiContext'

const Notification = () => {
  const notification = useNotiValue()

  return <div className={notification.notiType}>{notification.notiMsg}</div>
}

export default Notification

