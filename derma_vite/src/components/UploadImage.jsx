import Layout from "./Layout"

export default function UploadImage({ setImage, setStep }) {
  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setStep("questions")
    }
  }

  return (
    <Layout>
      <h2>Upload Image</h2>
      <p>Please upload a clear image of the affected area</p>

      <input type="file" accept="image/*" onChange={handleUpload} />
    </Layout>
  )
}
