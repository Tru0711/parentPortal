"use client"
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user) {
    return null
  }

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand href="/dashboard">
          <i className="fas fa-graduation-cap me-2"></i>
          Parent Portal
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">
              <i className="fas fa-tachometer-alt me-1"></i>
              Dashboard
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              title={
                <>
                  <i className="fas fa-user me-1"></i>
                  {user.name} ({user.role})
                </>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="/profile">
                <i className="fas fa-user-edit me-1"></i>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-1"></i>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
