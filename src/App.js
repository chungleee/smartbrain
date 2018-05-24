import React, { Component } from 'react';
// import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai';
import Signin from './components/Signin/SignIn';
import Register from './components/Register/Register'

const app = new Clarifai.App({
  apiKey: 'ab76f073ec4441b89fed51acf1539c0d'
 });

// commented out for FPS reasons
// const particlesOptions = {
//     particles: {
//       number: {
//         value: 30,
//         density: {
//           enable: true,
//           value_area: 800
//         }
//       }
//     }
// }

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: [],
      route: 'signin'
    }
  }

  onInputChange = (e) => {
    this.setState({
      input: e.target.value
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions.map((region) => {
      return region.region_info.bounding_box
    })
    console.log('clarifaiFace', clarifaiFace);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    const box = clarifaiFace.map((face) => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      }
    })
    return box;
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onButtonSubmit = () => {
    this.setState({
      imageUrl: this.state.input
    })

    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then((response) => {
      return this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch((err) => {
      console.log(err);
    })
  }

  onRouteChange = (route) => {
    this.setState({route});
  }

  render() {
    return (
      <div className="App">
        {/*<Particles 
          params={particlesOptions}
          className='particles'
        />*/ /* removed Component because took too much FPS on local machine*/}
        <Navigation onRouteChange={this.onRouteChange}/>
        {
          this.state.route === 'home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}  
              />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
          : (
            this.state.route === 'signin' 
            ? <Signin onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
