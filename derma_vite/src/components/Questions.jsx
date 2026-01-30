import Layout from "./Layout"

export default function Questions({ answers, setAnswers, setStep }) {
  const handleChange = (name, value) => {
    setAnswers({
      ...answers,
      [name]: value,
    })
  }

  return (
    <Layout>
      <div>
        <h2>Medical Questions</h2>

        {/* Onset */}
        <label>When did the disease start?</label>
        <select
          value={answers.onset || "Unknown"}
          onChange={(e) => handleChange("onset", e.target.value)}
        >
          <option>a few days</option>
          <option>weeks</option>
          <option>months</option>
          <option>years</option>
          <option>Unknown</option>
        </select>

        <br /><br />

        {/* First occurrence */}
        <label>Is this the first occurrence?</label>
        <select
          value={answers.first_occurrence || "No"}
          onChange={(e) => handleChange("first_occurrence", e.target.value)}
        >
          <option>No</option>
          <option>Yes</option>
        </select>

        <br /><br />

        {/* Itchiness */}
        <label>Is there itchiness?</label>
        <select
          value={answers.itchiness || "No"}
          onChange={(e) => handleChange("itchiness", e.target.value)}
        >
          <option>No</option>
          <option>Yes</option>
        </select>

        <br /><br />

        {/* Pain */}
        <label>Is there pain?</label>
        <select
          value={answers.pain || "No"}
          onChange={(e) => handleChange("pain", e.target.value)}
        >
          <option>No</option>
          <option>Yes</option>
        </select>

        <br /><br />

        {/* Discharge */}
        <label>Is there any discharge?</label>
        <select
          value={answers.discharge || "No"}
          onChange={(e) => handleChange("discharge", e.target.value)}
        >
          <option>No</option>
          <option>Yes</option>
        </select>

        <br /><br />

        {/* Surface */}
        <label>What is the surface texture?</label>
        <select
          value={answers.surface || "Unknown"}
          onChange={(e) => handleChange("surface", e.target.value)}
        >
          <option>dry and scaly</option>
          <option>smooth</option>
          <option>raised bumps</option>
          <option>blisters</option>
          <option>pus-filled</option>
          <option>Unknown</option>
        </select>

        <br /><br />

        {/* Edges */}
        <label>How are the edges?</label>
        <select
          value={answers.edges || "Unknown"}
          onChange={(e) => handleChange("edges", e.target.value)}
        >
          <option>well-defined</option>
          <option>ill-defined</option>
          <option>Unknown</option>
        </select>

        <br /><br />

        {/* Location */}
        <label>Where is the lesion located?</label>
        <select
          value={answers.location || "Unknown"}
          onChange={(e) => handleChange("location", e.target.value)}
        >
          <option>face</option>
          <option>back</option>
          <option>neck</option>
          <option>scalp</option>
          <option>body</option>
          <option>Unknown</option>
        </select>

        <br /><br />

        {/* Symmetry */}
        <label>Is it symmetrical?</label>
        <select
          value={answers.symmetry || "No"}
          onChange={(e) => handleChange("symmetry", e.target.value)}
        >
          <option>No</option>
          <option>Yes</option>
        </select>

        <br /><br />

        {/* Color */}
        <label>What is the color?</label>
        <select
          value={answers.color || "Unknown"}
          onChange={(e) => handleChange("color", e.target.value)}
        >
          <option>red</option>
          <option>brown</option>
          <option>white</option>
          <option>pink</option>
          <option>yellow</option>
          <option>mixed</option>
          <option>Unknown</option>
        </select>

        <br /><br />

        {/* Scaling */}
        <label>Is there scaling?</label>
        <select
          value={answers.scaling || "No"}
          onChange={(e) => handleChange("scaling", e.target.value)}
        >
          <option>No</option>
          <option>Yes</option>
        </select>

        <br /><br />

        <button onClick={setStep}>
          Get Diagnosis
        </button>
      </div>
    </Layout>
  )
}
