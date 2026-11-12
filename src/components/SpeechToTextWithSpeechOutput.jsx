import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MENU } from '../layouts/menu-sidebar/MenuSidebar';
import { useNavigate } from 'react-router-dom';
import audioFile from '../assets/Audio/microphone.mp3'
import { useDispatch } from 'react-redux';
import { logoutAction } from '../store/reducers/AuthSlice/logoutSlice';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { speakMessage } from '../utils/ustil2';


const SpeechToTextWithSpeechOutput = () => {
  const { GetMenuList } = useSelector(
    (state) => state.CommonSlice
  );
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const localData = useLocalStorage("userData", "get"); // get Data from localStorage


  const [extractedData, setExtractedData] = useState([])
  useEffect(() => {

    const data = [...MENU["commonComponent"], ...GetMenuList]?.map((menuItem) => {
      const childrenData = menuItem?.children?.map((child) => ({
        childrenName: child.childrenName,
        url: child.url,
        breadcrumb: child.breadcrumb,
      }));
      return childrenData;
    });
    setExtractedData(data)
  }, [GetMenuList?.length])

  const [isListening, setIsListening] = useState(false);
  const [listeningMessage, setListeningMessage] = useState("");
  const recognitionRef = useRef(null);



  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported by your browser.');
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.continuous = true;  // Continuously listen for speech
    recognitionRef.current.interimResults = false;  // Only final results

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript;
      setListeningMessage(transcript)
    };

    // Auto-restart speech recognition when it ends
    recognitionRef.current.onend = () => {
      if (isListening) {
        startRecognition();  // Restart if user still wants to listen
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current.start();  // Start recognition
  };

  // Stop Speech Recognition
  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false)
    setListeningMessage()
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecognition();
      // document.body.style.opacity = '1';
    } else {
      // document.body.style.opacity = '0.5';
      startRecognition();
      let audio = new Audio(audioFile);
      audio.play()
    }
    setIsListening(!isListening);  // Toggle the listening state
  };

  useEffect(() => {
    if (listeningMessage) {
      if (listeningMessage === "please logout" || listeningMessage === "logout") {
        // handleVoiceMicrophone("Log Out successfully");
        speakMessage(`Log Out successfully`)
        // const utterance = new SpeechSynthesisUtterance(`Log Out successfully`);
        // const voices = window.speechSynthesis.getVoices();
        // let femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female'));
        // if (!femaleVoice) {
        //   femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('en_us'));
        // }
        // utterance.voice = femaleVoice;
        // window.speechSynthesis.speak(utterance);


        // window.speechSynthesis.speak(utterance);
        setTimeout(() => {
          stopRecognition()
        }, [2000])
        dispatch(
          logoutAction({
            roleID: localData?.defaultRole,
            employeeID: localData?.employeeID,
            centreID: localData?.centreID,
          })
        );
      } else {
        const url = extractedData.flat();
        const navi = url?.find((ele) => ele?.childrenName?.toLowerCase().startsWith(listeningMessage.toLowerCase()));
        if (navi?.childrenName) {
          speakMessage(`Openning ${navi?.childrenName} Screen`)
          // const utterance = new SpeechSynthesisUtterance(`Openning ${navi?.childrenName} Screen`);
          // window.speechSynthesis.speak(utterance);
          // setTimeout(() => {
            navigate(navi?.url, { state: { data: navi?.breadcrumb } });
            stopRecognition()
          // }, [2000])
        } else {
          // const utterance = new SpeechSynthesisUtterance(`${listeningMessage} Screen Not Available`);
          // window.speechSynthesis.speak(utterance);
          speakMessage(`${listeningMessage} Screen Not Available`)
          // setTimeout(() => {
            stopRecognition()
          // }, [2000])

        }
      }
    }
  }, [listeningMessage])
  return (
    <>
      <i className="fas fa-solid fa-microphone" onClick={toggleListening}></i>
      {isListening
        && <div className="main-microphone-container">
          <div className="microphone-container">
            <div className="pulsing-circle"></div>
            <div className="microphone-icon background-theme-color">
              <i className="fas fa-solid fa-microphone"></i>
            </div>
          </div>
          <h4 style={{ width: "150px", marginLeft: "-25px" }}> {listeningMessage}</h4>
        </div>}
    </>
  );
};

export default SpeechToTextWithSpeechOutput;
