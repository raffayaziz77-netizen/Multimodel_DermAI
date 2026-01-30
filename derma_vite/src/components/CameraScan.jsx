import { useEffect, useRef } from "react"
import Layout from "./Layout"

export default function CameraScan({ setImage, setStep }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream
      })
  }, [])

  const capture = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d").drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      const file = new File([blob], "camera.png", { type: "image/png" })
      setImage(file)             // ✅ real File
      setStep("questions")
    })
  }


  return (
    <Layout>
      <div>
      <h2>Live Scan</h2>
      <video ref={videoRef} autoPlay />
      <br />
      <button onClick={capture}>Capture</button>
      <canvas ref={canvasRef} hidden />
    </div>
    </Layout>
    
  )
}
