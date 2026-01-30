export async function predictSkin(imageFile, answers) {
  const formData = new FormData()
  formData.append("image", imageFile)
  formData.append("context", JSON.stringify(answers))

  const res = await fetch("http://localhost:8000/predict", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Prediction failed")
  }

  return res.json()
}
