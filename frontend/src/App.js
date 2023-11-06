import logo from './logo.svg';
import './App.css';
import PlaylistContainer from './PlaylistContainer';
import { useState } from 'react';
import NavBar from './Components/NavBar';
import styled from 'styled-components';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import YoutubeDL from "./Components/YoutubeDL"

function App() {
  
  return (
  
    <BrowserRouter>
      <PaddedContent>
        <MainContent>
          <NavBar/>
          
          <Routes path="/">
            
            <Route index element = {<p>home</p>}/>
            <Route path='youtube-dl' element={<YoutubeDL/>}/>
            <Route path = "playlist" element={<PlaylistContainer/>}/>
            <Route path="*" element = {<NoMatch />} />
          </Routes>
          
          </MainContent>
      </PaddedContent>
    </BrowserRouter>
  
  );
}

function NoMatch(){
  return(
    <h1>404 not found</h1>
  )
}

function SpecialButton(){
  const [counter, setCounter] = useState(0)
  const increment = ()=>{
    setCounter(prev => (prev+1));
  }
  return (
    <button onClick={increment}>button {counter}</button>
  )
}

const PaddedContent = styled.div`
  padding: 2rem;
  padding-top: 0;
  padding-bottom: 0;
  flex: 1;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  > * {
      max-width: 1024px;
  }
`
const MainContent = styled.div`
  flex: 1;
  width: 100%;
  min-height: 420px; //this should be determined by the height of the footer image
`

export default App;
