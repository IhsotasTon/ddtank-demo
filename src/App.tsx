import React, { useEffect, useState } from 'react';
import './App.css';
import styled from 'styled-components/macro'
import { Pagination } from '@mui/material'
import {Stage,Layer,Image} from 'react-konva'
import useImage from 'use-image';
import path from 'path';
const BodyWrapper = styled.div`/Users/abc/metasoga/ddtank-demo/src/assets/ddtank/glass
  position:relative;
  width:250px;
  height:312px;
`
class URLImage extends React.Component {
  state = {
    image: undefined
  };
  image: any;
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps: { src: any; }) {
    // if (oldProps.src !== this.props.src) {
    //   this.loadImage();
    // }
  }
  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = './assets/ddtank/face/female/eff177/1/show.png';
    this.image.addEventListener('load', this.handleLoad);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image
    });
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };
  render() {
    return (
      <Image
        image={this.state.image}
      />
    );
  }
}
function App() {
  let [clothImg, setClothImg] = useImage('')
  let [faceImage, setFaceImage] = useState(new window.Image())
  faceImage.src="./assets/ddtank/face/female/eff177/1/show.png"
  useEffect(() => { 
    faceImage.onload = () => {
      setFaceImage(faceImage)
    }
  })

  return (
    <div className="App">
      <BodyWrapper>
        <Stage width={250} height={312}>
          <Layer>
            <URLImage></URLImage>
          </Layer>
        </Stage>
       
        {/* <img src={require("./assets/ddtank/face/female/eff177/1/show.png")} style={{ position: 'absolute', top: 0, left: 0 }} alt='cloth410' onLoad={() => {
          
        }}></img>
        <img src={require("./assets/ddtank/glass/glass197/1/show.png")} style={{position:'absolute',top:0,left:0}} alt='cloth410'></img>
        <img src={require("./assets/ddtank/hair/female/hair177/1/show.png")} style={{ position: 'absolute', top: 0, left: 0 }} alt='cloth410'></img>
        <img src={require("./assets/ddtank/head/female/head462/1/show.png")} style={{position:'absolute',top:0,left:0}} alt='cloth410'></img> */}
      </BodyWrapper>
      <Pagination
        count={10}
      />
    </div>
  );
}

export default App;
