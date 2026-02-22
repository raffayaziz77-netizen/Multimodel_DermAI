export async function predictSkin(imageFile, answers) {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "https://derma-backend-ey7y.onrender.com").replace(/\/+$/, "")

  const formData = new FormData()
  formData.append("image", imageFile)
  formData.append("context", JSON.stringify(answers))

  const res = await fetch(`${apiBaseUrl}/predict`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Prediction failed")
  }

  return res.json()
}
