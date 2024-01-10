from flask import Flask, Response, render_template
import json

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recommend_movies', methods = ['GET', 'POST'])    
def recommend_movies():
    from keras.models import load_model
    import statistics as st
    from time import sleep
    from keras.preprocessing.image import img_to_array
    import cv2
    import numpy as np

    face_classifier = cv2.CascadeClassifier(r'haarcascade_frontalface_default.xml')
    classifier = load_model(r'model.h5')
    output = []
    emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

    cap = cv2.VideoCapture(0)
    frames_with_faces = 0
    frames_without_faces = 0
    total_frames = 0

    while frames_with_faces + frames_without_faces < 30 and total_frames < 100:
        _, frame = cap.read()
        labels = []
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray)

        if len(faces) == 0:
            output.append('No Faces')
            cv2.putText(frame, 'No Faces', (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            frames_without_faces += 1
        else:
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 255), 2)
                roi_gray = gray[y:y + h, x:x + w]
                roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)

                if np.sum([roi_gray]) != 0:
                    roi = roi_gray.astype('float') / 255.0
                    roi = img_to_array(roi)
                    roi = np.expand_dims(roi, axis=0)

                    prediction = classifier.predict(roi)[0]
                    label = emotion_labels[prediction.argmax()]
                    label_position = (x, y)
                    output.append(label)
                    cv2.putText(frame, label, label_position, cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    frames_with_faces += 1

        total_frames += 1
        cv2.imshow('Emotion Detector', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    print("Frames with Faces: ", frames_with_faces)
    print("Frames without Faces: ", frames_without_faces)
    print(output)

    cap.release()
    cv2.destroyAllWindows()
    final_output1 = st.mode(output)
    print(final_output1)

    response_data = {'emotion': final_output1}

    # Convert the Python dictionary to a JSON string manually
    response_json = json.dumps(response_data)

    # Create a Flask Response object with the JSON data and set the content type
    response = Response(response_json, content_type='application/json')

    return response    

if __name__ == '__main__':
    app.run()


