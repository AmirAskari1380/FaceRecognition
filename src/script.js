const video = document.getElementById('video');

// Load all different models
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/src/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/src/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/src/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/src/models')

]).then(startVideo)

// Function for getting the webcam and set it to the video tag
function startVideo() {
    // Get the webcam
    navigator.getUserMedia(
        { video: {} },  
        stream => video.srcObject = stream,
        err => console.log("Error has been ocured ",err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);
    // console.log("Aedfs");
    setInterval(async () => {                                                   // Should use the landmarks or not, Should use the expressions or not 
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        // console.log(detections);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        // Showing the landmarks(lines that detects the eye, nose, eyebrows etc)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        // Showing the face expressions(like surprised, angry and so on)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100);
});

// Showing the face detection details, with the 'canvas'
