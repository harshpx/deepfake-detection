import cv2
import numpy as np
import tensorflow as tf
# from tensorflow.keras.preprocessing.image import img_to_array, load_img
# from tensorflow.keras.utils import array_to_img

model = tf.keras.models.load_model('./models/deepfake.keras')

def crop_face(img_arr):
    img_arr = cv2.cvtColor(img_arr,cv2.COLOR_BGR2RGB)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(img_arr, scaleFactor=1.1, minNeighbors=5, minSize=(30,30))

    if len(faces)>0:
        x, y, w, h = faces[0]

        margin = 200
        x_margin = max(0, x - margin)
        y_margin = max(0, y - margin)
        w_margin = min(img_arr.shape[1], w + 2 * margin)
        h_margin = min(img_arr.shape[0], h + 2 * margin)
        
        cropped_face = img_arr[y_margin:y_margin+h_margin, x_margin:x_margin+w_margin]
        cropped_face = cv2.resize(cropped_face,(128,128)) / 255.0
        return cropped_face
    
    return -1

def image_classifier(img_path):
    img_arr = cv2.imread(img_path)
    face = crop_face(img_arr)
    if not isinstance(face, np.ndarray):
        return -1
    input = np.expand_dims(face,axis=0)
    pred = model.predict(input)
    res = np.argmax(pred)
    return int(res)

def video_classifier(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Unable to open video")

    input = []
    count = 0
    noFrame = 0
    fakeFrame = 0
    realFrame = 0
    
    while cap.isOpened():
        ret,frame = cap.read()

        if not ret:
            break;

        count+=1
        if(not count%3==0):
            continue;
        
        face = crop_face(frame)

        if not isinstance(face,np.ndarray):
            noFrame+=1
            continue;

        input.append(face)

    cap.release()

    if len(input)==0 :
        return -1
    
    input = np.array(input)
    pred = model.predict(input)
    results = np.array([np.argmax(p) for p in pred])
    for p in results:
        if p==0:
            realFrame+=1
        else:
            fakeFrame+=1
    
    if(noFrame > 0.75*(fakeFrame + realFrame)):
        return -1
    elif(realFrame > fakeFrame):
        return 0
    
    return 1



