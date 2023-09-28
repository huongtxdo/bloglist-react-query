import { Row, Col } from 'react-bootstrap'

import { useNotiValue } from '../NotiContext'

const Notification = () => {
  const notification = useNotiValue()
  const bootstrapClass = (() => {
    switch (notification.notiType) {
      case 'notification':
      case 'logoutNoti':
        return 'alert alert-success'
      case 'error':
        return 'alert alert-warning'
      default:
        return ''
    }
  })()

  if (notification.notiType === 'logoutNoti') {
    return (
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <div className={bootstrapClass} role="alert">
            {notification.notiMsg}
          </div>
        </Col>
      </Row>
    )
  }

  return (
    <div className={bootstrapClass} role="alert">
      {notification.notiMsg}
    </div>
  )
}

export default Notification

