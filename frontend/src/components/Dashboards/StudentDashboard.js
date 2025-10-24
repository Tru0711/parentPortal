"use client"
import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Table, Badge, Nav, Alert, Spinner } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"

const StudentDashboard = () => {
  const { user } = useAuth()
  const [studentData, setStudentData] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`/api/students/${user.id}`)
      setStudentData(response.data)
    } catch (error) {
      console.error("Error fetching student data:", error)
      setError("Failed to load student data")
    } finally {
      setLoading(false)
    }
  }

  const getAttendanceStatus = (status) => {
    switch (status) {
      case "present":
        return <Badge bg="success">Present</Badge>
      case "absent":
        return <Badge bg="danger">Absent</Badge>
      case "late":
        return <Badge bg="warning">Late</Badge>
      default:
        return <Badge bg="secondary">{status}</Badge>
    }
  }

  const getBehaviorBadge = (type) => {
    switch (type) {
      case "positive":
        return <Badge bg="success">Positive</Badge>
      case "negative":
        return <Badge bg="danger">Negative</Badge>
      case "neutral":
        return <Badge bg="secondary">Neutral</Badge>
      default:
        return <Badge bg="secondary">{type}</Badge>
    }
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your dashboard...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>
                <i className="fas fa-user-graduate me-2"></i>
                My Dashboard
              </h2>
              <p className="text-muted mb-0">
                Class: {user.class} | Roll No: {user.roll_number}
              </p>
            </div>
          </div>

          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                <i className="fas fa-chart-line me-2"></i>
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === "attendance"} onClick={() => setActiveTab("attendance")}>
                <i className="fas fa-calendar-check me-2"></i>
                My Attendance
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === "marks"} onClick={() => setActiveTab("marks")}>
                <i className="fas fa-graduation-cap me-2"></i>
                My Marks
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === "behavior"} onClick={() => setActiveTab("behavior")}>
                <i className="fas fa-star me-2"></i>
                Behavior
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === "overview" && studentData && (
            <Row>
              <Col md={4}>
                <Card className="stat-card text-center">
                  <Card.Body>
                    <h3>{studentData.stats.attendancePercentage}%</h3>
                    <p>My Attendance</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stat-card text-center">
                  <Card.Body>
                    <h3>{studentData.stats.averageMarks}%</h3>
                    <p>Average Marks</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stat-card text-center">
                  <Card.Body>
                    <h3>{studentData.stats.totalSubjects}</h3>
                    <p>Subjects</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === "attendance" && studentData && (
            <Card className="dashboard-card">
              <Card.Header>
                <h5>
                  <i className="fas fa-calendar-check me-2"></i>
                  My Attendance Record
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Subject</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.attendance.map((record, index) => (
                      <tr key={index}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{record.subject || "N/A"}</td>
                        <td>{getAttendanceStatus(record.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {activeTab === "marks" && studentData && (
            <Card className="dashboard-card">
              <Card.Header>
                <h5>
                  <i className="fas fa-graduation-cap me-2"></i>
                  My Exam Results
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Exam Type</th>
                      <th>Marks</th>
                      <th>Grade</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.marks.map((mark, index) => (
                      <tr key={index}>
                        <td>{mark.subject}</td>
                        <td>{mark.exam_type}</td>
                        <td>
                          {mark.marks}/{mark.total_marks}
                        </td>
                        <td>
                          <Badge bg="primary">{mark.grade}</Badge>
                        </td>
                        <td>{new Date(mark.exam_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {activeTab === "behavior" && studentData && (
            <Card className="dashboard-card">
              <Card.Header>
                <h5>
                  <i className="fas fa-star me-2"></i>
                  Behavior Records
                </h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.behavior.map((record, index) => (
                      <tr key={index}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>{getBehaviorBadge(record.type)}</td>
                        <td>{record.description}</td>
                        <td>{record.teacher_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default StudentDashboard
