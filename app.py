from flask import Flask,jsonify,request
import base64
import cv2
import numpy as np
from deepface import DeepFace # type: ignore

app = Flask(__name__)
app.url_map.strict_slashes = False

@app.route("/")
def home():
    return "<h1>Emotion Detection App</h1>"

@app.route("/process",methods=['POST'])
def process_img():
    file=request.form.get("image")
    # img=Image.open(file)
    im_bytes = base64.b64decode(file)
    im_arr = np.frombuffer(im_bytes, dtype=np.uint8)  # im_arr is one-dim Numpy array
    img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)

    # b64_bytes = base64.b64encode(img)
    # b64_string = b64_bytes.decode()
    # opencvImage = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    # fnam = "opencv image.png"
    # full_image=cv2.imwrite(fnam, opencvImage)
    # full_image=cv2.imread(io.BytesIO(base64.b64decode(file)))
    prediction=DeepFace.analyze(img,actions = ['emotion'])
    return jsonify({'emotion':prediction[0]['dominant_emotion']})

app.run(host="0.0.0.0",debug=True)
