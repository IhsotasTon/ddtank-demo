import React, { useState } from 'react';
import './App.css';
import styled from 'styled-components/macro'
import { Pagination } from '@mui/material'
import {Stage,Layer,Image} from 'react-konva'
import useImage from 'use-image';
import path from 'path';
const baseUrl = 'https://raw.githubusercontent.com/IhsotasTon/ddtank-demo/master/src/assets/ddtank/'
const getRealUrl = (path:string):string => {
  return decodeURI(baseUrl + path) ;
}
const BodyWrapper = styled.div`/Users/abc/metasoga/ddtank-demo/src/assets/ddtank/glass
  position:relative;
  width:250px;
  height:312px;
`
const RealImage = function (props:{url:string}) {
  let [realImg] =useImage(getRealUrl(props.url))
  return <Image image={realImg} width={250} height={312} x={0} y={0} />
}
function App() {
  return (
    <div className="App">
      <BodyWrapper>
        <Stage width={250} height={312}>
          <Layer>
            <RealImage url={'emoji/female/face130/1/show.png'}></RealImage>
            <RealImage url={'face/female/eff177/1/show.png'}></RealImage>
            <RealImage url={'glass/glass197/1/show.png'}></RealImage>
            <RealImage url={'hair/female/hair177/1/show.png'}></RealImage>
            <RealImage url={'head/female/head462/1/show.png'}></RealImage>
            <RealImage url={'cloth/female/cloth410/1/show.png'}></RealImage>
          </Layer>
        </Stage>
      </BodyWrapper>
      <Pagination
        count={10}
      />
    </div>
  );
}

export default App;
