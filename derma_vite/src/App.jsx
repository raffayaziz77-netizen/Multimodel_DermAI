import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Landing from "./components/Landing"
import UploadImage from "./components/UploadImage"
import CameraScan from "./components/CameraScan"
import Questions from "./components/Questions"
import Analyzing from "./components/Analyzing"
import Result from "./components/Result"
import { predictSkin } from "./Api"


const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

function App() {
  const [step, setStep] = useState("landing")
  const [image, setImage] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)


  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ minHeight: "100vh" }}
      >
        {step === "landing" && <Landing setStep={setStep} />}

        {step === "upload" && (
          <UploadImage setImage={setImage} setStep={setStep} />
        )}

        {step === "camera" && (
          <CameraScan setImage={setImage} setStep={setStep} />
        )}

        {step === "questions" && (
          <Questions
            answers={answers}
            setAnswers={setAnswers}
            setStep={async () => {
              setStep("analyzing")
              const res = await predictSkin(image, answers)
              setResult(res)
              setStep("result")
            }}
          />
        )}

        {step === "analyzing" && (
              <Analyzing />
            )}


        {step === "result" && (
          <Result
            image={image}
            answers={answers}
            result={result}
            setStep={setStep}
          />
        )}

      </motion.div>
    </AnimatePresence>
  )
}

export default App
