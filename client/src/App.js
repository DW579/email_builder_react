import React, { Component } from 'react';
import logo from './images/oracle_logo.png';
import './App.css';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }

// class Nav extends Component {
//   state = { data: [] }

//   componentDidMount() {
//     fetch('/data')
//       .then(res => res.json())
//       .then(data => this.setState({ data }));
//   }
//   render() {
//     return (
//       <div className="Nav">
//         <nav className="navbar navbar-expand-lg navbar-light bg-light">
//           <img src={logo} alt="Oracle" />
//         </nav>
//         <div className="Data">
//           <h1>Data</h1>
//           {this.state.data.map(data =>
//             <div key={data.id}>{data.name}</div>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

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

class Box extends Component {
  render() {
    return (
      <div className="Box col-md-4">
        <p>Lorem ipsum dolor sit amet, consect etur adipiscing elit. Maecenas ut felis id ex rhoncus aliquet donec efficitur quis.</p>
      </div>
    );
  }
}

class Main extends Component {
  render() {
    return (
      <div className="Main container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <Box></Box>
          <div className="col-md-2"></div>
          <Box></Box>
          <div className="col-md-1"></div>
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
