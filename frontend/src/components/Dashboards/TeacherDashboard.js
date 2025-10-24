"use client"
import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Table, Modal, Alert, Nav } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import axios from "axios"

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [activeTab, setActiveTab] = useState("attendance")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [formData, setFormData] = useState({})
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students")
      setStudents(response.data)
    } catch (error) {
      console.error("Error fetching students:", error)
      showAlert("Failed to load students", "danger")
    }
  }

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000)
  }

  const handleModalOpen = (type, student = "") => {
    setModalType(type)
    setSelectedStudent(student)
    setFormData({})
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setFormData({})
  }

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let endpoint = ""
      const data = { ...formData, studentId: selectedStudent }

      switch (modalType) {
        case "attendance":
          endpoint = "/api/attendance"
          break
        case "marks":
          endpoint = "/api/marks"
          break
        case "behavior":
          endpoint = "/api/behavior"
          break
        case "message":
          // Get parent info first
          const parentResponse = await axios.get(`/api/messages/parent/${selectedStudent}`)
          data.toUserId = parentResponse.data.id
          endpoint = "/api/messages"
          break
        default:
          return
      }

      await axios.post(endpoint, data)
      showAlert(`${modalType} updated successfully!`, "success")
      handleModalClose()
    } catch (error) {
      console.error(`Error updating ${modalType}:`, error)
      showAlert(`Failed to update ${modalType}`, "danger")
    }
  }

  const renderModal = () => {
    const student = students.find((s) => s.id === selectedStudent)

    return (
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType.charAt(0).toUpperCase() + modalType.slice(1)} - {student?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {modalType === "attendance" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" name="date" onChange={handleFormChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" onChange={handleFormChange} required>
                    <option value="">Select status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control type="text" name="subject" onChange={handleFormChange} placeholder="Subject name" />
                </Form.Group>
              </>
            )}

            {modalType === "marks" && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control type="text" name="subject" onChange={handleFormChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Exam Type</Form.Label>
                      <Form.Control type="text" name="examType" onChange={handleFormChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Marks Obtained</Form.Label>
                      <Form.Control type="number" name="marks" onChange={handleFormChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Total Marks</Form.Label>
                      <Form.Control type="number" name="totalMarks" onChange={handleFormChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Exam Date</Form.Label>
                      <Form.Control type="date" name="examDate" onChange={handleFormChange} required />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {modalType === "behavior" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" name="date" onChange={handleFormChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select name="type" onChange={handleFormChange} required>
                    <option value="">Select type</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" onChange={handleFormChange} required />
                </Form.Group>
              </>
            )}

            {modalType === "message" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control type="text" name="subject" onChange={handleFormChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={4} name="message" onChange={handleFormChange} required />
                </Form.Group>
              </>
            )}

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleModalClose} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="fas fa-chalkboard-teacher me-2"></i>
              Teacher Dashboard
            </h2>
            <p className="text-muted mb-0">Welcome, {user.name}</p>
          </div>

          {alert.show && <Alert variant={alert.type}>{alert.message}</Alert>}

          <Nav variant="tabs" className="mb-4">
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
                Messages
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Card className="dashboard-card">
            <Card.Header>
              <h5>
                <i className="fas fa-users me-2"></i>
                Students Management
              </h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Roll No</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.class}</td>
                      <td>{student.roll_number}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          onClick={() => handleModalOpen("attendance", student.id)}
                        >
                          <i className="fas fa-calendar-check"></i>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-success"
                          className="me-2"
                          onClick={() => handleModalOpen("marks", student.id)}
                        >
                          <i className="fas fa-graduation-cap"></i>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-warning"
                          className="me-2"
                          onClick={() => handleModalOpen("behavior", student.id)}
                        >
                          <i className="fas fa-star"></i>
                        </Button>
                        <Button size="sm" variant="outline-info" onClick={() => handleModalOpen("message", student.id)}>
                          <i className="fas fa-envelope"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {renderModal()}
    </Container>
  )
}

export default TeacherDashboard
