import React, { useState } from 'react';
import { Button, Form, Col, Row, Container, Card, Alert, Image } from 'react-bootstrap';

function StudentInfo() {
  const [student, setStudent] = useState(null);
  const [studentCode, setStudentCode] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`/data/${studentCode}/info.json`);
      if (!response.ok) {
        throw new Error('Student not found');
      }

      const data = await response.json();
      setStudent(data);
      setError(''); // Limpiamos el error si la búsqueda es exitosa
    } catch (err) {
      setStudent(null);
      setError('El estudiante no está registrado');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <Form>
            <Form.Group controlId="studentCode">
              <Form.Label>Código del Estudiante</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el código del estudiante"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handleSearch}>
              Buscar
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-md-center mt-5">
        <Col md={8}>
          {error && <Alert variant="danger">{error}</Alert>}
          {student && (
            <Card>
              <Card.Body>
                <Row>
                  <Col md={4} className="text-center">
                    {student.foto && (
                      <Image
                        src={student.foto}
                        roundedCircle
                        width="150"
                        className="mb-3"
                      />
                    )}
                  </Col>
                  <Col md={8}>
                    <Card.Title>{student.nombre}</Card.Title>
                    <Card.Text>Edad: {student.edad}</Card.Text>
                    <Card.Text>Carrera: {student.carrera}</Card.Text>
                    <Card.Text>Semestre: {student.semestre}</Card.Text>
                    <Card.Text>Gustos: {student.gustos.join(', ')}</Card.Text>
                    <Card.Text>No le gusta: {Array.isArray(student.noGustos) && student.noGustos.length > 0 ? student.noGustos.join(', ') : 'Información no disponible'}</Card.Text>
                    <Card.Text>Red Social: <a href={student.redSocial} target="_blank" rel="noopener noreferrer">{student.redSocial}</a></Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default StudentInfo;