import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import styled from 'styled-components/macro'
import { Pagination,TextField } from '@mui/material'
import {Stage,Layer,Image,Text} from 'react-konva'
import useImage from 'use-image';

import usePagination from "./Pagination";
import { default as data } from "./data.json";
import maleHeadJson from "./config/male_head.json";
import maleClothJson from "./config/male_cloth.json";
import maleFaceJson from "./config/male_face.json";
import maleEmojiJson from "./config/male_emoji.json";
import maleHairJson from "./config/male_hair.json";
import femaleHeadJson from "./config/female_head.json";
import femaleClothJson from "./config/female_cloth.json";
import femaleFaceJson from "./config/female_face.json";
import femaleEmojiJson from "./config/female_emoji.json";
import femaleHairJson from "./config/female_hair.json";
import glassJson from "./config/glass.json";
const cardBgJson = [{
  id:1,
},{
  id:2,
},{
  id:3,
},{
  id:4,
},{
  id:5,
},{
  id:6,
},{
  id:7,
},{
  id:8,
},{
  id:9,
  },]
const cardBorderJson = [{
  id:1,
},{
  id:2,
},{
  id:3,
},{
  id:4,
},{
  id:5,
},{
  id:6,
}]
const baseUrl = 'https://raw.githubusercontent.com/IhsotasTon/ddtank-demo/master/src/assets/ddtank/'

const getRealUrl = (path:string):string => {
  return decodeURI(baseUrl + path) ;
}
const BodyWrapper = styled.div`
  position:relative;
  width:250px;
  height:312px;
`
const AppWrapper = styled.div`
  display:flex;
`
const RealImage = function (props:{url:string,isCardbg?:boolean}) {
  let [realImg] = useImage(getRealUrl(props.url), 'anonymous')
  let width = props.isCardbg ? 250 : 250;
  let height = props.isCardbg ? 312 : 312;
  let x = props.isCardbg ? 0 :15;
  let y=props.isCardbg ? 0 : -12;
  return <Image image={realImg} width={width} height={height} x={x} y={y} />
}
const ListWrapper = styled.div`
  display:grid;
  grid-template-columns: repeat(5,50px);
  grid-template-rows: repeat(4,62.4px) 62.4px;
`
interface UserSelected  {
  cloth: string
  head: string
  face: string
  emoji: string
  glass: string
  hair: string
  cardBg: string
  cardBorder:string
}
let defaultUserSelected = {
  cloth:"cloth410",
  head:"head528",
  face:"eff177",
  emoji:"face130",
  glass:"glass197",
  hair: "hair177",
  cardBg: '1',
  cardBorder:'1'
}

const dataSum = {
  male: {
    head: maleHeadJson,
    cloth: maleClothJson,
    face: maleFaceJson,
    hair: maleHairJson,
    emoji: maleEmojiJson,
    glass:glassJson
  },
  female: {
    head: femaleHeadJson,
    cloth: femaleClothJson,
    face: femaleFaceJson,
    hair: femaleHairJson,
    emoji: femaleEmojiJson,
    glass:glassJson
  },
  cardBg: {
    cardBgJson
  },
  cardBorder: {
    cardBorderJson
  }

}
function getUrl(part:string,gender:string,v:any):string {
  let url = `${part}${part === "glass" ? '' : '/' + gender}/${v.id}/1/show.png`
  if (part === 'cardBg'||part === 'cardBorder') {
    url=part+'/'+v.id+'.png'
  }
  return url
}
export function ItemList(props: { gender: string, part: string, setUserSelected: any, userSelected: UserSelected }) {
  const { gender, part, setUserSelected, userSelected } = props;
  let realData;
  switch (part) {
    case 'cardBg':
      realData=cardBgJson
      break;
    case 'cardBorder':
      realData = cardBorderJson
      break;
    default:
      realData = (dataSum as any)[gender][part]
      break;
  }
  let [page, setPage] = useState(1);
  const PER_PAGE = 24;
  const count = Math.ceil(realData.length / PER_PAGE);
  const _DATA = usePagination(realData, PER_PAGE);
  const handleChange = (e:any, p:any) => {
    setPage(p);
    _DATA.jump(p);
  };
  
  return (
    <div>
      <ListWrapper >
        {_DATA.currentData().map((v:any) => {
          return <img src={getRealUrl(getUrl(part,gender,v))} style={{ display: 'block', width: '100%', height: '100%'}} onClick={() => {
            setUserSelected({ ...userSelected, [part]: v.id })
          }} alt={v.id}></img>
        })}
      </ListWrapper>
      <Pagination
        count={count}
        size="large"
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
      />
      </div>
  );
}
const SelectedGenderWp = styled.div`
  display:flex;
`
const SelectFemale = styled.div`
  width:50px;
  height:20px;
  cursor:pointer;
`
const SelectMale = styled.div`
  width:50px;
  height:20px;
  cursor:pointer;
`
const TabWrapper = styled.div`
  display:flex;
`
const RightWrapper = styled.div`
  display:flex;
  flex-direction:column;
`
const Tab = styled.div`
  width:50px;
  height:20px;
  cursor:pointer;
`
const ExportBtn = styled.div`
  cursor:pointer;
`
function exportCanvasAsPNG(fileName: string) {
    let className='konvajs-content'
    let canvasElement = document.getElementsByClassName(className)[0].children[0];
    let MIME_TYPE = "image/png";
    let imgURL = (canvasElement as any).toDataURL(MIME_TYPE);
    let dlLink = document.createElement('a');
    dlLink.download = fileName;
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}
function randFrom0ToN(n: number):number {
 return Math.floor(Math.random()*Math.floor(n));
}
function randomHeros(gender: string, number: number): any[] {
  let rtArr = [];
  if (gender === 'female') {
      for (let i = 0; i < number; i++) {
      rtArr.push({
        emoji: femaleEmojiJson[randFrom0ToN(femaleEmojiJson.length)].id,
        face: femaleFaceJson[randFrom0ToN(femaleFaceJson.length)].id,
        glass: glassJson[randFrom0ToN(glassJson.length)].id,
        hair: femaleHairJson[randFrom0ToN(femaleHairJson.length)].id,
        head: femaleHeadJson[randFrom0ToN(femaleHeadJson.length)].id,
        cloth: femaleClothJson[randFrom0ToN(femaleClothJson.length)].id,
        cardBg: cardBgJson[randFrom0ToN(cardBgJson.length)].id,
        cardBorder: cardBorderJson[randFrom0ToN(cardBorderJson.length)].id
      })
    }
      
  } else {
    for (let i = 0; i < number; i++) {
      rtArr.push({
        emoji: maleEmojiJson[randFrom0ToN(maleEmojiJson.length)].id,
        face: maleFaceJson[randFrom0ToN(maleFaceJson.length)].id,
        glass: glassJson[randFrom0ToN(glassJson.length)].id,
        hair: maleHairJson[randFrom0ToN(maleHairJson.length)].id,
        head: maleHeadJson[randFrom0ToN(maleHeadJson.length)].id,
        cloth: maleClothJson[randFrom0ToN(maleClothJson.length)].id,
        cardBg: cardBgJson[randFrom0ToN(cardBgJson.length)].id,
        cardBorder: cardBorderJson[randFrom0ToN(cardBorderJson.length)].id
      })
    }
  }
  return rtArr;
  

}
function App() {
  let [userSelected, setUserSelected] = useState<UserSelected>(defaultUserSelected)
  let [gender, setGender] = useState('male')
  let [part, setPart] = useState('head')
  let randomInput = useRef(null)
  let [randomArr,setRandomArr]=useState<UserSelected[]>()
  let handleRandom = useCallback(() => {
    setRandomArr(randomHeros(gender,(randomInput.current as any).value))
    
  },[gender])
  
  const { head, cloth, hair, emoji, face, glass,cardBg,cardBorder } = userSelected
  return (
    <div>
    <AppWrapper>
      <BodyWrapper>
        <Stage width={250} height={312}>
            <Layer id='1'>
              <RealImage url={`cardBg/${cardBg}.png`} isCardbg></RealImage>
              <RealImage url={`cardBorder/${cardBorder}.png`} isCardbg></RealImage>
            <RealImage url={`emoji/${gender}/${emoji}/1/show.png`}></RealImage>
            <RealImage url={`face/${gender}/${face}/1/show.png`}></RealImage>
            <RealImage url={`glass/${glass}/1/show.png`}></RealImage>
            <RealImage url={`hair/${gender}/${hair}/1/show.png`}></RealImage>
            <RealImage url={`head/${gender}/${head}/1/show.png`}></RealImage>
            <RealImage url={`cloth/${gender}/${cloth}/1/show.png`}></RealImage>
            
          </Layer>
        </Stage>
        <SelectedGenderWp>
          <SelectFemale onClick={() => {
            setGender('female')
          }}>female</SelectFemale>
          <SelectMale onClick={() => {
            setGender('male')
          }}>male</SelectMale>
        </SelectedGenderWp>
        <ExportBtn onClick={() => {
          exportCanvasAsPNG('export')
        }}>
          export
        </ExportBtn>
        <input ref={randomInput} type={'number'}></input>
        <button onClick={() => {
          handleRandom()
        }}>random</button>
      </BodyWrapper>
      <RightWrapper>
        <TabWrapper>
        {['cloth', 'head', 'face', 'emoji', 'glass', 'hair','cardBg','cardBorder'].map(
          (item,idx) => {
            return <Tab onClick={() => {
             setPart(item)
           }} key={item}>{item}</Tab>
          }
        )}
      </TabWrapper>
      <ItemList setUserSelected={setUserSelected} gender={gender} part={part} userSelected={userSelected}></ItemList>
      </RightWrapper>
      </AppWrapper>
      <br></br>
    <div style={{display:'flex',width:'100%',flexFlow: 'wrap'}}>
        {randomArr?.map((item) =>
          <div style={{ display:'flex',flexDirection:'column'}}>
            <Stage width={250} height={312}>
              <Layer id={item.emoji}>
                <RealImage url={`cardBg/${item.cardBg}.png`} isCardbg></RealImage>
                <RealImage url={`cardBorder/${item.cardBorder}.png`} isCardbg></RealImage>
                <RealImage url={`emoji/${gender}/${item.emoji}/1/show.png`}></RealImage>
                <RealImage url={`face/${gender}/${item.face}/1/show.png`}></RealImage>
                <RealImage url={`glass/${item.glass}/1/show.png`}></RealImage>
                <RealImage url={`hair/${gender}/${item.hair}/1/show.png`}></RealImage>
                <RealImage url={`head/${gender}/${item.head}/1/show.png`}></RealImage>
                <RealImage url={`cloth/${gender}/${item.cloth}/1/show.png`}></RealImage>
              </Layer>
            </Stage>
            <div>{`${item.cloth}_${item.face}_${item.glass}_${item.hair}_${item.head}_${item.emoji}|`}</div>
          </div>
        )}
      </div>
</div>
  );
}

export default App;
