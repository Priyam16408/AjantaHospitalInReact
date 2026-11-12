

import React, { useEffect, useRef, useState } from 'react'

const useSpeechRecognition = (options) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef(null)

  useEffect(() => {
      if(!("webkitSpeechRecognition" in window)){
        console.log("Nhi chala");
        return 
      }

      recognitionRef.current = new window.webkitSpeechRecognition()
      const recognition = recognitionRef.current
      recognition.interimResults = options.interimResults || true
      recognition.lang = options.lang || "en-US"
      recognition.continous = options.continous || false

      if("webkitSpeechGrammerList" in window){
        const grammer = "#JSGF V1:0; grammer punctuation; public <punc>=.|,|?|!|;|:|;"
        const SpeechRecognitionList = new window.webkitSpeechGrammerList
        SpeechRecognitionList.addFromString(grammer)
        recognition.grammers = SpeechRecognitionList
      }

      recognition.onresult = (e)=>{
        let text = ""
        for (let i = 0; i < e.results.length; i++){
          text += e.results[i][0].transcript
        }
        setTranscript(text)
      }

      recognition.onerror = (e)=>{
          console.log("eeror aagaya", e.error);
          
      }

      recognition.onend = ()=>{
        setIsListening(false)
        setTranscript("")
      }

      return ()=>{
        recognition.stop()
      }

  }, []);

  const start = ()=>{
    if(recognitionRef.current && !isListening){
      recognitionRef.current.start()
      setIsListening(true)
    }
  }
  const stop = ()=>{
    if(recognitionRef.current && !isListening){
      recognitionRef.current.start()
      setIsListening(false)
    }
  }


 return{
  isListening,
  transcript,
  start,
  stop
 }
}

export default useSpeechRecognition


// import React, { useEffect, useRef, useState } from 'react'

// const useSpeechRecognition = (options) => {
//   const [isListening, setIsListening] = useState(false)
//   const [transcript, setTranscript] = useState("")
//   const recognitionRef = useRef(null)

//   useEffect(() => {
//     if(!("webkitSpeechRecognition" in window)){
//       console.log("Nhi chala");
//       return 
//     }

//     recognitionRef.current = new window.webkitSpeechRecognition()
//     const recognition = recognitionRef.current
//     recognition.interimResults = options.interimResults || true
//     recognition.lang = options.lang || "en-US"
//     recognition.continuous = options.continuous || false

//     if("webkitSpeechGrammarList" in window){
//       const grammar = "#JSGF V1:0; grammar punctuation; public <punc>=.|,|?|!|;|:|;"
//       const SpeechRecognitionList = new window.webkitSpeechGrammarList()
//       SpeechRecognitionList.addFromString(grammar)
//       recognition.grammars = SpeechRecognitionList
//     }

//     recognition.onresult = (e) => {
//       let text = ""
//       for (let i = 0; i < e.results.length; i++) {
//         text += e.results[i][0].transcript
//       }
//       setTranscript(text)
//     }

//     recognition.onerror = (e) => {
//       console.log("error aagaya", e.error)
//     }

//     recognition.onend = () => {
//       setIsListening(false)
//       // Don't clear the transcript
//     }

//     return () => {
//       recognition.stop()
//     }

//   }, [options]);

//   const start = () => {
//     if (recognitionRef.current && !isListening) {
//       recognitionRef.current.start()
//       setIsListening(true)
//     }
//   }

//   const stop = () => {
//     if (recognitionRef.current && isListening) {
//       recognitionRef.current.stop()
//       setIsListening(false)
//     }
//   }

//   return {
//     isListening,
//     transcript,
//     start,
//     stop
//   }
// }


// export default useSpeechRecognition