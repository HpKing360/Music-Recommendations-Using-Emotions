import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { MdOutlineCamera } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styled from "styled-components";
import "./index.css";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(100% 225% at 100% 0%, #FF0000 0%, #000000 100%), 
              linear-gradient(236deg, #00C2FF 0%, #000000 100%), 
              linear-gradient(135deg, #CDFFEB 0%, #CDFFEB 36%, #009F9D 36%, #009F9D 60%, #07456F 60%, #07456F 67%, #0F0A3C 67%, #0F0A3C 100%);
  background-blend-mode: overlay, hard-light, normal;
`;

const WebcamContainer = styled.div`
  position: relative;
`;

const CaptureButton = styled.button`
  background-color: #dc3545; /* Bootstrap danger button color */
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1.2rem;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333; /* Darker shade of red */
  }
`;

const ToggleButton = styled.button`
  background-color: #6c757d; /* Bootstrap secondary button color */
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1.2rem;
  margin-top: 20px;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a6268; /* Darker shade of gray */
  }
`;

const UploadedImage = styled.img`
  max-width: 300px; /* Set a maximum width for the displayed image */
  max-height: 300px; /* Set a maximum height for the displayed image */
  border-radius: 8px; /* Optional: Add border-radius for a rounded look */
`;

function WebCameraCapture() {
  const [loader, setLoader] = useState(0);
  const [cameraOn, setCameraOn] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToProcess, setImageToProcess] = useState(null);
  const wedRef = useRef(null);
  const navigate = useNavigate();

  const showImage = async (imageSrc) => {
    setLoader(1);
    const encode = imageSrc || wedRef.current.getScreenshot();
    let bodyContent = new FormData();
    bodyContent.append("image", encode.replace("data:image/jpeg;base64,", ""));

    let response = await fetch("/process", {
      method: "POST",
      body: bodyContent,
    });

    let data = await response.text();
    if (response.status === 200) {
      const emotion = JSON.parse(data).emotion;
      console.log(emotion);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Face Detected - ${emotion}`,
      });
      // Voice feedback
      const utterance = new SpeechSynthesisUtterance(`Face Detected - ${emotion}`);
      speechSynthesis.speak(utterance);
      navigate("/playlist", { state: JSON.parse(data) });
    } else {
      setLoader(0);
      Swal.fire({
        icon: "error",
        title: "Oops..",
        text: "Face Not Detected. Please try again!",
      });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImageToProcess(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCamera = () => {
    setCameraOn((prevCameraOn) => !prevCameraOn);
  };

  return (
    <Container>
      <div className="text-center">
        {loader === 0 ? (
          <>
            <WebcamContainer>
              {cameraOn && (
                <Webcam
                  ref={wedRef}
                  className="rounded webcamera"
                  screenshotFormat="image/jpeg"
                />
              )}
            </WebcamContainer>
            {!cameraOn && (
              <>
                {selectedImage ? (
                  <UploadedImage src={selectedImage} alt="Uploaded" />
                ) : (
                  <label className="btn btn-primary btn-lg rounded-pill m-2">
                    Upload Image
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
                  </label>
                )}
              </>
            )}
            <br />
            <CaptureButton onClick={() => showImage(imageToProcess)}>
              <MdOutlineCamera style={{ verticalAlign: "text-bottom" }} size={30} /> Capture
            </CaptureButton>
            <ToggleButton onClick={toggleCamera}>
              {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
            </ToggleButton>
          </>
        ) : (
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </Container>
  );
}

export default WebCameraCapture;
