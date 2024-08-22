import React from "react";
import "./index.css";
import img1 from "../../assets/images/img1.png";
import { Link } from "react-router-dom";
import { IoCameraOutline } from 'react-icons/io5';
import Particle from "../../components/Particle";

const HomeContainer = () => {
    return (
        <>
            <div className="d-flex align-items-center" style={{ minHeight: "95vh" }}>
                <div className="particles"><Particle /></div>
                <div className="container">
                    <div className="row flex-lg align-items-center">
                        <div className={`col-xl-6 col-xxl-5 col-lg-7 mt-2`} style={{ paddingLeft: '20px' }}>
                            <h1>Moodify</h1>
                            <h2>Get your Music Playlist <br /> according to your Mood</h2>
                            <div className="button-one mt-4 pt-3">
                                <button className="Primary btn btn-dark rounded-5 d-flex align-items-center">
                                    <Link to={'/camera'} style={{ textDecoration: "none", color: "rgb(204, 214, 246)" }}>
                                        <IoCameraOutline size={28} style={{ verticalAlign: 'middle' }} />
                                        <span className="mx-2">LET'S START</span>
                                    </Link>
                                </button>
                            </div>
                            <h3>CLICK the above button to get your playlist.</h3>
                        </div>
                        {window.innerWidth > 1000 ? 
                            <div className="col-xl-6 col-xxl-7 col-lg-5 container-2">
                                <img src={img1} alt="/" />
                            </div> 
                            : ""
                        }
                    </div>
                </div>
            </div>
            <footer style={{ textAlign: 'center', padding: '1px 0', background: '#343a40', color: '#fff' }}>
                Created by Hari Prasad B & Harshini Prakasham
            </footer>
        </>
    );
}

export default HomeContainer;
