from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import features

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def home():
    return JSONResponse(content='API is running')

@app.post("/predictVideo")
async def predict_video(video: UploadFile = File(...)):

    try:
        video_path = "video.mp4"
        content = await video.read()
        with open(video_path, "wb") as video_file:
            video_file.write(content)

        prediction = features.video_classifier(video_path)
        return JSONResponse(content={'result':prediction})
    
    except:
        return JSONResponse(content={"message":"Error in reading Video Data"})
    

@app.post("/predictImage")
async def predict_image(image: UploadFile = File(...)):

    try:
        image_path = 'image.jpg'
        content = await image.read()
        with open(image_path, "wb") as video_file:
            video_file.write(content)
        
        prediction = features.image_classifier(image_path)
        return JSONResponse(content={'result':prediction})

    except:
        return JSONResponse(content={"message":"Error in reading Image Data"})


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=4000)