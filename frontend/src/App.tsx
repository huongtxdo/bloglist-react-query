import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'

import './index.css'
import { useLoginValue } from './LoginContext.tsx'

import Blogs from './components/Blogs.tsx'
import Users from './components/Users.tsx'
import Blog from './components/Blog.tsx'
import User from './components/User.tsx'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import UserLoggedIn from './components/UserLoggedIn.tsx'

const App = () => {
  const loginValue = useLoginValue()

  // *** FOR TESTING ONLY!!  DELETE EVERYTHING
  /*
  const DeleteAllBlogs = () => {
    const deleteAllBlogs = async (event) => {
      const response = await blogService.deleteAll()
      if (response.status === 204) setBlogs([])
    }
    return <button onClick={deleteAllBlogs}>delete all blogs</button>
  }
  */

  // const style = {
  //   background: '#bac3d1',
  //   margin: 'auto',
  //   width: '467',
  //   height: 40,
  // }
  const padding = { padding: 5 }

  return (
    <Router>
      <Notification />

      {!loginValue && <LoginForm />}

      {loginValue && (
        <>
          <Navbar bg="dark" variant="dark">
            <Nav className="me-auto">
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/">
                  Blogs
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">
                  Users
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <UserLoggedIn user={loginValue} />
              </Nav.Link>
            </Nav>
          </Navbar>

          <h2>blog app</h2>
          <br />
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/" element={<Blogs />} />
            <Route path="/blogs/:id" element={<Blog user={loginValue} />} />
            <Route path="/users/:id" element={<User />} />
          </Routes>
        </>
      )}
    </Router>
  )
}

export default App

