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
            {/* <div className="row" style={{display: this.state.closeButton ? 'block' : 'none'}}>
              <div className="col-sm"></div>
              <div className="col-sm"></div>
              <div className="col-sm">
                <div className="close" onClick={this.handleClick}>&times;</div>
              </div>
            </div> */}
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

class LibraryButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayOn: true,
      closeOn: true,
      icon: true
    };
    this.downloadLibrary = this.downloadLibrary.bind(this);
    this.lightBoxClose = this.lightBoxClose.bind(this);
  }

  lightBoxClose() {
    this.setState(state => ({
      displayOn: !state.displayOn,
      icon: !state.icon,
      closeOn: !state.closeOn
    }));
  }

  // Function for downloading whole Mod Library
  downloadLibrary() {
    this.setState(state => ({
      displayOn: !state.displayOn,
    }));

    fetch('/download_library')
      .then(res => res.json())
      .then(data => {
        const loadFilesFunction = function(folderName) {
          return new Promise(function(resolve, reject) {
            for(let title in data[folderName]) {
              const name = folderName + "/" + title;
              if(folderName === "mods/images") {
                zip.file(name, data[folderName][title], {base64: true});
              }
              else {
                zip.file(name, data[folderName][title]);
              }
            }
            resolve();
          })
        }

        for(let folder in data) {
          loadFilesFunction(folder).then(function() {
            return;
          })
        }

        zip.generateAsync({type:"blob"}).then(function(content) {
          // see FileSaver.js
          saveAs(content, "hotwire_mod_library.zip");
        });

        // Show close button in lightbox
        this.setState(state => ({
          closeOn: !state.closeOn,
          icon: !state.icon
        }));
      })
  }

  render() {
    return (
      <div className="Button">
        <button type="button" className="btn btn-danger redBtn" onClick={this.downloadLibrary}>{this.props.button}</button>
        <div className="modal" style={{display: this.state.displayOn ? 'none' : 'block'}}>
          <div className="modalBox container">
            <div className="row">
              <div className="col-sm"></div>
              <div className="col-sm"></div>
              <div className="col-sm">
                <div className="close" style={{display: this.state.closeOn ? 'none' : 'block'}} onClick={this.lightBoxClose}>&times;</div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
              </div>
              <div className="col-sm" align="center">
                <img src={loadingIcon} style={{display: this.state.icon ? 'block' : 'none'}} alt="" />
                <i className="far fa-check-circle fa-7x" style={{display: this.state.icon ? 'none' : 'block'}}></i>
              </div>
              <div className="col-sm">
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
              </div>
              <div className="col-sm" align="center">
                <h1 className="title" style={{display: this.state.icon ? 'block' : 'none'}}>Download In Progress</h1>
                <h1 className="title" style={{display: this.state.icon ? 'none' : 'block'}}>Success! Your download is ready.</h1>
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
    </div>
  );
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayOn: true,
      closeOn: true,
      icon: true,
      downloadLibraryPage: true
    };
    this.uniqueEmail = this.uniqueEmail.bind(this);
  }

  uniqueEmail() {
    this.setState(state => ({
      downloadLibraryPage: !state.downloadLibraryPage,
    }));
  }

  render() {
    return (
      <div className="Main">
        <div className="container-fluid downloadLibraryPage" style={{display: this.state.downloadLibraryPage ? 'block' : 'none'}}>
          <div className="row">
            <div className="col-lg-1"></div>
            <div className="Box col-lg-4">
              <Box 
                image={downloadBox.image} 
                title={downloadBox.title} 
                text={downloadBox.text}
              ></Box>
              <LibraryButton button={downloadBox.button}></LibraryButton>
              <Date></Date>
            </div>
            
            <div className="col-lg-2"></div>
            <div className="Box col-lg-4">
              <Box 
                image={uniqueBox.image} 
                title={uniqueBox.title} 
                text={uniqueBox.text}
              ></Box>
              <button type="button" className="btn btn-danger redBtn" onClick={this.uniqueEmail}>BUILD EMAIL</button>
            </div>
            <div className="col-lg-1"></div>
          </div>
        </div>
        <div className="container-fluid" style={{display: this.state.downloadLibraryPage ? 'none' : 'block'}}>
          <div className="row">
            <div className="col-lg-1">
              <button type="button" onClick={this.uniqueEmail}>Back</button>
            </div>
          </div>
          <div className="row" align="center">
            <div className="col-lg-4"></div>
            <div className="col-lg-4">
              <h3 id="uniqueTitle">Build Unique Email</h3>
            </div>
            <div className="col-lg-4"></div>
          </div>
          <div className="row" align="center">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <p id="uniqueText">Click and drag the preferred modules in your desired order.</p>
          </div>
          <div className="col-lg-3"></div>
          </div>
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
