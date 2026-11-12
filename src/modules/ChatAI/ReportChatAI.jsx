import { useEffect, useRef, useState } from "react";
import { ReportAIChatPdfAPI } from "../../networkServices/commonApi";
import { notify } from "../../utils/utils";
import ReactMarkdown from "react-markdown";
import { FaCommentDots } from "react-icons/fa";
import { SendMessageIcon } from "../../components/SvgIcons";
import { FaPaperclip, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import doctorPng from "../../../src/assets/image/doctorPng.png";
import { stopButton } from "../../components/SvgIcons";
import { useLocation, useSearchParams } from "react-router-dom";

import "./ReportChatAI.css";

function ReportChatAI() {
  const typingIntervalRef = useRef(null);
  const [searchParams] = useSearchParams();
  const pdfUrl = searchParams.get("pdfUrl");



  const [messages, setMessages] = useState([
    { role: "system", content: "How can I help you ?" },
    // {
    //   role: "ai-assistant", content: `Based on the information provided, this is a detailed medical laboratory report for a patient named "Mr. DUMMY," who is a 25-year-old male. The report includes results from various tests, which are grouped under different panels, such as Liver & Kidney Panel, Lipid Screen, Glucose and HbA1c, Vitamin Levels, Thyroid Profile, and Complete Blood Count (CBC). The provided report spans 7 pages, with results, reference intervals, and interpretative comments. Below is a brief overview of the key results and their potential clinical significance:

    // 1. **Liver & Kidney Panel**:
    //    - **Creatinine**: Within the normal reference range, indicating normal kidney function.
    //    - **GFR Estimated**: Above 59 mL/min/1.73m², suggesting adequate kidney filtration rate.
    //    - **BUN/Creatinine Ratio**: Within normal limits, indicating balanced nitrogen waste and creatinine in the blood.
    //    - **Liver Enzymes (AST, ALT, GGTP, ALP)**: Appear to be within normal ranges, suggesting no immediate liver damage.
    //    - **Bilirubin (Total, Direct, Indirect)**: Total and direct bilirubin levels are below the reference range, which might need clinical correlation.
    //    - **Albumin**: Below the reference range, could indicate poor protein intake or liver disease, among other causes.
    //    - **A:G Ratio**: Increased, could be a sign of underlying conditions needing further investigation.

    // 2. **Lipid Screen**:
    //    - Results seem to be missing for these categories, but guidelines are provided for management of various lipid targets based on risk categories for atherosclerotic cardiovascular disease (ASCVD).

    // 3. **Glucose, Fasting (F)**:
    //    - **Glucose Fasting**: Appears to be within the normal range, indicating no immediate concerns for diabetes.

    // 4. **Vitamin Levels**:
    //    - **Vitamin B12**: Normal.
    //    - **Vitamin D, 25 Hydroxy**: Results suggest sufficiency.

    // 5. **Thyroid Profile**:
    //    - Appears normal with results of T3, Total T4, and TSH within the normal reference ranges.

    // 6. **Glycated Hemoglobin (HbA1c)**:
    //    - Elevated at 10.0%, which is indicative of poorly controlled blood sugar levels and suggests diabetes. This requires urgent attention and management.

    // 7. **Complete Blood Count**:
    //    - **Hemoglobin, Platelet Count, RBC Count, WBC Count**: All within the normal ranges, indicating no immediate concerns related to the CBC profile.

    // The report also includes interpretative comments relevant to each test, providing clinical context where applicable, and notes about potential factors affecting the test results or their interpretation.

    // The final page of the report provides information about the laboratory itself and disclaimer notes, emphasizing that the results should be interpreted in conjunction with clinical findings by the referring physician.

    // Given that the glucose and HbA1c values are indicative of diabetes, the patient should be evaluated and managed accordingly by a healthcare professional. Any abnormal results require follow-up and should be discussed with the ordering physician for appropriate clinical correlation, additional testing, and treatment as needed.` },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const suggestions = [
    "What do my results mean overall?",
    "Are there any abnormal or critical values?",
    "Do I need to see a doctor right away?",
    "Could this be linked to a condition I already have?",
  ];

  // const simulateTyping = (text) => {
  //   return new Promise((resolve) => {
  //     let currentText = "";
  //     const chars = text.split("");
  //     const delay = 20;
  //     let index = 0;

  //     const typingInterval = setInterval(() => {
  //       currentText += chars[index];
  //       index++;

  //       setMessages((prev) => {
  //         const updated = [...prev];
  //         updated[updated.length - 1].content = currentText;
  //         return updated;
  //       });

  //       if (index >= chars.length) {
  //         clearInterval(typingInterval);
  //         resolve();
  //       }
  //     }, delay);
  //   });
  // };

  const simulateTyping = (text) => {
    return new Promise((resolve) => {
      let currentText = "";
      const chars = text.split("");
      const delay = 20;
      let index = 0;

      typingIntervalRef.current = setInterval(() => {
        currentText += chars[index];
        index++;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = currentText;
          return updated;
        });

        if (index >= chars.length) {
          clearInterval(typingIntervalRef.current);
          resolve();
        }
      }, delay);
    });
  };

  const handleSubmit = async (data) => {
    // debugger
    // e?.preventDefault();
    if (!data.trim()) return;
    setInput("");
    const userMessage = { role: "ai-chat-user", content: data.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const payload = {
      // pdfUrl: "https://cdn1.lalpathlabs.com/live/reports/WM17S.pdf",
      pdfUrl: pdfUrl,
      prompt: data.trim(),
    };
    const apiResp = await ReportAIChatPdfAPI(payload);

    if (apiResp?.success) {
      // if (true) {
      const botMessage = {
        role: "ai-assistant",
        content: "",
      };
      setMessages((prev) => [...prev, botMessage]);
      await simulateTyping(apiResp?.data);
      // await simulateTyping(`Based on the information provided, this is a detailed medical laboratory report for a patient named "Mr. DUMMY," who is a 25-year-old male. The report includes results from various tests, which are grouped under different panels
      //   Based on the information provided, this is a detailed medical laboratory report for a patient named "Mr. DUMMY," who is a 25-year-old male. The report includes results from \n various tests, which are grouped under different panels **Based on the information provided, this is a detailed medical laboratory report for a patient named "Mr. DUMMY," who is a 25-year-old male. The report includes results from various tests, which are grouped under different panels**`);
    } else {
      notify(apiResp?.message, "error");
    }
    setIsTyping(false);
    setInput("");
  };

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  return (
    <div className="ai-chat-container d-flex flex-column">
      <div className="chat-header">
        <div className="chat-header-left">
          {/* Character image peeking out */}
          <div className="chat-header-image">
            <img src={doctorPng} alt="Mascot" />
          </div>

          <div className="chat-header-text">
            <div className="chat-header-title">
              ITD
              <span className="chat-header-ai" style={{ marginTop: "1px" }}>
                AI
              </span>
            </div>
            <div className="chat-header-subtitle" style={{ marginTop: "1px" }}>
              Customer Support Agent
            </div>
          </div>
        </div>
      </div>

      <div
        className="chat-body"
        id="chatBody"
        style={{ flexGrow: 1, padding: "1rem", overflowY: "auto" }}
      >
        {messages.map((msg, idx) => (
          <>
            <div
              key={idx}
              className={`d-flex ${msg.role === "ai-chat-user" ? "justify-content-end" : "justify-content-start"} mb-3`}
            >
              {msg.role !== "ai-chat-user" && (
                <img src={doctorPng} alt="AI" className="chat-avatar" />
              )}
              <div
                className={`chat-bubble glass-box ${msg.role === "ai-chat-user" ? "user-msg" : "ai-msg"}`}
              >
                {msg.role === "ai-chat-user" ? (
                  <span style={{ margin: "0rem !important" }}>
                    {msg.content}
                  </span>
                ) : (<>
                  <div className="markdown-container">
                    {console.log("Raw msg.content:", JSON.stringify(msg.content))}
                    <ReactMarkdown >{msg.content.replace(/\\n/g, "\n")}</ReactMarkdown>
                    {/* <ReactMarkdown>
                      {`- ${msg.content}`}
                    </ReactMarkdown> */}
                  </div>
                 
                </>
                )}
              </div>
              {msg.role === "ai-chat-user" && (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                  alt="User"
                  className="chat-avatar"
                />
              )}
            </div>
          </>
        ))}

        {isTyping && (
          <div className="typing-indicator-wrapper">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {/* 👇 Dummy div that will always be last and scrolled into view */}
        <div ref={chatEndRef} />
      </div>


      <div className="chat-footer">
        <div className="chat-suggestions">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              className="suggestion-btn"
              disabled={isTyping}
              onClick={(e) => handleSubmit(sug)}
            >
              <FaCommentDots style={{ marginRight: "5px" }} />
              {sug}
            </button>
          ))}
        </div>
      </div>
      {/* <div
        className="chat-footer d-flex"
        id="chatForm"
      // onSubmit={(e) => { handleSubmit(input) }}
      >
        <input
          type="text"
          className="form-control ai-chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(input)}
          autoComplete="off"
          required
          disabled={isTyping}
        />
        <span style={{ cursor: isTyping ? "no-drop" : "pointer" }} onClick={(e) => handleSubmit(input)}>
          <SendMessageIcon disabled={isTyping} />
        </span>
      </div> */}
      <div className="chat-input-wrapper">
        {/* <button className="input-icon-btn">
          <FaPaperclip />
        </button> */}
        {isTyping && (
          // <i
          //   class="fa fa-stop"
          //   onClick={() => {
          //     clearInterval(typingIntervalRef.current);
          //     setIsTyping(false);
          //   }}
          //   style={{ cursor: "pointer" }}
          // ></i>
          <button
            className="ai-custom-button"
            aria-label="Stop Button"
            onClick={() => {
              clearInterval(typingIntervalRef.current);
              setIsTyping(false);
            }}
            style={{ cursor: "pointer" }}
          />
        )}

        <input
          type="text"
          className="chat-input"
          placeholder="Ask anything"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(input)}
          disabled={isTyping}
        />
        {/* <button className="input-icon-btn">
          <FaMicrophone />
        </button> */}
        <button
          className="input-icon-btn"
          onClick={() => handleSubmit(input)}
          disabled={isTyping}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default ReportChatAI;
