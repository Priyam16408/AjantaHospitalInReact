import React, { useState, useRef } from 'react';
import { Mic, Send, X, Loader, MessageSquare } from 'lucide-react';

const MedicalAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Your OpenAI API Key
//   const OPENAI_API_KEY = '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';

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('Recording... Click again to stop');
    } catch (error) {
      setStatus('Microphone access denied');
      console.error('Recording error:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('Processing audio...');
    }
  };

  // Transcribe audio using Whisper API
  const transcribeAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: formData
      });

      const data = await response.json();
      setMessage(data.text);
      setStatus('Transcription complete!');
    } catch (error) {
      setStatus('Transcription failed');
      console.error('Transcription error:', error);
    }
  };

  // Process message and fill form
  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsProcessing(true);
    setStatus('AI is analyzing...');

    try {
      // Call GPT to extract medical information
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert medical data extraction assistant. Analyze the medical consultation notes and extract information into the appropriate fields.

FIELD DEFINITIONS AND RULES:

1. chiefComplaint: The main reason patient came to the doctor (symptoms that brought them in). Keep it brief and focused.
   Example: "Fever and yellow discoloration of eyes" or "Persistent lower abdominal pain and burning urination"

2. historyOfPresentIllness: Detailed description of current symptoms including duration, characteristics, progression, and timeline.
   Example: "Patient has fever for the past two nights and yellow discoloration of eyes" or "Persistent lower abdominal pain, mild fever, and burning urination for the past three days"

3. investigation: ONLY laboratory tests and radiological investigations ordered (CBC, X-ray, CT scan, urine culture, etc.). List them separated by commas.
   Example: "CBC, Liver function test, Urine culture" or "Urine routine and culture, Complete blood count"

4. prescribedProcedure: Medical procedures prescribed (surgery, dialysis, catheterization, etc.). NOT medications or tests.
   Leave empty if no procedures mentioned.

5. signSymptoms: Clinical signs and symptoms observed or reported. Include both subjective symptoms and objective signs from physical examination.
   Example: "Fever, Yellow discoloration of eyes, Jaundice" or "Lower abdominal pain, Burning urination, Mild fever, Bilateral fine crepitations"

6. doctorNotes: Additional clinical observations, family history, examination findings, and any other relevant medical information.
   Example: "No family history of liver disease or chronic illness. Bilateral fine crepitations on respiratory examination"

7. vaccinationStatus: Information about vaccinations. Leave empty if not mentioned.

8. allergies: Known allergies to medications, food, or environmental factors.
   Example: "Dust (causes sneezing)" or "No known allergies"

9. pastHistory: Previous medical or surgical history, chronic conditions, similar episodes.
   Example: "No significant past medical or surgical history" or "Similar urinary tract infection episode six months earlier"

10. provisionalDiagnosis: Doctor's suspected diagnosis based on clinical findings (before test results).
    Example: "Suspected hepatobiliary disorder" or "Recurrent urinary tract infection" or "Pneumonia"

11. doctorAdvice: Instructions given to patient (lifestyle, diet, follow-up, precautions).
    Example: "Take plenty of fluids, Avoid oily/spicy food, Avoid alcohol, Return with investigation results"

12. confidentialData: Sensitive information that needs privacy. Leave empty if none.

13. treatmentHistory: Previous treatments, medications used, or ongoing medications.
    Example: "Used paracetamol to reduce fever" or "Used several cough syrups previously"

14. diet: Specific dietary instructions or restrictions.
    Example: "Avoid oily/spicy food, Increase fluid intake, Avoid alcohol"

15. prescribedMedicines: Array of prescribed medications with structured details. Extract ALL medicines mentioned.
    Each medicine object must have:
    - name: Medicine name (e.g., "Paracetamol", "Amoxicillin", "Ibuprofen")
    - dose: Standardized dose with unit
      * Convert "gram" → "g", "milligram" → "mg", "milliliter" → "ml"
      * Keep formats like: "500mg", "1g", "10ml", "2 tabs", "1 tablet"
    - time: Frequency/timing standardized
      * "daily" → "Daily"
      * "twice daily" / "2 times a day" → "Twice daily"
      * "three times daily" / "3 times a day" → "Three times daily"
      * "alternate day" / "every other day" → "Alternate day"
      * "morning" → "Morning"
      * "night" / "bedtime" → "Night"
      * "before meals" → "Before meals"
      * "after meals" → "After meals"
      * "weekly" → "Weekly"
      * "monthly" → "Monthly"
    - duration: Standardized duration
      * "1 day" → "1 day"
      * "2 days" → "2 days"
      * "1 week" → "1 week"
      * "2 weeks" → "2 weeks"
      * "1 month" → "1 month"
      * "ongoing" / "continue" → "Ongoing"
      * "as needed" / "when required" → "As needed"
    
    Example: 
    [
      {"name": "Paracetamol", "dose": "500mg", "time": "Three times daily", "duration": "3 days"},
      {"name": "Amoxicillin", "dose": "250mg", "time": "Twice daily", "duration": "1 week"}
    ]
    
    If no medicines mentioned, return empty array: []

IMPORTANT EXTRACTION RULES:
- If information fits multiple fields, place it in the MOST APPROPRIATE field based on context
- "No regular medication" or "no medication history" goes in pastHistory or treatmentHistory
- Physical examination findings go in signSymptoms or doctorNotes
- Test/investigation ORDERS go in investigation, not in doctorNotes
- For medicines: Handle flexible input order (e.g., "daily paracetamol 500mg for 2 days" or "paracetamol for 2 days 500mg daily")
- Separate multiple items with commas
- Use empty string "" if information is not mentioned (except prescribedMedicines uses empty array [])
- Be concise but include all relevant details
- Infer provisional diagnosis from symptoms if doctor mentions suspecting a condition

Return ONLY valid JSON with no additional text, no markdown formatting, no explanation:
{
  "chiefComplaint": "",
  "historyOfPresentIllness": "",
  "investigation": "",
  "prescribedProcedure": "",
  "signSymptoms": "",
  "doctorNotes": "",
  "vaccinationStatus": "",
  "allergies": "",
  "pastHistory": "",
  "provisionalDiagnosis": "",
  "doctorAdvice": "",
  "confidentialData": "",
  "treatmentHistory": "",
  "diet": "",
  "prescribedMedicines": []
}`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2
        })
      });

      const data = await response.json();
      
      // Extract JSON from response, handling potential markdown formatting
      let jsonContent = data.choices[0].message.content.trim();
      
      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/```\n?/g, '');
      }
      
      const medicalData = JSON.parse(jsonContent);

      // Fill the form fields (including medicines)
      fillFormFields(medicalData);
      
      setStatus('Form filled successfully! ✓');
      setMessage('');
      
      setTimeout(() => {
        setIsOpen(false);
        setStatus('');
      }, 2000);

    } catch (error) {
      setStatus('Error processing. Please try again.');
      console.error('Processing error:', error);
      console.error('Response:', error.response);
    } finally {
      setIsProcessing(false);
    }
  };

  // Fill a single input/textarea field and optionally press Enter
  // Fill a single input/textarea field and optionally press Enter
const fillSingleField = (fieldName, value, pressEnter = false) => {
  if (!value) return false;

  let input = document.querySelector(`input[name="${fieldName}"]`);
  let isTextarea = false;
  
  if (!input) {
    input = document.querySelector(`textarea[name="${fieldName}"]`);
    isTextarea = !!input;
  }

  if (input) {
    try {
      const descriptor = isTextarea 
        ? Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')
        : Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
      
      const nativeValueSetter = descriptor.set;
      nativeValueSetter.call(input, value);

      const inputEvent = new Event('input', { bubbles: true });
      const changeEvent = new Event('change', { bubbles: true });
      input.dispatchEvent(inputEvent);
      input.dispatchEvent(changeEvent);

      // Press Enter if requested (to trigger row creation in table)
      if (pressEnter) {
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true
        });
        input.dispatchEvent(enterEvent);
      }
      
      return true;
    } catch (err) {
      console.error(`Error filling field ${fieldName}:`, err);
      return false;
    }
  }
  return false;
};

// Fill a single medicine entry with proper row navigation
const fillSingleMedicine = async (medicine, rowIndex) => {
  return new Promise((resolve) => {
    // First, click on the Name field for this row to ensure it's active
    setTimeout(() => {
      // Get all Name input fields
      const nameInputs = document.querySelectorAll('input[name="Name"]');
      
      if (nameInputs[rowIndex]) {
        // Click the Name field to activate this row
        nameInputs[rowIndex].click();
        nameInputs[rowIndex].focus();
        
        setTimeout(() => {
          // Now fill Name and press Enter
          const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
          const nativeValueSetter = descriptor.set;
          
          nativeValueSetter.call(nameInputs[rowIndex], medicine.name);
          nameInputs[rowIndex].dispatchEvent(new Event('input', { bubbles: true }));
          nameInputs[rowIndex].dispatchEvent(new Event('change', { bubbles: true }));
          nameInputs[rowIndex].dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
          }));
          
          // Fill Dose and press Enter
          setTimeout(() => {
            const doseInputs = document.querySelectorAll('input[name="Dose"]');
            if (doseInputs[rowIndex]) {
              nativeValueSetter.call(doseInputs[rowIndex], medicine.dose);
              doseInputs[rowIndex].dispatchEvent(new Event('input', { bubbles: true }));
              doseInputs[rowIndex].dispatchEvent(new Event('change', { bubbles: true }));
              doseInputs[rowIndex].dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
              }));
              
              // Fill Time and press Enter
              setTimeout(() => {
                const timeInputs = document.querySelectorAll('input[name="Time"]');
                if (timeInputs[rowIndex]) {
                  nativeValueSetter.call(timeInputs[rowIndex], medicine.time);
                  timeInputs[rowIndex].dispatchEvent(new Event('input', { bubbles: true }));
                  timeInputs[rowIndex].dispatchEvent(new Event('change', { bubbles: true }));
                  timeInputs[rowIndex].dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                  }));
                  
                  // Fill Duration and press Enter (this should create new row)
                  setTimeout(() => {
                    const durationInputs = document.querySelectorAll('input[name="Duration"]');
                    if (durationInputs[rowIndex]) {
                      nativeValueSetter.call(durationInputs[rowIndex], medicine.duration);
                      durationInputs[rowIndex].dispatchEvent(new Event('input', { bubbles: true }));
                      durationInputs[rowIndex].dispatchEvent(new Event('change', { bubbles: true }));
                      durationInputs[rowIndex].dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                      }));
                      
                      // Wait for new row to be created
                      setTimeout(() => {
                        resolve();
                      }, 500);
                    } else {
                      resolve();
                    }
                  }, 300);
                } else {
                  resolve();
                }
              }, 300);
            } else {
              resolve();
            }
          }, 300);
        }, 200);
      } else {
        resolve();
      }
    }, 200);
  });
};

// Fill medicine fields one by one sequentially
const fillMedicineFields = async (medicines) => {
  if (!medicines || medicines.length === 0) return;

  // Fill medicines sequentially, waiting for each to complete
  for (let i = 0; i < medicines.length; i++) {
    console.log(`Filling medicine ${i + 1}:`, medicines[i]);
    await fillSingleMedicine(medicines[i], i);
    // Additional wait between medicines to ensure row is fully created
    await new Promise(resolve => setTimeout(resolve, 600));
  }
  
  console.log('All medicines filled successfully');
};

// Fill form fields with extracted data
const fillFormFields = async (data) => {
  const fieldMappings = {
    'Chief Complaint': data.chiefComplaint,
    'historyOfPresentIllness': data.historyOfPresentIllness,
    'Investigation(Lab & Radio)': data.investigation,
    'Prescribed Procedure': data.prescribedProcedure,
    'Sign & Symptoms': data.signSymptoms,
    'Doctor Notes': data.doctorNotes,
    'Vaccination Status': data.vaccinationStatus,
    'Allergies': data.allergies,
    'Past History': data.pastHistory,
    'Provisional Diagnosis': data.provisionalDiagnosis,
    'Doctor Advice': data.doctorAdvice,
    'ConfidentialData': data.confidentialData,
    'Treatment History': data.treatmentHistory,
    'Diet': data.diet
  };

  // Fill regular fields
  Object.entries(fieldMappings).forEach(([fieldName, value]) => {
    fillSingleField(fieldName, value, true);
  });

  // Fill medicine fields with delay
  if (data.prescribedMedicines && data.prescribedMedicines.length > 0) {
    console.log('Starting to fill medicines:', data.prescribedMedicines);
    setTimeout(async () => {
      await fillMedicineFields(data.prescribedMedicines);
    }, 800);
  }
};

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className=""
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          <MessageSquare size={24} />
          <span className="font-semibold">AI Assistant</span>
        </button>
      )}

      {/* Chatbot Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <h3 className="font-semibold">AI Medical Assistant</h3>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setMessage('');
                setStatus('');
              }}
              className="hover:bg-blue-800 rounded p-1 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">
              Speak or type medical notes, and I'll fill the form automatically.
            </p>

            {/* Status Message */}
            {status && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                {status}
              </div>
            )}

            {/* Input Area */}
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Type medical notes or use microphone..."
                className="w-full p-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="4"
                disabled={isProcessing || isRecording}
              />

              {/* Buttons */}
              <div className="absolute bottom-2 right-2 flex gap-2">
                {/* Microphone Button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`p-2 rounded-full transition ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-gray-200 hover:bg-gray-300'
                  } disabled:opacity-50`}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  <Mic size={20} className={isRecording ? 'text-white' : 'text-gray-700'} />
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || isProcessing || isRecording}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send"
                >
                  {isProcessing ? (
                    <Loader size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <p>• Click microphone to record speech</p>
              <p>• Type medical notes manually</p>
              <p>• Press Enter or Send to auto-fill form</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicalAIAssistant;