"use client"
import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Table, Badge, Nav } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"

const AdminDashboard = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [students, setStudents] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const studentsResponse = await axios.get("/api/students")
      setStudents(studentsResponse.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    const variants = {
      admin: "danger",
      teacher: "primary",
      parent: "success",
      student: "info",
    }
    return <Badge bg={variants[role] || "secondary"}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="fas fa-cogs me-2"></i>
              Admin Dashboard
            </h2>
            <p className="text-muted mb-0">Welcome, {user.name}</p>
          </div>

          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                <i className="fas fa-chart-line me-2"></i>
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === "students"} onClick={() => setActiveTab("students")}>
                <i className="fas fa-user-graduate me-2"></i>
                Students
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === "reports"} onClick={() => setActiveTab("reports")}>
                <i className="fas fa-chart-bar me-2"></i>
                Reports
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === "overview" && (
            <Row>
              <Col md={3}>
                <Card className="stat-card text-center">
                  <Card.Body>
                    <h3>{students.length}</h3>
                    <p>Total Students</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card text-center">
                  <Card.Body>
                    <h3>{[...new Set(students.map((s) => s.class))].length}</h3>
                    <p>Total Classes</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card text-center">
                  <Card.Body>
                    <h3>4</h3>
                    <p>User Roles</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card text-center">
                  <Card.Body>
                    <h3>Active</h3>
                    <p>System Status</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === "students" && (
            <Card className="dashboard-card">
              <Card.Header>
                <h5>
                  <i className="fas fa-user-graduate me-2"></i>
                  Student Management
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Class</th>
                      <th>Roll No</th>
                      <th>Parent Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.class}</td>
                        <td>{student.roll_number}</td>
                        <td>{student.parent_email}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {activeTab === "reports" && (
            <Row>
              <Col md={6}>
                <Card className="dashboard-card">
                  <Card.Header>
                    <h5>Class Distribution</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table>
                      <thead>
                        <tr>
                          <th>Class</th>
                          <th>Students</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...new Set(students.map((s) => s.class))].sort().map((className) => (
                          <tr key={className}>
                            <td>{className}</td>
                            <td>{students.filter((s) => s.class === className).length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="dashboard-card">
                  <Card.Header>
                    <h5>System Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <p>
                      <strong>Database:</strong> MySQL
                    </p>
                    <p>
                      <strong>Backend:</strong> Node.js + Express
                    </p>
                    <p>
                      <strong>Frontend:</strong> React.js + Bootstrap
                    </p>
                    <p>
                      <strong>Authentication:</strong> JWT
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard
