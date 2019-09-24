import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'


function App() {
  return (
    <div className="App">
      <Container className="splash-container">
          <Row class="justify-content-md-center">
            <Col>
              <h4>This app creates a visualization based on microphone input.</h4>
            </Col>
          </Row>
          <Row class="justify-content-md-center">
            <Col>
              <Button className="mt-4" size="lg">Start</Button>
            </Col>
          </Row>
      </Container>
    </div>
  );
}

export default App;
