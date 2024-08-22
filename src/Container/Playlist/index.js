import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsArrowLeftCircle, BsPlay, BsStop } from "react-icons/bs";
import { BiDownArrowAlt } from "react-icons/bi";
import './index.css';

export default function Playlist() {
  const [playlist, setPlaylist] = useState([]);
  const location = useLocation();
  const [resultlen, setResultlen] = useState(20);
  const [url, setUrl] = useState("");
  const [mediaType, setMediaType] = useState("video");
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const languages = [
    { code: "english", name: "English" },
    { code: "hindi", name: "Hindi" },
    { code: "tamil", name: "Tamil" },
    { code: "kannada", name: "Kannada" }
  ];

  async function fetch_playlist() {
    let query = `${location.state.emotion}%20song%20%23vevo%20${selectedLanguage}`;
    if (selectedLanguage === "english"|| selectedLanguage === "tamil" || selectedLanguage === "kannada"||selectedLanguage === "hindi") {
      query = `${location.state.emotion}%20song%20${selectedLanguage}`;
    }
    let response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${resultlen}&q=${query}&type=video&key=AIzaSyDEN9HnM5J5esIkvApw_ijoZo7GxkYJ0MM${selectedLanguage === "english" || selectedLanguage === "hindi"|| selectedLanguage === "tamil"|| selectedLanguage === "kannada" ? "&videoDuration=short" : ""}`, {
      method: "GET",
    });

    let data = await response.json();
    setResultlen(resultlen + 10);

    let temp = [];
    data.items.forEach(element => {
      temp.push({
        videoId: element.id.videoId,
        channelTitle: element.snippet.channelTitle,
        thumbnail: element.snippet.thumbnails.default.url,
        title: element.snippet.title
      });
    });
    setPlaylist(temp);
    setUrl(`https://www.youtube.com/embed/${temp[0].videoId}?autoplay=1&controls=0&modestbranding=1&showinfo=0&rel=0`);
  }

  useEffect(() => {
    fetch_playlist();
  }, [selectedLanguage]);

  const handleMediaTypeChange = (e) => {
    setMediaType(e.target.value);
  };

  const stopMedia = () => {
    setUrl("");
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setPlaylist([]); // Clear the playlist to fetch new data
  };

  return (
    <div className='bg-dark'>
      <nav className="navbar navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          <BsArrowLeftCircle className="d-inline-block align-top mx-2" size={30} />
          <span className='navbar-brand fw-bold'>Moodify</span>
        </Link>
      </nav>
      <div className="container-fluid">
        <div className="row flex-lg flex-wrap-reverse align-items-end">
          <div className="col-xl-8 col-lg-7 mt-2" style={{ padding: '0 0 0 5px' }}>
            <h2 className="text-light">Songs for {location.state.emotion}</h2>
            <div className="mb-3">
              <label className="form-check-label text-light me-3">
                <input
                  type="radio"
                  value="video"
                  checked={mediaType === "video"}
                  onChange={handleMediaTypeChange}
                  className="form-check-input"
                />
                Video
              </label>
              <label className="form-check-label text-light">
                <input
                  type="radio"
                  value="audio"
                  checked={mediaType === "audio"}
                  onChange={handleMediaTypeChange}
                  className="form-check-input"
                />
                Audio
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label text-light me-3">Choose Language:</label>
              <select
                className="form-select"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="shadow-4 table-responsive rounded-4">
              <table id="dtBasicExample" className="table table-striped align-middle mb-0 table-dark">
                <thead className="bg-light fs-5">
                  <tr>
                    <th>No.</th>
                    <th>Track</th>
                    <th>Channel</th>
                    <th>Options</th>
                  </tr>
                </thead>
                {playlist.length === 0 ? (
                  <div className="d-flex align-items-start justify-content-center text-center" style={{ height: '85vh' }}>
                    <div className="spinner-border text-light" style={{ margin: '8px' }} role="status">
                    </div>
                    <span className="sr-only fs-4">Creating Playlist...</span>
                  </div>
                ) : (
                  <tbody>
                    {playlist.map((e, index) => (
                      <tr key={e.videoId} style={{ cursor: "pointer" }} onClick={() => { setUrl(`https://www.youtube.com/embed/${e.videoId}?autoplay=1&controls=0&modestbranding=1&showinfo=0&rel=0`) }}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={e.thumbnail}
                              alt=""
                              style={{ width: "45px", height: "45px" }}
                              className="rounded-circle"
                            />
                            <div className="ms-3">
                              <p className="fw-bold mb-1">{e.title}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="fw-bold mb-1">{e.channelTitle}</p>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => { setUrl(`https://www.youtube.com/embed/${e.videoId}?autoplay=1&controls=0&modestbranding=1&showinfo=0&rel=0`) }}
                            className="btn btn-sm rounded-5 btn-outline-light btn-dark"
                          >
                            <BsPlay style={{ verticalAlign: "top" }} size={22} /> Play
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
            {resultlen < 60 && (
              <button className='btn btn-outline-light btn-dark d-flex align-items-center my-2' onClick={() => { fetch_playlist() }} style={{ margin: "0 auto" }}>
                <BiDownArrowAlt size={28} /><span className='mx-2'>Load More</span>
              </button>
            )}
          </div>
          <div className="col-xl-4 col-lg-5 mt-5 ytube me-2">
            {mediaType === "video" ? (
              <>
                <iframe
                  title="video-player"
                  width="100%"
                  height="315"
                  src={url}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <button
                  type="button"
                  onClick={stopMedia}
                  className="btn btn-sm rounded-5 btn-outline-light btn-dark mt-2"
                >
                  <BsStop style={{ verticalAlign: "top" }} size={22} /> Stop
                </button>
              </>
            ) : (
              <>
                <iframe
                  title="audio-player"
                  width="100%"
                  height="0"
                  src={url}
                  frameBorder="0"
                  allow="autoplay"
                  allowFullScreen
                  style={{ visibility: 'hidden' }}
                ></iframe>
                <button
                  type="button"
                  onClick={stopMedia}
                  className="btn btn-sm rounded-5 btn-outline-light btn-dark mt-2"
                >
                  <BsStop style={{ verticalAlign: "top" }} size={22} /> Stop
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
