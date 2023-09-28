import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap'

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
  const titleStyle = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '36px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  }

  return (
    <Container>
      <Router>
        <Notification />

        {!loginValue && <LoginForm />}

        {loginValue && (
          <>
            <Navbar bg="dark" variant="dark">
              <Nav className="mr-auto">
                <Nav.Link href="/">Blogs</Nav.Link>
                <Nav.Link href="/users">Users</Nav.Link>
              </Nav>
              <Nav className="ml-auto">
                <Nav.Link>
                  <UserLoggedIn user={loginValue} />
                </Nav.Link>
              </Nav>
            </Navbar>

            <div className="mb-4 mt-4">
              <h2 style={titleStyle}>Blog App</h2>
            </div>

            <Routes>
              <Route path="/" element={<Blogs />} />
              <Route path="/users" element={<Users />} />
              <Route path="/blogs/:id" element={<Blog user={loginValue} />} />
              <Route path="/users/:id" element={<User />} />
            </Routes>
          </>
        )}
      </Router>
    </Container>
  )
}

export default App

