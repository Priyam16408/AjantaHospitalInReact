import { useState, useRef, useEffect } from "react";
// import DoctorAssisstance from "./DoctorAssisstance";
import "./Chatbot.css";
import {
  FaFilePdf,
  FaImage,
  FaNotesMedical,
  FaClipboardList,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { notify } from "../../utils/ustil2";
// import { GetPatientOPDPrescriptions } from "../../networkServices/DoctorApi";
import moment from "moment";
// import { handleSaveNoteCreation } from "../../networkServices/Emergency";
import Modal from "../../components/modalComponent/Modal";
import FullTextEditor from "../../utils/TextEditor";
// import FullTextSummaryEditor from "../../utils/TextSummaryEditor";
// import { GEMINI_API_KEY, GEMINI_MODEL } from "../../utils/constant";
const VITE_APP_REACT_APP_BASE_URl = "";
// const PATIENT_API_URL =
//   "http://itd.dgn360.com:8109/MobileApp_API/API/LoginAPIDynamic/React_GetPatientOPDPrescriptions?PatientID=20008178&FromDate&ToDate";
export const getPatientApiUrl = async (
  data,
  fromDate = moment().subtract(30, "days").format("YYYY-MM-DD"),
  toDate = moment(new Date()).format("YYYY-MM-DD"),
) => {
  const patientId =
    data?.PatientID || data?.PatientId || data?.patientID || data?.patientId;
  const resData = await GetPatientOPDPrescriptions(patientId, fromDate, toDate);
  console.log("AI RESPONSE:", resData);
  return resData;
};
// ─────────────────────────────────────────────
//  HELPERS  (mirrors app.py logic 1-to-1)
// ─────────────────────────────────────────────

/** Remove sensitive fields — same as filter_sensitive_data() in app.py */
function filterSensitiveData(data) {
  const BLOCKED = new Set([
    "AppointmentID",
    "PatientID",
    "PatientName",
    "DoctorID",
    "DoctorName",
  ]);
  if (Array.isArray(data)) return data.map(filterSensitiveData);
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data)
        .filter(([k]) => !BLOCKED.has(k))
        .map(([k, v]) => [k, filterSensitiveData(v)]),
    );
  }
  return data;
}

/** Build a flat prompt string from conversation history — same as build_gemini_prompt() */
function buildGeminiPrompt(history) {
  return history
    .map(({ role, content }) => {
      if (role === "system") return `System Instructions:\n${content}\n\n`;
      if (role === "user") return `User:\n${content}\n\n`;
      if (role === "assistant") return `Assistant:\n${content}\n\n`;
      return "";
    })
    .join("");
}

/** Call Gemini text generation — mirrors generate_from_gemini() */
async function generateFromGemini(history, maxTokens = 750) {
  const prompt = buildGeminiPrompt(history);
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5, // Match temperature from simple version
          maxOutputTokens: maxTokens,
        },
      }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      `Gemini error: ${res.status} ${errorData.error?.message || res.statusText}`,
    );
  }

  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? "(no response)";
}

/** Convert file to base64 string */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────
//  SIMPLE MARKDOWN RENDERER (no extra deps)
// ─────────────────────────────────────────────
function applyInlineFormatting(text = "") {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?):\*\*/g, '<span class="ai-section-label">$1:</span>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderMarkdown(text) {
  if (!text) return "";
  const trimmed = text.trim();
  if (!trimmed) return "";

  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed.includes("ai-rendered-content")
      ? trimmed
      : `<div class="ai-rendered-content">${trimmed}</div>`;
  }

  const blocks = trimmed
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const html = blocks
    .map((block) => {
      if (/^(---|\*\*\*)$/.test(block)) return "<hr/>";

      if (/^#{2,}\s+/.test(block)) {
        const inner = block.replace(/^#{2,}\s+/, "");
        return `<span class="ai-section-label">${applyInlineFormatting(inner)}</span>`;
      }

      if (/^#\s+/.test(block)) {
        return `<h1>${applyInlineFormatting(block.replace(/^#\s+/, ""))}</h1>`;
      }

      if (/^\*\*\*(.+?)\*\*\*$/.test(block)) {
        return `<h2>${applyInlineFormatting(
          block.replace(/^\*\*\*(.+?)\*\*\*$/, "$1"),
        )}</h2>`;
      }

      if (/^\*\*(.+?)\*\*$/.test(block)) {
        const inner = block.replace(/^\*\*(.+?)\*\*$/, "$1");
        // All-uppercase text = document title → h1; mixed case = section label
        const isTitle = /^[^a-z]+$/.test(inner) && inner.length > 4;
        return isTitle
          ? `<h1>${inner}</h1>`
          : `<span class="ai-section-label">${inner}</span>`;
      }

      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      // Detect "**Label:** value" blocks → render as 3-col basic-details-row grid
      const FIELD_RE = /^\*\*(.+?):\*\*\s*(.*)$/;
      if (lines.length >= 2 && lines.every((line) => FIELD_RE.test(line))) {
        const items = lines
          .map((line) => {
            const [, label, value] = line.match(FIELD_RE);
            return `<div class="detail-item"><span class="detail-label">${label}</span><span class="detail-value">${value || "—"}</span></div>`;
          })
          .join("");
        return `<div class="basic-details-row">${items}</div>`;
      }

      if (lines.length && lines.every((line) => /^[-*]\s+/.test(line))) {
        return `<ul>${lines
          .map(
            (line) =>
              `<li>${applyInlineFormatting(line.replace(/^[-*]\s+/, ""))}</li>`,
          )
          .join("")}</ul>`;
      }

      if (lines.length && lines.every((line) => /^\d+\.\s+/.test(line))) {
        return `<ol>${lines
          .map(
            (line) =>
              `<li>${applyInlineFormatting(
                line.replace(/^\d+\.\s+/, ""),
              )}</li>`,
          )
          .join("")}</ol>`;
      }

      return `<p>${lines.map((line) => applyInlineFormatting(line)).join("<br/>")}</p>`;
    })
    .join("");

  return `<div class="ai-rendered-content">${html}</div>`;
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export default function MedicalAssistant({
  patientDetails,
  notepadTextForAI = "",
}) {
  console.log("patientDetails:", patientDetails);
  const { t } = useTranslation();
  // Mirrors patient_data dict in app.py
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("Summary");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [letterType, setLetterType] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [summaryResult, setSummaryResult] = useState("");
  const [docsResult, setDocsResult] = useState("");
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState({
    load: false,
    summary: false,
    discharge: false,
    send: false,
    image: false,
    pdf: false,
    assessment: false,
  });
  const [patientMeta, setPatientMeta] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [editTable, setEditTable] = useState(true);
  const [previewTitle, setPreviewTitle] = useState(
    "Preview AI Generated Letter",
  );

  const chatRef = useRef(null);
  const docRef = useRef(null);
  const pdfRef = useRef(null); // Keep if needed for legacy but we use docRef now
  const notesRef = useRef(null);
  const recognitionRef = useRef(null);
  // Keep conversation history in a ref so async callbacks always see latest value
  const historyRef = useRef([]);

  useEffect(() => {
    if (activeTab === "Chat" && chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, activeTab]);

  const setB = (k, v) => setBusy((p) => ({ ...p, [k]: v }));

  const pushMsg = (type, content) =>
    setMessages((prev) => [
      ...prev.filter((m) => m.type !== "welcome"),
      { type, content, id: Date.now() + Math.random() },
    ]);

  // Character-by-character typing, then finalise as markdown
  const typeMsg = async (text) => {
    const id = Date.now() + Math.random();
    setMessages((prev) => [
      ...prev.filter((m) => m.type !== "welcome"),
      { type: "typing", content: "", id },
    ]);
    let built = "";
    for (let i = 0; i < text.length; i++) {
      built += text[i];
      if (i % 3 === 0 || i === text.length - 1) {
        const snap = built;
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, content: snap } : m)),
        );
      }
      let delay = 8;
      if (["\n", ".", ",", "!", "?"].includes(text[i])) delay = 14;
      await new Promise((r) => setTimeout(r, delay));
    }
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, type: "assistant", content: text } : m,
      ),
    );
  };

  const getSelectedLetterLabel = () => {
    if (letterType === "11") return "Referral Letter";
    if (letterType === "43") return "Medical Certificate";
    if (letterType === "6") return "Discharge Summary";
    return "Medical Letter";
  };

  // ── /load_data ─────────────────────────────────────────────────────────────
  const handleLoadData = async () => {
    setB("load", true);
    try {
      const data = await getPatientApiUrl(patientDetails);
      if (!data) throw new Error("No data received from API");

      console.log("API RAW DATA:", data); // 👈 temporary debug
      const responseObj = data?.response ?? data?.data ?? data ?? {};
      const opdDetails =
        responseObj?.OPDDetails ?? responseObj?.opdDetails ?? [];
      const labReports =
        responseObj?.LabReports ?? responseObj?.labReports ?? [];

      if (!opdDetails.length) {
        console.warn("No OPD details found, loading with basic info");
      }

      const firstRecord = opdDetails[0] ?? {};
      const patientName =
        firstRecord?.PatientName ?? patientDetails?.Pname ?? "Unknown";
      const gender = firstRecord?.Gender ?? patientDetails?.Gender ?? "Unknown";
      const filteredData = filterSensitiveData(data);
      const specializations = [
        ...new Set(opdDetails.map((v) => v.Specialization).filter(Boolean)),
      ];

      // Build system prompt — identical to the "correct" simple version
      const systemMsg = {
        role: "system",
        content: `You are an expert medical assistant AI.
Always respond concisely.
Keep answers short and structured.
Avoid unnecessary explanations.

COMPLETE PATIENT DATA:
${JSON.stringify(filteredData)}

PATIENT OVERVIEW:
- Gender: ${gender}
- Total Visits: ${opdDetails.length}
- Total Lab Reports: ${labReports.length}
- Specializations: ${specializations.join(", ")}

Do not mention patient IDs or doctor IDs.`,
      };

      historyRef.current = [systemMsg];
      setLoaded(true);

      setPatientMeta({
        patientName,
        gender,
        totalVisits: opdDetails.length,
      });
    } catch (e) {
      console.error("Error loading patient data:", e);
      // Fallback greeting if data loading fails, instead of showing an error in the chat
      pushMsg(
        "assistant",
        "Hello! I am your AI Medical Assistant. How can I help you today?",
      );
    }
    setB("load", false);
  };

  // ── Voice Recording Logic ──────────────────────────────────────────────────
  const handleToggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);

      // Finalize transcript in chat
      if (transcript.trim()) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "recording-indicator"),
          { type: "user", content: transcript, id: Date.now() },
        ]);
      } else {
        setMessages((prev) =>
          prev.filter((m) => m.id !== "recording-indicator"),
        );
      }
    } else {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
      }

      setTranscript("");
      // Add flicker indicator to chat
      setMessages((prev) => [
        ...prev,
        { type: "typing", content: "Recording...", id: "recording-indicator" },
      ]);

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let fullTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        setTranscript(fullTranscript);
      };

      recognition.onend = () => setIsRecording(false);
      recognition.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        setIsRecording(false);
        setMessages((prev) =>
          prev.filter((m) => m.id !== "recording-indicator"),
        );
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    }
  };

  // ── /generate_assessment ───────────────────────────────────────────────────
  const handleGenerateAssessment = async () => {
    if (!loaded) return;
    setB("assessment", true);
    setActiveTab("Chat");
    pushMsg(
      "user",
      "Generate AI Assessment & Plan based on transcript/history",
    );
    try {
      const context = transcript
        ? `Current Transcript: ${transcript}`
        : "Use patient history";
      const letterLabel =
        letterType === "11"
          ? "Referral Letter"
          : letterType === "43"
            ? "Medical Certificate"
            : letterType === "6"
              ? "Discharge Summary"
              : "Medical Letter";

      const reply = await callGemini(
        `Generate a professional ${letterLabel} for this patient.
Format it as a proper medical document with appropriate sections for a ${letterLabel}.
Keep it under 700 words, use bullet points where appropriate.
${notes ? `Additional doctor notes: ${notes}` : ""}`,
        1000,
      );
      await typeMsg(reply);
    } catch (e) {
      pushMsg("assistant", `❌ Error: ${e.message}`);
    }
    setB("assessment", false);
  };

  useEffect(() => {
    if (patientDetails?.PatientID) {
      handleLoadData();
    }
  }, [patientDetails?.PatientID]);

  useEffect(() => {
    if (notepadTextForAI) {
      setActiveTab("Autofill");
    }
  }, [notepadTextForAI]);

  // Shared: send user message to Gemini, append both turns to history
  const callGemini = async (userContent, maxTokens = 750) => {
    const history = historyRef.current;
    const updated = [...history, { role: "user", content: userContent }];
    historyRef.current = updated;

    const reply = await generateFromGemini(updated, maxTokens);

    historyRef.current = [...updated, { role: "assistant", content: reply }];
    return reply;
  };

  // ── /quick_summary ─────────────────────────────────────────────────────────
  const handleQuickSummary = async () => {
    if (!loaded) {
      await handleLoadData();
    }
    setB("summary", true);
    setSummaryResult(""); // Clear previous
    pushMsg("user", "Generate quick summary of patient medical history");
    setActiveTab("Chat");
    try {
      const reply = await callGemini(
        "Summarize patient medical history in under 200 words.",
      );
      setSummaryResult(reply);
      await typeMsg(reply);
    } catch (e) {
      pushMsg("assistant", `❌ Error: ${e.message}`);
    }
    setB("summary", false);
  };

  // ── /discharge_summary ─────────────────────────────────────────────────────
  const handleDischargeSummary = async () => {
    if (!loaded) {
      await handleLoadData();
    }
    setB("discharge", true);
    setGeneratedLetter(""); // Clear previous

    const letterLabel =
      letterType === "11"
        ? "Referral Letter"
        : letterType === "43"
          ? "Medical Certificate"
          : letterType === "6"
            ? `Discharge Summary`
            : "Medical Letter";

    pushMsg("user", `Generate ${letterLabel}`);
    setActiveTab("Chat");
    const notes = notesRef.current?.value || "";
    try {
      const letterLabel =
        letterType === "11"
          ? "Referral Letter"
          : letterType === "43"
            ? "Medical Certificate"
            : letterType === "6"
              ? `Discharge Summary Generate a professional and well-formatted hospital discharge summary using clean medical documentation standards.

Formatting Instructions:
- Use clear section headings in bold.
- Maintain proper spacing between sections.
- Keep line height comfortable and readable.
- Use bullet points for medications, investigations, and instructions.
- Align labels properly.
- Use professional hospital document styling.
- Format all dates as: DD-MMM-YYYY (Example: 12-May-2026).
- Avoid unnecessary blank lines.
- Keep medical terminology professional and concise.
- Ensure the summary looks print-ready and easy to read.
- Use proper indentation for nested investigation results.
- Highlight important diagnoses and discharge instructions clearly.
- Keep consistent capitalization across all headings.
- Use horizontal separators between major sections if needed.
- Ensure physician signature section appears at the bottom with enough spacing.
`
              : "Medical Letter";

      const reply = await callGemini(
        `Generate a professional ${letterLabel} for this patient.
Format it as a proper medical document with appropriate sections for a ${letterLabel}.
Keep it under 700 words, use bullet points where appropriate.
${notes ? `Additional doctor notes: ${notes}` : ""}`,
        1000,
      );
      setGeneratedLetter(reply);
      await typeMsg(reply);
    } catch (e) {
      pushMsg("assistant", `❌ Error: ${e.message}`);
    }
    setB("discharge", false);
  };

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    notify("Copied to clipboard Successfully!", "success");
  };

  // ── /ask_question ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!question.trim()) return;
    if (!loaded) {
      await handleLoadData();
    }
    const q = question.trim();
    setQuestion("");
    setActiveTab("Chat"); // Switch to chat when sending
    setB("send", true);
    pushMsg("user", q);
    try {
      const reply = await callGemini(q);
      await typeMsg(reply);
    } catch (e) {
      pushMsg("assistant", `❌ Error: ${e.message}`);
    }
    setB("send", false);
  };

  // ── /upload_image ──────────────────────────────────────────────────────────
  const handleImage = async (file) => {
    if (!file) return;
    setB("image", true);
    setDocsResult(""); // Clear previous
    pushMsg("user", "Uploaded prescription image");
    setActiveTab("Chat");
    try {
      const b64 = await fileToBase64(file);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: "Extract medical info from this prescription. Be concise under 400 words.",
                  },
                  { inline_data: { mime_type: file.type, data: b64 } },
                ],
              },
            ],
            generationConfig: { temperature: 0.2, maxOutputTokens: 750 },
          }),
        },
      );
      if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
      const json = await res.json();
      const text =
        json.candidates?.[0]?.content?.parts?.[0]?.text ?? "(no response)";
      historyRef.current = [
        ...historyRef.current,
        {
          role: "assistant",
          content: `Extracted Prescription Data:\n\n${text}`,
        },
      ];
      setDocsResult(text);
      await typeMsg(text);
    } catch (e) {
      pushMsg("assistant", `❌ Error: ${e.message}`);
    }
    setB("image", false);
    if (docRef.current) docRef.current.value = "";
  };

  // ── /upload_pdf ────────────────────────────────────────────────────────────
  const handlePdf = async (file) => {
    if (!file) return;
    setB("pdf", true);
    setDocsResult(""); // Clear previous
    pushMsg("user", "Uploaded medical PDF");
    setActiveTab("Chat");
    try {
      const b64 = await fileToBase64(file);
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: "Read this PDF and provide a clear structured summary in 300 words.",
                  },
                  { inline_data: { mime_type: "application/pdf", data: b64 } },
                ],
              },
            ],
            generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
          }),
        },
      );
      if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
      const json = await res.json();
      const text =
        json.candidates?.[0]?.content?.parts?.[0]?.text ?? "(no response)";
      historyRef.current = [
        ...historyRef.current,
        { role: "assistant", content: `PDF Summary:\n\n${text}` },
      ];
      setDocsResult(text);
      await typeMsg(text);
    } catch (e) {
      pushMsg("assistant", `❌ Error: ${e.message}`);
    }
    setB("pdf", false);
    if (docRef.current) docRef.current.value = "";
  };

  // ── /reset ─────────────────────────────────────────────────────────────────
  // const handleReset = () => {
  //   if (!window.confirm("Are you sure you want to reset the session?")) return;
  //   historyRef.current = [];
  //   setLoaded(false);
  //   setPatientMeta(null);
  //   setMessages([{ type: "welcome" }]);
  //   setQuestion("");
  // };

  // Drag & drop
  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type.startsWith("image/")) handleImage(file);
    else if (file.type === "application/pdf") handlePdf(file);
  };

  // ── Sidebar tab ─────────────────────────────────────────────────────────
  const TabBtn = ({ id, label, icon, active, onClick }) => (
    <div
      onClick={() => onClick(id)}
      className={`ai-tab-btn ${active ? "active" : ""}`}
    >
      <i className={icon}></i>
      <span>{label}</span>
    </div>
  );

  const [saveCallback, setSaveCallback] = useState(null);

  const handlePreview = (content, onSave, title = "AI Generated Preview") => {
    const rendered = renderMarkdown(content);
    setPreviewTitle(title);
    setPreviewContent(rendered);
    setSaveCallback(() => onSave);
    setEditTable(true);
    setShowPreviewModal(true);
  };

  /*  const handleSaveFromPreview = () => {
    try {
      const response = SaveNoteCreation
    } catch (error) {
      
    }
    setShowPreviewModal(false);
  }; */
  const handleSaveNote = async () => {
    if (!generatedLetter) return;
    try {
      const res = await handleSaveNoteCreation({
        transactionID: patientDetails?.TransactionID
          ? Number(patientDetails.TransactionID)
          : 0,
        headerID: Number(letterType) || 6,
        headerName:
          letterType === "11"
            ? "Referral Letter"
            : letterType === "43"
              ? "Medical Certificate"
              : "Discharge Summary",
        patientID: patientDetails?.PatientID ?? "",
        text: `<div>${generatedLetter.replace(/\n/g, "<br/>\n")}</div>`,
      });
      if (res?.success) {
        setShowPreviewModal(false);
        notify("Note saved successfully!", "success");
      }
    } catch (error) {
      console.error("Save note error:", error);
      notify("Failed to save note.", "error");
    }
  };

  const handleBindToRecord = (content) => {
    if (!content) return;
    notify("Binding data to clinical record...", "info");

    // Simplified field mapping based on common section headers
    const mappings = {
      "Chief Complaint": ["Chief Complaint", "CC"],
      historyOfPresentIllness: ["History of Present Illness", "HPI"],
      "Provisional Diagnosis": ["Provisional Diagnosis", "Diagnosis"],
      "Sign & Symptoms": ["Signs and Symptoms", "Symptoms"],
      "Doctor Advice": ["Advice", "Plan"],
      "Investigation(Lab & Radio)": ["Investigations", "Tests"],
    };

    let filledCount = 0;
    Object.entries(mappings).forEach(([fieldName, keywords]) => {
      // Look for the section in the text
      const regex = new RegExp(
        `(?:${keywords.join("|")}):?\\s*([\\s\\S]*?)(?=\\n\\n|\\n\\*\\*|$)`,
        "i",
      );
      const match = content.match(regex);
      if (match && match[1]) {
        const value = match[1].trim().replace(/\*/g, ""); // Clean markdown stars
        const input =
          document.querySelector(`input[name="${fieldName}"]`) ||
          document.querySelector(`textarea[name="${fieldName}"]`);

        if (input) {
          // Native React value setting
          const descriptor =
            Object.getOwnPropertyDescriptor(
              Object.getPrototypeOf(input),
              "value",
            ) || {};
          const nativeValueSetter = descriptor.set;
          if (nativeValueSetter) {
            nativeValueSetter.call(input, value);
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
            filledCount++;
          }
        }
      }
    });

    if (filledCount > 0) {
      notify(`Successfully bound ${filledCount} fields!`, "success");
    } else {
      notify("No matching fields found to bind.", "warn");
    }
  };
  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="ai-assistant-wrapper">
      {GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE" && (
        <div className="ai-key-warning">
          ⚠️ Replace <code>GEMINI_API_KEY</code> with your actual key.
        </div>
      )}

      <div className="ai-tabs-header">
        {/* <TabBtn
          id="Transcript"
          label="Transcript"
          icon="pi pi-microphone"
          active={activeTab === "Transcript"}
          onClick={setActiveTab}
        /> */}
        <TabBtn
          id="Summary"
          label="Summary"
          icon="pi pi-sparkles"
          active={activeTab === "Summary"}
          onClick={setActiveTab}
        />
        <TabBtn
          id="Chat"
          label="Chat"
          icon="pi pi-comments"
          active={activeTab === "Chat"}
          onClick={setActiveTab}
        />

        <TabBtn
          id="Docs"
          label="Docs"
          icon="pi pi-file"
          active={activeTab === "Docs"}
          onClick={setActiveTab}
        />
        <TabBtn
          id="Letters"
          label="Letters"
          icon="pi pi-envelope"
          active={activeTab === "Letters"}
          onClick={setActiveTab}
        />
        <TabBtn
          id="Autofill"
          label="Autofill"
          icon="pi pi-microphone"
          active={activeTab === "Autofill"}
          onClick={setActiveTab}
        />
      </div>

      <input
        type="file"
        ref={docRef}
        style={{ display: "none" }}
        accept="image/*,application/pdf"
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          if (file.type.startsWith("image/")) handleImage(file);
          else if (file.type === "application/pdf") handlePdf(file);
        }}
      />

      <div className="ai-tab-content">
        {activeTab === "Autofill" && (
          <div className="p-3" style={{ minHeight: "440px" }}>
            <DoctorAssisstance
              patientDetail={patientDetails}
              embedded={true}
              initialMessage={notepadTextForAI}
            />
          </div>
        )}
        {activeTab === "Transcript" && (
          <div className="p-3 ai-transcript-tab">
            <button
              className={`btn w-100 mb-3 ai-record-btn ${isRecording ? "recording" : ""}`}
              onClick={handleToggleRecording}
            >
              <i
                className={
                  isRecording ? "pi pi-stop-circle" : "pi pi-microphone"
                }
              ></i>{" "}
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>

            {/* Real-time transcript display */}
            <div
              className={`ai-transcript-box mb-3 ${transcript ? "has-text" : ""}`}
            >
              {transcript ||
                (isRecording
                  ? "Listening..."
                  : "Click start to record conversation...")}
            </div>

            <hr className="ai-hr" />
            <button
              className="btn ai-action-btn-primary w-100 mb-2"
              onClick={handleGenerateAssessment}
              disabled={busy.assessment || !loaded}
            >
              {busy.assessment ? (
                <i className="pi pi-spin pi-spinner mr-2"></i>
              ) : (
                <i className="pi pi-sparkles mr-2"></i>
              )}
              Generate AI Assessment & Plan
            </button>
            <button className="btn ai-action-btn-outline w-100">
              <i className="pi pi-heart mr-2"></i> Suggest Prescriptions
            </button>
          </div>
        )}

        {activeTab === "Chat" && (
          <div className="ai-chat-container">
            <div className="ai-messages-scroll" ref={chatRef}>
              {messages
                .filter((m) => m.type !== "welcome")
                .map((m) => (
                  <div
                    key={m.id}
                    className={`ai-message-row ai-message-row-${m.type === "user" ? "user" : "assistant"}`}
                  >
                    <div
                      className={`ai-message-bubble ai-message-bubble-${m.type === "typing" ? "typing" : m.type}`}
                    >
                      {m.type === "typing" ? (
                        <div className="ai-typing">
                          <div className="ai-typing-dots mr-2">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          {m.content || "AI is thinking..."}
                        </div>
                      ) : (
                        <div
                          className="ai-md"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(m.content),
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "Summary" && (
          <div className="p-3">
            <button
              className="btn ai-summary-gen-btn w-100 mb-4"
              onClick={handleQuickSummary}
              disabled={busy.summary}
            >
              {busy.summary ? (
                <i className="pi pi-spin pi-spinner"></i>
              ) : (
                <i className="fa fa-clipboard-list mx-2"></i>
              )}{" "}
              Generate Summary
            </button>

            {summaryResult && (
              <div className="ai-generated-letter-container">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small font-weight-bold text-muted">
                    Summary Result
                  </span>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      handlePreview(
                        summaryResult,
                        setSummaryResult,
                        "Patient Summary Preview",
                      )
                    }
                  >
                    Preview
                  </button>
                  <button
                    className="ai-btn-bind"
                    onClick={() => handleBindToRecord(summaryResult)}
                    title="Populate into clinical record"
                  >
                    Bind to Record
                  </button>
                </div>
                <div className="ai-letter-preview-box">
                  <div
                    className="ai-md"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(summaryResult),
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "Docs" && (
          <div className="p-3">
            <div
              className="ai-upload-dropzone mb-4"
              onClick={() => docRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
            >
              <i className="pi pi-upload mb-2" style={{ fontSize: "24px" }}></i>
              <p className="m-0">Upload Documents (PDF, Images, Text)</p>
            </div>

            {docsResult && (
              <div className="ai-generated-letter-container">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="small font-weight-bold text-muted">
                    Document Analysis
                  </span>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      handlePreview(
                        docsResult,
                        setDocsResult,
                        "Document Analysis Preview",
                      )
                    }
                  >
                    Preview
                  </button>
                  <button
                    className="ai-btn-bind"
                    onClick={() => handleBindToRecord(docsResult)}
                    title="Populate into clinical record"
                  >
                    Bind to Record
                  </button>
                </div>
                <div className="ai-letter-preview-box">
                  <div
                    className="ai-md"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(docsResult),
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "Letters" && (
          <div className="p-3">
            <label className="small font-weight-bold text-muted mb-1">
              Letter Type
            </label>
            <ReactSelect
              respclass="col-12"
              name="letterType"
              id="letterType"
              searchable={true}
              removeIsClearable={true}
              placeholderName={t("Select Letter Type")}
              dynamicOptions={[
                { label: "Referral Letter", value: "11" },
                // { label: "Motivation Letter", value: "Motivation Letter" },
                // {
                //   label: "Sick Note / Medical Certificate",
                //   value: "Sick Note / Medical Certificate",
                // },
                { label: "Medical Certificate", value: "43" },
                { label: "Discharge Summary", value: "6" },
              ]}
              handleChange={(name, value) => setLetterType(value?.value)}
              value={letterType}
              isRemoveTemplate={true}
            />
            <label className="small font-weight-bold text-muted mb-1 mt-3">
              Additional Notes (optional)
            </label>
            <textarea
              ref={notesRef}
              className="form-control mb-3 ai-textarea-custom"
              placeholder="Any specific details to include in the letter..."
            ></textarea>
            <button
              className="btn ai-generate-letter-btn w-100 mb-3"
              onClick={handleDischargeSummary}
              disabled={busy.discharge || !letterType}
            >
              {busy.discharge ? (
                <i className="pi pi-spin pi-spinner"></i>
              ) : (
                <i className="pi pi-file-plus"></i>
              )}{" "}
              Generate Letter
            </button>

            {generatedLetter && (
              <div className="ai-generated-letter-container border p-3 rounded">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  {/* <span className="small font-weight-bold text-muted">
                    Generated Letter
                  </span> */}
                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleCopy}
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      handlePreview(
                        generatedLetter,
                        setGeneratedLetter,
                        `${getSelectedLetterLabel()} Preview`,
                      )
                    }
                  >
                    Preview
                  </button>
                  {/* <button
                    className="btn btn-success btn-sm"
                    onClick={handleSaveNote}
                  >
                    Preview
                  </button> */}
                </div>
                <div className="ai-letter-preview-box">
                  <div
                    className="ai-md"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(generatedLetter),
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Input Bar - Show only on Chat tab */}
      {activeTab === "Chat" && (
        <div className="ai-input-bar-container">
          <div className="ai-input-wrapper">
            <input
              type="text"
              className="ai-input-field"
              placeholder="Ask follow-up questions..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="btn ai-send-btn"
              onClick={handleSend}
              disabled={busy.send}
            >
              {busy.send ? (
                <i className="pi pi-spin pi-spinner"></i>
              ) : (
                <i className="pi pi-send"></i>
              )}
            </button>
          </div>
        </div>
      )}

      <Modal
        visible={showPreviewModal}
        setVisible={setShowPreviewModal}
        Header={previewTitle}
        modalWidth="80vw  "
        handleAPI={handleSaveNote}
        buttonName="Save"
      >
        <div className="p-2">
          <FullTextSummaryEditor
            value={previewContent}
            setValue={setPreviewContent}
            EditTable={editTable}
            setEditTable={setEditTable}
          />
        </div>
      </Modal>
    </div>
  );
}
