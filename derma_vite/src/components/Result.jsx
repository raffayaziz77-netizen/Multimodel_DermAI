import Layout from "./Layout"

export default function Result({ image, answers, result, setStep }) {
  return (
    <Layout>
      <h2>Diagnosis Result</h2>

      {image ? (
        <img
          src={image}
          alt="Skin"
          width="300"
          style={{ marginBottom: "20px", borderRadius: "12px" }}
          onError={(e) => {
            e.target.style.display = "none"
          }}
        />
      ) : null}

      <h3>Diagnosis</h3>
      <p>Possible condition: {result.prediction}</p>
      <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>


      <h3>Prescription</h3>
      <ul>
        <li>Salicylic Acid Cleanser</li>
        <li>Topical Retinoid (night)</li>
        <li>SPF 50 Sunscreen</li>
      </ul>

      {/* <h3>User Answers</h3>
      <pre>{JSON.stringify(answers, null, 2)}</pre> */}

      <div style={{ marginTop: "40px" }}>
        <button onClick={() => setStep("landing")}>
          Start New Diagnosis
        </button>
      </div>
    </Layout>
  )
}
