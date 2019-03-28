import React, { Component } from 'react';
import logo from './images/oracle_logo.png';
import './App.css';

class Nav extends Component {
  render() {
    return (
      <div className="Nav">
        <nav className="navbar navbar-expand-lg navbar-light">
          <img src={logo} id="logo" alt="Oracle" />
        </nav>
      </div>
    );
  }
}

function Image(props) {
  return <i className={props.image}></i>;
}

function Title(props) {
  return <h1 className="title">{props.title}</h1>;
}

function Text(props) {
  return <p className="text">{props.text}</p>;
}

function Button(props) {
  return <button type="button" className="btn btn-danger" onClick={Lightbox}>{props.button}</button>;
}

class Date extends Component {
  state = { data: [] }

  componentDidMount() {
    fetch('/data')
      .then(res => res.json())
      .then(data => this.setState({ data }));
  }

  render() {
    return (
      <p className="date">LAST UPDATED {this.state.data}</p>
    );
  }
}

class Lightbox extends Component {
  constructor(props) {
    super(props);
    this.state = {displayOn: true};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this.state.displayOn);
    this.setState(state => ({
      displayOn: !state.displayOn
    }));
  }

  render() {
    return (
      <div className="Lightbox">
        <button onClick={this.handleClick}>
          click
        </button>
        <div className="modal" style={{display: this.state.displayOn ? 'none' : 'block'}}>
          <div className="modalBox">
            Inside of modalBox
          </div>
        </div>
      </div>
    );
  }
}

// function Lightbox() {
//   return <h1 className="lightbox" >This is Lightbox</h1>;
// }

function Box(props) {
  return(
    <div className="Box col-lg-4">
      <Image image={props.image}></Image>
      <Title title={props.title}></Title>
      <Text text={props.text}></Text>
      <Button button={props.button}></Button>
      <Date></Date>
      <Lightbox></Lightbox>
    </div>
  );
}

class Main extends Component {
  render() {
    return (
      <div className="Main container-fluid">
        <div className="row">
          <div className="col-lg-1"></div>
          <Box 
            image={downloadBox.image} 
            title={downloadBox.title} 
            text={downloadBox.text} 
            button={downloadBox.button}
          ></Box>
          <div className="col-lg-2"></div>
          <Box 
            image={uniqueBox.image} 
            title={uniqueBox.title} 
            text={uniqueBox.text} 
            button={uniqueBox.button}
          ></Box>
          <div className="col-lg-1"></div>
        </div>
      </div>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <div className="footer fixed-bottom">Copyright &copy;2019 Oracle</div>
      </div>
    )
  }
}

const downloadBox = {
  image: 'fas fa-cloud-download-alt fa-7x',
  title: 'Download Hotwire Library',
  text: 'Lorem ipsum dolor sit amet, consect etur adipiscing elit. Maecenas ut felis id ex rhoncus aliquet donec efficitur quis.',
  button: 'DOWNLOAD NOW'
}

const uniqueBox = {
  image: 'fas fa-tools fa-7x',
  title: 'Build Unique Email',
  text: 'Lorem ipsum dolor sit amet, consect etur adipiscing elit. Maecenas ut felis id ex rhoncus aliquet donec efficitur quis.',
  button: 'BUILD EMAIL'
}

class Body extends Component {
  render() {
    return (
      <div className="Body">
        <Nav></Nav>
        <Main></Main>
        <Footer></Footer>
      </div>
    );
  }
}

export default Body;
