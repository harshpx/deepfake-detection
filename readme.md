# Deepfake Detection

## To run this project locally:
### Pre requisites: Python(>=3.10), Node.js(>=18.19), NPM(>=9.2)

```
# clone this repository
git clone https://github.com/harshpx/deepfake-detection.git
cd deepfake-detection

# setup python virtual environment and install dependencies
python3 -m venv ./venv
source ./venv/bin/activate
pip install -r requirements.txt

# install frontend dependencies (inside cilent directory)
cd client
npm install

# Now all the required dependencies are installed!
# Go to parent directory (where app.py is located) and run the FastAPI server using:
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Now our FastAPI server must be running on localhost:8000 (make sure that your post 8000 is free before running previous command)

# create another terminal and go to client directory (where package.json is located) and run the React App using:
npm run dev

# Now our React App must be running on localhost:5173 (or on any port >5173 if it is not free)
```