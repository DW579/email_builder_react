import React, { Component } from 'react';
import logo from './images/oracle_logo.png';
import loadingIcon from './images/loading.gif';
import './App.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import JSZipUtils from 'jszip-utils';

const zip = new JSZip();

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

// function Button(props) {
//   return <button type="button" className="btn btn-danger redBtn" onClick={Lightbox}>{props.button}</button>;
// }

class Date extends Component {
  state = { 
    date: [],
    displayOn: true,
    closeButton: false
  }

  // Once endpoint '/date' on server has finished it's GET calls by comparing dates and downloading mod library from GitHub, then turn off progress bar here on frontend
  componentDidMount() {
    fetch('/date')
      .then(res => res.json())
      .then(date => {
        this.setState({ displayOn: false })
        this.setState({ date })
      })
  }

  render() {
    return (
      <div>
        <p className="date">LAST UPDATED {this.state.date}</p>
        <div className="modal" style={{display: this.state.displayOn ? 'block' : 'none'}}>
          <div className="modalBox container">
            <div className="row" style={{display: this.state.closeButton ? 'block' : 'none'}}>
              <div className="col-sm"></div>
              <div className="col-sm"></div>
              <div className="col-sm">
                <div className="close" onClick={this.handleClick}>&times;</div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
              </div>
              <div className="col-sm">
                <img src={loadingIcon} alt="" />
              </div>
              <div className="col-sm">
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
              </div>
              <div className="col-sm">
                <h1 className="title">Checking to see if Library is up to date</h1>
                <p className="text">Lorem ipsum dolor sit amet, consect etur adipiscing elit. Maecenas ut felis id ex rhoncus aliquet donec efficitur quis.</p>
              </div>
              <div className="col-sm">
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
    this.setState(state => ({
      displayOn: !state.displayOn
    }));
    zip.file("library_html", "whole_mod_library/library_bottom.html");
    console.log(zip.files.library_html._data)
    // zip.generateAsync({type:"blob"}).then(function(content) {
    //   // see FileSaver.js
    //   saveAs(content, "example.zip");
    // });
  }

  render() {
    return (
      <div className="Lightbox">
        <button type="button" className="btn btn-danger redBtn" onClick={this.handleClick}>
          DOWNLOAD NOW
        </button>
        <div className="modal" style={{display: this.state.displayOn ? 'none' : 'block'}}>
          <div className="modalBox container">
            <div className="row">
              <div className="col-sm"></div>
              <div className="col-sm"></div>
              <div className="col-sm">
                <div className="close" onClick={this.handleClick}>&times;</div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
              </div>
              <div className="col-sm">
                <img src={loadingIcon} alt="" />
              </div>
              <div className="col-sm">
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
              </div>
              <div className="col-sm">
                <h1 className="title">Download In Progress</h1>
                <p className="text">Lorem ipsum dolor sit amet, consect etur adipiscing elit. Maecenas ut felis id ex rhoncus aliquet donec efficitur quis.</p>
              </div>
              <div className="col-sm">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Box(props) {
  return(
    <div>
      <Image image={props.image}></Image>
      <Title title={props.title}></Title>
      <Text text={props.text}></Text>
      {/* <Button button={props.button}></Button> */}
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
          <div className="Box col-lg-4">
            <Box 
              image={downloadBox.image} 
              title={downloadBox.title} 
              text={downloadBox.text} 
              button={downloadBox.button}
            ></Box>
            <Date></Date>
          </div>
          
          <div className="col-lg-2"></div>
          <div className="Box col-lg-4">
            <Box 
              image={uniqueBox.image} 
              title={uniqueBox.title} 
              text={uniqueBox.text} 
              button={uniqueBox.button}
            ></Box>
          </div>
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
