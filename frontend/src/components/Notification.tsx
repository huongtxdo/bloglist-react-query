import { useMessageValue } from '../NotiContext'

const Notification = () => {
  const errorMessage = useMessageValue()
  const notification = useMessageValue()

  let className = ''
  if (errorMessage !== '') className = 'error'
  if (notification !== '') className = 'notification'

  return <div className={className}>{notification}</div>
}

export default Notification

