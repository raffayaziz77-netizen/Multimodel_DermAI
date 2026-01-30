import Layout from "./Layout"

export default function Analyzing() {
  return (
    <Layout>
      <h2>Analyzing Image</h2>
      <p>Please wait while our AI analyzes your skin condition</p>

      <div className="loader" />
    </Layout>
  )
}
