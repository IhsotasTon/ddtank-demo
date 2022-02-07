import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import styled from 'styled-components/macro'
import { Pagination,TextField } from '@mui/material'
import {Stage,Layer,Image,Text} from 'react-konva'
import useImage from 'use-image';
import Select from "react-select"
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
import RichEditer from './components/richEditer';
import maleWarriorJson from "./config/shenqu/male-warrior.json";
import maleMageJson from "./config/shenqu/male-mage.json";
import maleArcherJson from "./config/shenqu/male-archer.json";
import femaleWarriorJson from "./config/shenqu/female-warrior.json";

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
const shenquJson = {
  'male-warrior': maleWarriorJson,
  'male-mage': maleMageJson,
  'male-archer': maleArcherJson,
  'female-warrior':femaleWarriorJson
}
const baseUrl = 'https://raw.githubusercontent.com/IhsotasTon/ddtank-demo/master/src/assets/'

const getRealUrl = (path:string):string => {
  return decodeURI(baseUrl + path) ;
}
const BodyWrapper = styled.div`
  position:relative;
  width:250px;
  height:312px;
`
const ShenquWrapper = styled.div`
  position:relative;
  width:270px;
  height:406px;
`
const AppWrapper = styled.div`
  display:flex;
`
const RealImage = function (props:{url:string,isCardbg?:boolean}) {
  let [realImg] = useImage(getRealUrl('ddtank/'+props.url), 'anonymous')
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
          return <img src={getRealUrl("ddtank/"+getUrl(part,gender,v))} style={{ display: 'block', width: '100%', height: '100%'}} onClick={() => {
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



//神曲
const RealImageShenqu = function (props:{url:string,isCardbg?:boolean,job:string|undefined,isWing?:boolean}) {
  let [realImg] = useImage(getRealUrl("shenqu/" + props.url), 'anonymous')
  const isWarrior=props.job?.indexOf('warrior')!==-1
  let width = isWarrior ? 350 : 350;
  let height = isWarrior ? 400 : 400;
  let x = isWarrior&&props.isWing ? 0:0;
  let y = isWarrior&&props.isWing ? 0 : 0;
  if (!props.job) {
    x=0
  }
  return <Image image={realImg} width={width} height={height} x={x} y={y} />
}
const options = [
  { value: 'male-warrior', label: 'male-warrior' },
  { value: 'male-mage', label: 'male-mage' },
  { value: 'male-archer', label: 'male-archer' },
  // { value: 'female-warrior', label: 'female-warrior' }
]
interface ItemJson {
  wing: string
  weapon: string
    body:string
  hair: string

}
export function ItemListShenqu(props: { job: string|undefined, part: string, setUserSelected: any, userSelected: ItemJson }) {
  const { job, part, setUserSelected, userSelected } = props;
  let realData;
  realData=(shenquJson as any)[job||'male-mage']
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
          return <img src={getRealUrl(`shenqu/${job}/${v.name}/${part}.png`)} style={{ display: 'block', width: '100%', height: '100%'}} onClick={() => {
            setUserSelected({ ...userSelected, [part]: v.name })
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
const JobsJson = [
  'male-warrior',
  'male-mage',
  'male-archer',
]
function randomShenqu(num:number) :any[]{
  let arr = [];
  for (let i = 0; i < num; i++) {
    let randomJob = randFrom0ToN(3)
    let job = JobsJson[randomJob];
    let wing = (shenquJson as any)[job][randFrom0ToN((shenquJson as any)[job].length)].name
    let hair = (shenquJson as any)[job][randFrom0ToN((shenquJson as any)[job].length)].name
    let body = (shenquJson as any)[job][randFrom0ToN((shenquJson as any)[job].length)].name
    let weapon=(shenquJson as any)[job][randFrom0ToN((shenquJson as any)[job].length)].name
   arr.push({job,wing,hair,body,weapon})
  }
  return arr
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
  const { head, cloth, hair, emoji, face, glass, cardBg, cardBorder } = userSelected
  const [hasBg, setHasBg] = useState(false)
  //shenqu
  const [job, setJob] = useState<string | undefined>('male-mage')
  const [itemJson, setItemJson] = useState<ItemJson>({
    wing: 'tree-sprite',
    weapon: 'tree-sprite',
    body:'tree-sprite',
    hair: 'tree-sprite',
  })
  let [nameOptions,setNameOptions]=useState()
  let [shenquPart, setShenquPart] = useState('wing')
  let randomInputShenqu = useRef(null)
  let [randomArrShenqu,setRandomArrShenqu]=useState<any[]>()
  let handleRandomShenqu = useCallback(() => {
    setRandomArrShenqu(randomShenqu((randomInputShenqu.current as any).value))
  },[])
  return (
    <div>
    <AppWrapper>
      <BodyWrapper>
        <Stage width={250} height={312}>
            <Layer id='1'>
              <RealImage url={`cardBg/${cardBg}.png`} isCardbg></RealImage>
              <RealImage url={`cardBorder/${cardBorder}.png`} isCardbg></RealImage>
            <RealImage url={`emoji/${gender}/${emoji}/1/show.png`}></RealImage>
            
            <RealImage url={`hair/${gender}/${hair}/1/show.png`}></RealImage>
              <RealImage url={`cloth/${gender}/${cloth}/1/show.png`}></RealImage>
              <RealImage url={`face/${gender}/${face}/1/show.png`}></RealImage>
            <RealImage url={`glass/${glass}/1/show.png`}></RealImage>
            <RealImage url={`head/${gender}/${head}/1/show.png`}></RealImage>            
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
          <div>
            hasBg?
            <input type="radio" name="" value="0" checked={hasBg} onChange={(e) => {setHasBg(true)}} /><label htmlFor="yes">Yes</label>
            <input type="radio" name="" value="1" checked={!hasBg} onChange={(e) => {setHasBg(false) }} /><label htmlFor="no">No</label>
          </div>
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
        <RichEditer></RichEditer>
      </AppWrapper>
  {/* shenqu */}
    <AppWrapper style={{marginTop:"100px"}}>
      <ShenquWrapper>
        <Stage width={400} height={406}>
            <Layer id='1'>
            <RealImageShenqu url={`${job}/${itemJson.wing}/wing.png`} job={job} isWing={true}></RealImageShenqu>
           {job!=='male-archer'&&<RealImageShenqu url={`${job}/${itemJson.weapon}/weapon.png`} job={job}></RealImageShenqu>}
              <RealImageShenqu url={`${job}/${itemJson.body}/body.png`} job={job}></RealImageShenqu>
              {job==='male-archer'&&<RealImageShenqu url={`${job}/${itemJson.weapon}/weapon.png`} job={job}></RealImageShenqu>}
              <RealImageShenqu url={`${job}/${itemJson.hair}/hair.png`} job={job}></RealImageShenqu>   
          </Layer>
        </Stage>
        <SelectedGenderWp>
            <Select className={'select'} options={options} onChange={(e) => {
              setJob(e?.value)
              if (e) {
                setNameOptions((shenquJson as any)[e.value].map((item: { name: any; label: any; }) => {
                  return { value: item.name, label: item.name }
                }))
              }
            }} placeholder="male-mage" />
            <Select className={'select'} options={nameOptions} onChange={(e:any) => {
              if (e) {
                let v=e.value
                setItemJson({wing:v,body:v,hair:v,weapon:v})
              }
            }} placeholder="male-mage-christmas" />
        </SelectedGenderWp>
        <ExportBtn onClick={() => {
          exportCanvasAsPNG('export')
        }}>
          export
        </ExportBtn>
        <input ref={randomInputShenqu} type={'number'}></input>
        <button onClick={() => {
          handleRandomShenqu()
        }}>random</button>
      </ShenquWrapper>
      <RightWrapper style={{marginLeft:"120px"}}>
        <TabWrapper>
        {['wing', 'weapon', 'body', 'hair'].map(
          (item,idx) => {
            return <Tab onClick={() => {
             setShenquPart(item)
           }} key={item}>{item}</Tab>
          }
        )}
      </TabWrapper>
      <ItemListShenqu setUserSelected={setItemJson} job={job} part={shenquPart} userSelected={itemJson}></ItemListShenqu>
      </RightWrapper>
        <RichEditer></RichEditer>
      </AppWrapper>
    <div style={{display:'flex',width:'100%',flexFlow: 'wrap',marginTop:"100px"}}>
        {randomArr?.map((item) =>
          <div style={{ display:'flex',flexDirection:'column'}}>
            <Stage width={250} height={312}>
              <Layer id={item.emoji}>
                {hasBg&&<RealImage url={`cardBg/${item.cardBg}.png`} isCardbg></RealImage>} 
                {hasBg&&<RealImage url={`cardBorder/${item.cardBorder}.png`} isCardbg></RealImage>}
                <RealImage url={`emoji/${gender}/${item.emoji}/1/show.png`}></RealImage>
                
                <RealImage url={`hair/${gender}/${item.hair}/1/show.png`}></RealImage>
                <RealImage url={`cloth/${gender}/${item.cloth}/1/show.png`}></RealImage>
                <RealImage url={`face/${gender}/${item.face}/1/show.png`}></RealImage>
                <RealImage url={`glass/${item.glass}/1/show.png`}></RealImage>
                <RealImage url={`head/${gender}/${item.head}/1/show.png`}></RealImage>
              </Layer>
            </Stage>
            <div>{`${item.cloth}_${item.face}_${item.glass}_${item.hair}_${item.head}_${item.emoji}|`}</div>
          </div>
        )}
      </div>
          <div style={{display:'flex',width:'100%',flexFlow: 'wrap',marginTop:"100px"}}>
        {randomArr?.map((item) =>
          <div style={{ display:'flex',flexDirection:'column'}}>
            <Stage width={250} height={312}>
              <Layer id={item.emoji}>
                <RealImage url={`emoji/${gender}/${item.emoji}/1/show.png`}></RealImage>
                <RealImage url={`hair/${gender}/${item.hair}/1/show.png`}></RealImage>
                <RealImage url={`cloth/${gender}/${item.cloth}/1/show.png`}></RealImage>
                <RealImage url={`face/${gender}/${item.face}/1/show.png`}></RealImage>
                <RealImage url={`glass/${item.glass}/1/show.png`}></RealImage>
                <RealImage url={`head/${gender}/${item.head}/1/show.png`}></RealImage>
              </Layer>
            </Stage>
            <div>{`${item.cloth}_${item.face}_${item.glass}_${item.hair}_${item.head}_${item.emoji}|`}</div>
          </div>
        )}
        {randomArrShenqu?.map((item,id) =>
          <div style={{ display:'flex',flexDirection:'column'}}>
            <Stage width={350} height={400}>
              <Layer id={item.job+id}>
                <RealImageShenqu url={`${item.job}/${item.wing}/wing.png`} job={item.job} isWing={true}></RealImageShenqu>
               {item.job!=='male-archer'&&<RealImageShenqu url={`${item.job}/${item.weapon}/weapon.png`} job={item.job}></RealImageShenqu>} 
                <RealImageShenqu url={`${item.job}/${item.body}/body.png`} job={item.job}></RealImageShenqu>
                {item.job==='male-archer'&&<RealImageShenqu url={`${item.job}/${item.weapon}/weapon.png`} job={item.job}></RealImageShenqu>} 
                <RealImageShenqu url={`${item.job}/${item.hair}/hair.png`} job={item.job}></RealImageShenqu>   
              </Layer>
            </Stage>
            <div>{`${item.job}_${item.wing}(wing)_${item.weapon}(weapon)_${item.hair}(hair)_${item.body}(body)|`}</div>
          </div>
        )}
        
      </div>
</div>
  );
}

export default App;
