"use client"
import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Nav } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
  const [activeTab, setActiveTab] = useState("student")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    contactNumber: "",
    relation: "",
    class: "",
    rollNumber: "",
    parentEmail: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      const userData = {
        ...formData,
        role: activeTab,
      }
      delete userData.confirmPassword

      const result = await register(userData)
      if (result.success) {
        navigate("/dashboard")
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      contactNumber: "",
      relation: "",
      class: "",
      rollNumber: "",
      parentEmail: "",
    })
    setError("")
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    resetForm()
  }

  return (
    <div className="login-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="login-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <i className="fas fa-user-plus fa-3x text-primary mb-3"></i>
                  <h2 className="fw-bold">Create Account</h2>
                  <p className="text-muted">Register for Parent Portal</p>
                </div>

                <Nav variant="pills" className="justify-content-center mb-4">
                  <Nav.Item>
                    <Nav.Link active={activeTab === "student"} onClick={() => handleTabChange("student")}>
                      <i className="fas fa-user-graduate me-2"></i>
                      Student
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link active={activeTab === "parent"} onClick={() => handleTabChange("parent")}>
                      <i className="fas fa-users me-2"></i>
                      Parent
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-user me-2"></i>
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter full name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-envelope me-2"></i>
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-lock me-2"></i>
                          Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="fas fa-lock me-2"></i>
                          Confirm Password
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm password"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {activeTab === "parent" && (
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-phone me-2"></i>
                            Contact Number
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="Enter contact number"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-heart me-2"></i>
                            Relation
                          </Form.Label>
                          <Form.Select name="relation" value={formData.relation} onChange={handleChange} required>
                            <option value="">Select relation</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Guardian">Guardian</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  )}

                  {activeTab === "student" && (
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-school me-2"></i>
                            Class
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="class"
                            value={formData.class}
                            onChange={handleChange}
                            placeholder="e.g., 10A"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-id-badge me-2"></i>
                            Roll Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="rollNumber"
                            value={formData.rollNumber}
                            onChange={handleChange}
                            placeholder="Enter roll number"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="fas fa-envelope me-2"></i>
                            Parent Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="parentEmail"
                            value={formData.parentEmail}
                            onChange={handleChange}
                            placeholder="Parent's email"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  )}

                  <Button type="submit" className="w-100 mb-3" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="mb-0">Already have an account?</p>
                  <Link to="/login" className="btn btn-outline-primary">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Sign In Here
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Register
