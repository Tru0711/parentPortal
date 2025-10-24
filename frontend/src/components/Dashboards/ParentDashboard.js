"use client"
import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Table, Badge, Nav, Alert, Spinner } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"

const ParentDashboard = () => {
  const { user } = useAuth()
  const [studentData, setStudentData] = useState(null)
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStudentData()
    fetchMessages()
  }, [])

  const fetchStudentData = async () => {
    try {
      // Find student linked to this parent
      const studentsResponse = await axios.get("/api/students")
      const linkedStudent = studentsResponse.data.find((student) => student.parent_email === user.email)

      if (linkedStudent) {
        const response = await axios.get(`/api/students/${linkedStudent.id}`)
        setStudentData(response.data)
      }
    } catch (error) {
      console.error("Error fetching student data:", error)
      setError("Failed to load student data")
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await axios.get("/api/messages")
      setMessages(response.data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const markMessageAsRead = async (messageId) => {
    try {
      await axios.patch(`/api/messages/${messageId}/read`)
      fetchMessages()
    } catch (error) {
      console.error("Error marking message as read:", error)
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
        <p className="mt-3">Loading dashboard...</p>
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

  if (!studentData) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">No student data found. Please contact the school administration.</Alert>
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
                {studentData.student.name}'s Dashboard
              </h2>
              <p className="text-muted mb-0">
                Class: {studentData.student.class} | Roll No: {studentData.student.roll_number}
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
                Attendance
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === "marks"} onClick={() => setActiveTab("marks")}>
                <i className="fas fa-graduation-cap me-2"></i>
                Marks
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === "behavior"} onClick={() => setActiveTab("behavior")}>
                <i className="fas fa-star me-2"></i>
                Behavior
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link active={activeTab === "messages"} onClick={() => setActiveTab("messages")}>
                <i className="fas fa-envelope me-2"></i>
                Messages ({messages.filter((m) => !m.is_read).length})
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === "overview" && (
            <Row>
              <Col md={4}>
                <Card className="stat-card text-center">
                  <Card.Body>
                    <h3>{studentData.stats.attendancePercentage}%</h3>
                    <p>Attendance Rate</p>
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
                    <p>Total Subjects</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === "attendance" && (
            <Card className="dashboard-card">
              <Card.Header>
                <h5>
                  <i className="fas fa-calendar-check me-2"></i>
                  Recent Attendance
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

          {activeTab === "marks" && (
            <Card className="dashboard-card">
              <Card.Header>
                <h5>
                  <i className="fas fa-graduation-cap me-2"></i>
                  Exam Results
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

          {activeTab === "behavior" && (
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

          {activeTab === "messages" && (
            <Card className="dashboard-card">
              <Card.Header>
                <h5>
                  <i className="fas fa-envelope me-2"></i>
                  Messages from Teachers
                </h5>
              </Card.Header>
              <Card.Body>
                {messages.length === 0 ? (
                  <p className="text-muted">No messages yet.</p>
                ) : (
                  messages.map((message) => (
                    <Card
                      key={message.id}
                      className={`mb-3 ${message.is_read ? "message-read" : "message-unread"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => !message.is_read && markMessageAsRead(message.id)}
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{message.subject}</h6>
                            <p className="mb-1">{message.message}</p>
                            <small className="text-muted">
                              From: {message.from_name} | {new Date(message.created_at).toLocaleDateString()}
                            </small>
                          </div>
                          {!message.is_read && <Badge bg="primary">New</Badge>}
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ParentDashboard
