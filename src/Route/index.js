import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WebcamCapture from "../Container/Camera";
import HomeContainer from '../Container/Home';
import Playlist from "../Container/Playlist";

const RouterComponent = ()=>{
    return (
       <>
        <BrowserRouter>
       
        <Routes>

          <Route path="/" element={<HomeContainer/>} />
          <Route path="/playlist" element={<Playlist/>} />
          <Route path="/camera" element={<WebcamCapture/>} />
          {/* <Route path="/about" element={<AboutContainer/>} /> */}


        </Routes>
       
        </BrowserRouter>
       </>
    )
}
export default RouterComponent;