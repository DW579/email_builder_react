import React, { Component } from 'react';
import logo from './images/oracle_logo.png';
import loadingIcon from './images/loading.gif';
import './App.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
// import JSZipUtils from 'jszip-utils';

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

class DragDropImage extends Component {
  state = {
    mods: [],
    mods_used: [],
    mod_count: 0,
    displayOn: true,
    icon: true,
    closeOn: true
  };

  // Close lightbox
  lightBoxClose() {
    this.setState(state => ({
      displayOn: !state.displayOn,
      icon: !state.icon,
      closeOn: !state.closeOn
    }));
  }

  // Fetching all mod file names from server
  componentDidMount() {
    fetch('/mod_names')
      .then(res => res.json())
      .then(data => {
        this.setState(state => ({
          mods: data
        }));
      })
  }

  addMod(ev) {
    const modCard = document.createElement("div");
    const cardTitle = document.createElement("div");
    const clearButton = document.createElement("button");
    const image = document.createElement("img");
    const notFound = document.createElement("div");
    const modUsedImageDiv = document.createElement("div");
    const modUsedImage = document.createElement("img");
    const cardId = ev.target.id + "_" + this.state.mod_count;
    const imageId = ev.target.id + "_" + this.state.mod_count + "_img";
    const selectedMod = {
      "name": ev.target.id
    }
    let imageData = "data:image/png;base64,";

    // Fetch preview image data
    fetch('/preview_image', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(selectedMod)
    })
      .then(res => res.json())
      .then(data => {
        imageData += data.image;

        if(data.image !== false) {
          // Set attributes on preview image
          image.setAttribute("src", imageData);
          image.setAttribute("id", imageId);

          // Append preview images
          document.getElementById("emailPreview").appendChild(image);
        }
        else {
          // Set attributes to div not found
          notFound.setAttribute("id", imageId);
          notFound.innerText = "Image not found";

          // Append to emailPreview
          document.getElementById("emailPreview").appendChild(notFound);
        }

        
      })

    // Set attributes on modCard
    modCard.setAttribute("class", "ui-state-default modsBox");
    modCard.setAttribute("id", cardId);

    // Set attributes on modUsedImageDiv and modUsedImage
    modUsedImageDiv.setAttribute("class", "thumbImg");
    modUsedImage.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAyCAIAAACPlC9VAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTQ5RDExQTE1RkQ3MTFFOUIxOEU5ODE4OEY4QjQ5ODIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTQ5RDExQTI1RkQ3MTFFOUIxOEU5ODE4OEY4QjQ5ODIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNDlEMTE5RjVGRDcxMUU5QjE4RTk4MTg4RjhCNDk4MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNDlEMTFBMDVGRDcxMUU5QjE4RTk4MTg4RjhCNDk4MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PliUku4AABQ9SURBVHja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");
    modUsedImage.setAttribute("alt", "modsUsedImage");
    modUsedImageDiv.appendChild(modUsedImage);


    // Set attributes on cardTitle
    cardTitle.setAttribute("class", "modsName");
    cardTitle.innerHTML = ev.target.id;
    
    // Set attributes on clearButton
    clearButton.innerHTML = "x";
    clearButton.setAttribute("class", "clearButton");
    clearButton.setAttribute("onclick", "clearCard(this.parentElement.id)");
    

    // Append elements to modCard
    modCard.appendChild(modUsedImageDiv);
    modCard.appendChild(cardTitle);
    modCard.appendChild(clearButton);

    document.getElementById("modsUsed").appendChild(modCard);

    this.setState(state => ({
      mod_count: state.mod_count + 1
    }));
  
  }

  resetMods() {
    const parentNodeModsUsed = document.getElementById("modsUsed");
    const parentNodeEmailPreview = document.getElementById("emailPreview");

    // Delete all mods selected in modsUsed div
    while(parentNodeModsUsed.firstChild) {
      parentNodeModsUsed.removeChild(parentNodeModsUsed.firstChild);
    }

    // Delete all preview images in emailPreview div
    while(parentNodeEmailPreview.firstChild) {
      parentNodeEmailPreview.removeChild(parentNodeEmailPreview.firstChild);
    }
  }

  downloadEmail() {
    const parentNode = document.getElementById("modsUsed");
    let arrModsUsed = [];

    // Turn on light box
    this.setState(state => ({
      displayOn: !state.displayOn,
    }));

    // Push mod titles into arrModsUsed that will be passed to the server
    for(let i = 0; i < parentNode.children.length; i++) {
      arrModsUsed.push(parentNode.children[i].children[0].innerHTML);
    }

    fetch('/download_unique_email', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(arrModsUsed)
    })
      .then(res => res.json())
      .then(data => {
        // Add unique_email content to the zip.file blob
        zip.file("unique_email.html", data["email"]);

        // Adding images content to zip.file blob
        for(let imageName in data["images"]) {
          zip.file("images/" + imageName, data["images"][imageName], {base64: true});
        }

        // Show Success on lightbox
        this.setState(state => ({
          icon: !state.icon,
          closeOn: !state.closeOn
        }));

        // Download zip of all the files found in the zip.file blob
        zip.generateAsync({type:"blob"}).then(function(content) {
          // see FileSaver.js
          saveAs(content, "unique_email.zip");
        });

      });
  }

  render() {
    return (
      <div className="DragDropImage">
        <div className="row">
          <div className="col-lg-3">
            <div class="modsTitleDiv" align="center">
              <div class="modsTitle">MODULES</div>
            </div>
            <div id="mods">
              {this.state.mods.map(mods => (
                  <div 
                    key={mods}
                    className="modsBox" 
                  >
                    <div className="thumbImg">
                      <img alt="modImage" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAyCAIAAACPlC9VAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTQ5RDExQTE1RkQ3MTFFOUIxOEU5ODE4OEY4QjQ5ODIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTQ5RDExQTI1RkQ3MTFFOUIxOEU5ODE4OEY4QjQ5ODIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNDlEMTE5RjVGRDcxMUU5QjE4RTk4MTg4RjhCNDk4MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNDlEMTFBMDVGRDcxMUU5QjE4RTk4MTg4RjhCNDk4MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PliUku4AABQ9SURBVHja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"></img>
                    </div>
                    <div className="modsName">
                      {mods}
                    </div>
                    <button id={mods} className="modsAdd" onClick={ev => this.addMod(ev)}>
                      Add
                    </button>
                  </div>
              ))}
            </div>
          </div>
          <div className="col-lg-3">
            <div class="modsTitleDiv" align="center">
              <div class="modsTitle">MODULES USED</div>
            </div>
            <div id="modsUsed"></div>
          </div>
          <div className="col-lg-6">
            <div class="previewTitleDiv" align="center">
              <div class="modsTitle">EMAIL PREVIEW</div>
            </div>
            <div id="emailPreview" align="center"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
          <button id="uniqueReset" onClick={ev => this.resetMods(ev)}>RESET</button>
          <button id="uniqueDownload" onClick={ev => this.downloadEmail(ev)}>DOWNLOAD</button>
          </div>
        </div>
        <div className="modal" style={{display: this.state.displayOn ? 'none' : 'block'}}>
          <div className="modalBox container">
            <div className="row">
              <div className="col-sm"></div>
              <div className="col-sm"></div>
              <div className="col-sm">
                <div className="close" style={{display: this.state.closeOn ? 'none' : 'block'}} onClick={ev => this.lightBoxClose()}>&times;</div>
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
      
    )
  }
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
          <DragDropImage></DragDropImage>
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
