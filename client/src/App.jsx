import { useState } from "react"

import { BsUpload } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { CiVideoOn } from "react-icons/ci";
import {DNA} from 'react-loader-spinner';

import useHover from "./hooks/useHover";


const App = () => {

	const BASEURL = 'http://localhost:8000'

	const [videoUrl,setVideoUrl] = useState('')
	const [imageUrl,setImageUrl] = useState('')
	const [selectedFile,setSelectedFile] = useState(null)
	const [result,setResult] = useState('')

	const [loading,setLoading] = useState(false)
	const [error,setError] = useState(false)

	const [isHover,hoverRef] = useHover();
	const [isHover2,hoverRef2] = useHover();


	const handleVideoUpload = (e)=>{
		const file = e.target.files[0]
		setSelectedFile(file)

    	const reader = new FileReader()
		reader.onloadend = () => {
			setVideoUrl(reader.result)
		}

		reader.readAsDataURL(file)
	}
	
	const handleImageUpload = (e)=>{
		const file = e.target.files[0]
		setSelectedFile(file)

    	const reader = new FileReader()
		reader.onloadend = () => {
			setImageUrl(reader.result)
		}

		reader.readAsDataURL(file)
	}

	const predictVideo = async () => {
		try {
			setError(false)
			setLoading(true)

			const formData = new FormData()
			formData.append('video', selectedFile)

			const postHeader = {
				method:"POST",
				body:formData
			}

			const res = await fetch(`${BASEURL}/predictVideo`,postHeader)
			const data = await res.json()

			setResult(data)
			setLoading(false)

		} catch (error) {
			setError(true)
			setLoading(false)
			console.log(error)
		}
	}

	const predictImage = async () => {
		try {
			setError(false)
			setLoading(true)

			const formData = new FormData()
			formData.append('image', selectedFile)

			const postHeader = {
				method:"POST",
				body:formData
			}

			const res = await fetch(`${BASEURL}/predictImage`,postHeader)
			const data = await res.json()

			setResult(data)
			setLoading(false)

		} catch (error) {
			setError(true)
			setLoading(false)
			console.log(error)
		}
	}

	const reset = ()=>{
		setVideoUrl('')
		setImageUrl('')
		setSelectedFile(null)
		setResult('')
	}

	if(loading) {
		return (
			<div className="min-h-screen min-w-full flex items-center justify-center">
				<DNA
				visible={true}
				height="200"
				width="200"
				ariaLabel="dna-loading"
				wrapperStyle={{}}
				wrapperClass="dna-wrapper"
				/>
			</div>
		)
	}

	return (
		<div className="min-h-screen min-w-full flex flex-col gap-3 items-center justify-center">

			<div className="text-2xl sm:text-4xl text-center absolute top-10 inset-x-0">Deepfake Detection</div>
			
			{!videoUrl && !imageUrl ? <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
				<div className="size-52">
					<label ref={hoverRef} className="flex flex-col-reverse items-center justify-center gap-3 size-52 rounded-xl p-3 border-2 border-black/70 border-dashed cursor-pointer hover:scale-105 duration-150">
						<div className="text-center text-3xl">Upload Video</div>
						<div>
							{!isHover ? <CiVideoOn size={70}/> : <BsUpload size={70}/>}
						</div>
						<input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden"/>
					</label>
				</div>

				<div className="size-52">
					<label ref={hoverRef2} className="flex flex-col-reverse items-center justify-center gap-3 size-52 rounded-xl p-3 border-2 border-black/70 border-dashed cursor-pointer hover:scale-105 duration-150">
						<div className="text-center text-3xl">Upload Image</div>
						<div>
							{!isHover2 ? <CiImageOn size={70}/> : <BsUpload size={70}/>}
							{/* <MdOutlineCloudUpload size={70}/> */}
						</div>
						<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
					</label>
				</div>
			</div> : 
			<div className="hidden">
				<div ref={hoverRef}/>
				<div ref={hoverRef2}/>
			</div>}
			
			{videoUrl && (
				<div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2 mt-32">
					<video controls className="rounded-2xl">label
						<source src={videoUrl} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				</div>
			)}

			{imageUrl && (
				<div className="w-11/12 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2 mt-32">
					<img src={imageUrl} alt="" className="rounded-2xl"/>
				</div>
			)}

			{result && (
				result.result==0 ? <div>Prediction Result: Real</div> : 
				(result.result==1 ? <div>Prediction Result: Fake</div> : <div>Prediction Result: No face Detected</div>)
			)}

			<div className="flex items-center justify-center gap-2">
				{videoUrl || imageUrl ? <button onClick={reset} className="rounded-xl p-3 border-2 border-black/70 border-dashed hover:scale-105 duration-150">Try another</button> : null}

				{videoUrl && !result ? <button onClick={predictVideo} className="rounded-xl p-3 border-2 border-black/70 border-dashed hover:scale-105 duration-150">Predict Video!</button> : null}

				{imageUrl && !result ? <button onClick={predictImage} className="rounded-xl p-3 border-2 border-black/70 border-dashed hover:scale-105 duration-150">Predict image!</button> : null}
			</div>

			
			
		</div>
	)
}

export default App;