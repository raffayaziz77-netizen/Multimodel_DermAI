import Layout from "./Layout"

export default function Landing({ setStep }) {
  return (
    <Layout>
      <h1>DermAI</h1>
      <p>Select how you want to proceed</p>

      <div className="button-group">
        <button onClick={() => setStep("upload")}>
          Upload picture
        </button>

        <button onClick={() => setStep("camera")}>
          Scan face live
        </button>
      </div>
    </Layout>
  )
}
