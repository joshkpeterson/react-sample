import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: 0
    };

    // let audioContext;
    // let mediaStreamSource;
    // let meter;
    // let volume;
  }



  startAudio(e) {
    e.preventDefault();
    console.log('The link was clicked.');

debugger;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream)
        this.meter = this.createAudioMeter(this.audioContext)
        this.mediaStreamSource.connect(this.meter)
      })
    }
  }


  createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
    const processor = audioContext.createScriptProcessor(512)
    processor.onaudioprocess = this.volumeAudioProcess
    processor.clipping = false
    processor.lastClip = 0
    processor.volume = 0
    processor.clipLevel = clipLevel || 0.98
    processor.averaging = averaging || 0.95
    processor.clipLag = clipLag || 750

    // this will have no effect, since we don't copy the input to the output,
    // but works around a current Chrome bug.
    processor.connect(audioContext.destination)

    processor.checkClipping = function () {
      if (!this.clipping) {
        return false
      }
      if ((this.lastClip + this.clipLag) < window.performance.now()) {
        this.clipping = false
      }
      return this.clipping
    }

    processor.shutdown = function () {
      this.disconnect()
      this.onaudioprocess = null
    }

    return processor
  }

  volumeAudioProcess(event) {
    const buf = event.inputBuffer.getChannelData(0)
    const bufLength = buf.length
    let sum = 0
    let x

    // Do a root-mean-square on the samples: sum up the squares...
    for (var i = 0; i < bufLength; i++) {
      x = buf[i]
      if (Math.abs(x) >= this.clipLevel) {
          this.clipping = true
          this.lastClip = window.performance.now()
      }
      sum += x * x
    }

    // ... then take the square root of the sum.
    const rms = Math.sqrt(sum / bufLength)

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.volume = Math.max(rms, this.volume * this.averaging)
    // document.getElementById('audio-value').innerHTML = this.volume
  }

  render() {
    return (
      <div className="App">
        <Container className="splash-container">
            <Row>
              <Col>
                <h4>This app creates a visualization based on microphone input.</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button onClick={this.startAudio} className="mt-4" size="lg">Start</Button>
              </Col>
            </Row>
        </Container>
        <Container className="visualization-container">
          <h1>{this.volume}</h1>
        </Container>
      </div>
    );
  }
}

export default App;
