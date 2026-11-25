import React, { useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Chatbot.css";
import {
  getProcedureItemSearch,
  LoadInvestigation,
  MedicineItemSearch,
  GetMedicineDose,
} from "../../networkServices/DoctorApi";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import NotePadModal from "../../components/modalComponent/Utils/src/components/modalComponent/Utils/NotePadModal";
import Modal from "../../components/modalComponent/Modal";
import { GEMINI_API_KEY } from "../../utils/constant";

const DoctorAssisstance = ({
  patientDetail,
  embedded = false,
  initialMessage = "",
}) => {
  const [isOpen, setIsOpen] = useState(embedded);
  const [message, setMessage] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [labTests, setLabTests] = useState([]);
  const [procedures, setProcedures] = useState([]); // New state for procedures
  const [medicineCache, setMedicineCache] = useState({});
  const [doseOptions, setDoseOptions] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [durationOptions, setDurationOptions] = useState([]);
  const [showNotepad, setShowNotepad] = useState(false);
  const inputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);

  const fetchAllData = async () => {
    try {
      const [labTestsData, proceduresData, doseData, timeData, durationData] =
        await Promise.all([
          fetchLabTests(),
          fetchProcedures(),
          fetchDoseOptions(),
          fetchTimeOptions(),
          fetchDurationOptions(),
        ]);

      console.log("✓ All data loaded successfully");
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (initialMessage && embedded) {
      setMessage(initialMessage);
      // Trigger submission with the new message
      setTimeout(() => {
        handleSubmit(initialMessage);
      }, 500);
    }
  }, [initialMessage, embedded]);

  // Fetch dose options from API
  const fetchDoseOptions = async () => {
    try {
      const result = await GetMedicineDose(1); // Pass type as 1

      if (result?.success && result.data && Array.isArray(result.data)) {
        setDoseOptions(result.data);
        console.log(`✓ Dose options loaded: ${result.data.length} options`);
      } else {
        console.log("Failed to load dose options", result);
        setDoseOptions([]);
      }
    } catch (error) {
      console.error("Error fetching dose options:", error);
      setDoseOptions([]);
    }
  };

  // Fetch time options from API
  const fetchTimeOptions = async () => {
    try {
      const result = await GetMedicineDose(2); // Pass type as 2

      if (result?.success && result.data && Array.isArray(result.data)) {
        setTimeOptions(result.data);
        console.log(`✓ Time options loaded: ${result.data.length} options`);
      } else {
        console.log("Failed to load time options", result);
        setTimeOptions([]);
      }
    } catch (error) {
      console.error("Error fetching time options:", error);
      setTimeOptions([]);
    }
  };

  // Fetch duration options from API
  const fetchDurationOptions = async () => {
    try {
      const result = await GetMedicineDose(3); // Pass type as 3

      if (result?.success && result.data && Array.isArray(result.data)) {
        setDurationOptions(result.data);
        console.log(`✓ Duration options loaded: ${result.data.length} options`);
      } else {
        console.log("Failed to load duration options", result);
        setDurationOptions([]);
      }
    } catch (error) {
      console.error("Error fetching duration options:", error);
      setDurationOptions([]);
    }
  };

  // Fetch medicine from API by prefix
  const fetchMedicineByPrefix = async (medicineName) => {
    // Check cache first
    const cacheKey = medicineName.toLowerCase().trim();
    if (medicineCache[cacheKey]) {
      console.log(`💊 Using cached medicine data for: "${medicineName}"`);
      return medicineCache[cacheKey];
    }

    try {
      // ✅ Use the imported MedicineItemSearch function
      const result = await MedicineItemSearch(medicineName);

      console.log("Medicine API Response:", result);

      if (result?.success && result.data && Array.isArray(result.data)) {
        // Cache the result
        setMedicineCache((prev) => ({
          ...prev,
          [cacheKey]: result.data,
        }));
        console.log(
          `✓ Medicine API returned ${result.data.length} results for "${medicineName}"`,
        );
        return result.data;
      } else {
        console.log(`⚠️ No medicine data found for "${medicineName}"`, result);
        return [];
      }
    } catch (error) {
      console.error("Error fetching medicine:", error);
      return [];
    }
  };

  // Calculate similarity score for medicine names
  const calculateMedicineSimilarityScore = (searchName, apiMedicineName) => {
    const s1 = searchName.toLowerCase().trim();
    const s2 = apiMedicineName.toLowerCase().trim();

    // Exact match
    if (s1 === s2) return 100;

    // Check if search name is contained in API name (common for branded medicines)
    if (s2.includes(s1)) return 95;
    if (s1.includes(s2)) return 90;

    // Extract generic name from API typename (after last dash)
    const genericMatch = s2.match(/- ([^-]+)$/);
    if (genericMatch) {
      const genericName = genericMatch[1].trim().toLowerCase();
      if (genericName.includes(s1) || s1.includes(genericName)) {
        return 92;
      }
    }

    // Word-by-word matching
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);

    let matchingWords = 0;
    words1.forEach((word) => {
      if (words2.some((w) => w.includes(word) || word.includes(w))) {
        matchingWords++;
      }
    });

    const wordMatchScore = (matchingWords / words1.length) * 85;

    // Levenshtein distance
    const levenshteinScore =
      (1 - levenshteinDistance(s1, s2) / Math.max(s1.length, s2.length)) * 75;

    return Math.max(wordMatchScore, levenshteinScore);
  };

  // Find best matching medicine from API
  const findBestMatchingMedicine = async (medicineName) => {
    console.log(`\n💊 Searching medicine API for: "${medicineName}"`);

    const medicines = await fetchMedicineByPrefix(medicineName);

    if (!medicines || medicines.length === 0) {
      console.log(
        `  ⚠️ No results from API, using original: "${medicineName}"`,
      );
      return medicineName;
    }

    let bestMatch = null;
    let bestMatchData = null;
    let highestScore = 0;
    const MINIMUM_THRESHOLD = 70;

    medicines.forEach((medicine) => {
      const typename = medicine.Typename;
      if (!typename) return;

      const score = calculateMedicineSimilarityScore(medicineName, typename);

      if (score > 60) {
        console.log(`  → "${typename}": ${score.toFixed(1)}%`);
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = typename;
        bestMatchData = medicine;
      }
    });

    if (highestScore >= MINIMUM_THRESHOLD) {
      console.log(
        `  ✓ MATCHED: "${bestMatch}" (Score: ${highestScore.toFixed(1)}%)`,
      );
      console.log(`    Brand: ${bestMatchData.Brand}`);
      console.log(`    Generic: ${bestMatchData.Generic}`);
      return bestMatch;
    } else {
      console.log(
        `  ✗ NO MATCH: Highest score ${highestScore.toFixed(1)}% below ${MINIMUM_THRESHOLD}%`,
      );
      console.log(`  Using original: "${medicineName}"`);
      return medicineName;
    }
  };

  // Find best matching dose from API
  const findBestMatchingDose = (extractedDose) => {
    if (!extractedDose || !doseOptions || doseOptions.length === 0) {
      console.log(
        `  ⚠️ No dose options or empty dose, using: "${extractedDose || "N/A"}"`,
      );
      return extractedDose || "";
    }

    let bestMatch = null;
    let highestScore = 0;
    const MINIMUM_THRESHOLD = 70;

    console.log(`  🔍 Searching dose for: "${extractedDose}"`);

    doseOptions.forEach((option) => {
      const hindiText = option.HindiText;
      if (!hindiText) return;

      const score = calculateDoseSpecificSimilarityScore(
        extractedDose,
        hindiText,
      );

      if (score > 60) {
        console.log(`    → "${hindiText}": ${score.toFixed(1)}%`);
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = hindiText;
      }
    });

    if (highestScore >= MINIMUM_THRESHOLD) {
      console.log(`    ✓ Dose matched: "${bestMatch}"`);
      return bestMatch;
    } else {
      console.log(
        `    ⚠️ No good dose match, using original: "${extractedDose}"`,
      );
      return extractedDose;
    }
  };

  const calculateDoseSpecificSimilarityScore = (str1, str2) => {
    // Handle undefined or null values
    if (!str1 || !str2) return 0;

    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    // Exact match
    if (s1 === s2) return 100;

    // Normalize dose units (g to mg, etc.)
    const normalizeDose = (dose) => {
      // Convert g to mg if needed
      const gMatch = dose.match(/(\d+(?:\.\d+)?)\s*g\b/i);
      if (gMatch && !dose.includes("mcg") && !dose.includes("mg")) {
        const grams = parseFloat(gMatch[1]);
        return dose.replace(gMatch[0], `${grams * 1000} mg`);
      }
      return dose;
    };

    const normalized1 = normalizeDose(s1);
    const normalized2 = normalizeDose(s2);

    // Check after normalization
    if (normalized1 === normalized2) return 100;

    // Extract numeric values and units
    const extractDoseInfo = (dose) => {
      const match = dose.match(/(\d+(?:\.\d+)?)\s*([a-z]+)/i);
      if (match) {
        return { value: parseFloat(match[1]), unit: match[2].toLowerCase() };
      }
      return null;
    };

    const dose1 = extractDoseInfo(normalized1);
    const dose2 = extractDoseInfo(normalized2);

    // If both have dose info, compare them
    if (dose1 && dose2) {
      // Same unit and value
      if (dose1.unit === dose2.unit && dose1.value === dose2.value) {
        return 100;
      }
      // Same unit, close value (within 10%)
      if (dose1.unit === dose2.unit) {
        const diff =
          Math.abs(dose1.value - dose2.value) /
          Math.max(dose1.value, dose2.value);
        if (diff < 0.1) {
          return 95;
        }
      }
    }

    // Contains match
    if (
      normalized1.includes(normalized2) ||
      normalized2.includes(normalized1)
    ) {
      return 90;
    }

    // Word-by-word matching
    const words1 = normalized1.split(/\s+/);
    const words2 = normalized2.split(/\s+/);

    let matchingWords = 0;
    const shorterWords = words1.length <= words2.length ? words1 : words2;
    const longerWords = words1.length > words2.length ? words1 : words2;

    shorterWords.forEach((word) => {
      if (longerWords.some((w) => w.includes(word) || word.includes(w))) {
        matchingWords++;
      }
    });

    const wordMatchScore = (matchingWords / shorterWords.length) * 85;

    // Levenshtein distance for fuzzy matching
    const levenshteinScore =
      (1 -
        levenshteinDistance(normalized1, normalized2) /
          Math.max(normalized1.length, normalized2.length)) *
      75;

    return Math.max(wordMatchScore, levenshteinScore);
  };

  // Find best matching time from API
  const findBestMatchingTime = (extractedTime) => {
    if (!extractedTime || !timeOptions || timeOptions.length === 0) {
      console.log(
        `  ⚠️ No time options or empty time, using: "${extractedTime || "N/A"}"`,
      );
      return extractedTime || "";
    }

    let bestMatch = null;
    let highestScore = 0;
    const MINIMUM_THRESHOLD = 70;

    console.log(`  🔍 Searching time for: "${extractedTime}"`);

    timeOptions.forEach((option) => {
      const hindiText = option.HindiText;
      if (!hindiText) return;

      const score = calculateTimeSpecificSimilarityScore(
        extractedTime,
        hindiText,
      );

      if (score > 60) {
        console.log(`    → "${hindiText}": ${score.toFixed(1)}%`);
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = hindiText;
      }
    });

    if (highestScore >= MINIMUM_THRESHOLD) {
      console.log(`    ✓ Time matched: "${bestMatch}"`);
      return bestMatch;
    } else {
      console.log(
        `    ⚠️ No good time match, using original: "${extractedTime}"`,
      );
      return extractedTime;
    }
  };

  const calculateTimeSpecificSimilarityScore = (str1, str2) => {
    // Handle undefined or null values
    if (!str1 || !str2) return 0;

    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    // Exact match
    if (s1 === s2) return 100;

    // Define time-specific mappings for exact matching
    const timeNormalizations = {
      "once daily": [
        "daily",
        "once a day",
        "once daily",
        "od",
        "qd",
        "1 time daily",
        "1 time a day",
        "once per day",
      ],
      "twice daily": [
        "twice daily",
        "twice a day",
        "bid",
        "bd",
        "2 times daily",
        "2 times a day",
        "twice per day",
        "two times daily",
        "two times a day",
      ],
      "three times daily": [
        "three times daily",
        "three times a day",
        "tid",
        "tds",
        "3 times daily",
        "3 times a day",
        "thrice daily",
        "thrice a day",
        "three times per day",
      ],
      "four times daily": [
        "four times daily",
        "four times a day",
        "qid",
        "qds",
        "4 times daily",
        "4 times a day",
        "four times per day",
      ],
      "alternate day": [
        "alternate day",
        "every other day",
        "alternate days",
        "qod",
      ],
      morning: ["morning", "in the morning", "am"],
      afternoon: ["afternoon", "in the afternoon"],
      night: [
        "night",
        "at night",
        "bedtime",
        "before bed",
        "hs",
        "evening",
        "in the evening",
        "pm",
      ],
      "before meals": [
        "before meals",
        "before food",
        "ac",
        "ante cibum",
        "pre meal",
        "before eating",
      ],
      "after meals": [
        "after meals",
        "after food",
        "pc",
        "post cibum",
        "post meal",
        "after eating",
      ],
      "as needed": [
        "as needed",
        "when required",
        "prn",
        "sos",
        "when necessary",
        "if needed",
      ],
    };

    // Check normalized mappings
    for (const [canonical, variants] of Object.entries(timeNormalizations)) {
      const s1InVariants = variants.some((v) => v === s1);
      const s2InVariants = variants.some((v) => v === s2);
      const s1IsCanonical = s1 === canonical;
      const s2IsCanonical = s2 === canonical;

      if ((s1InVariants || s1IsCanonical) && (s2InVariants || s2IsCanonical)) {
        return 98;
      }
    }

    // For phrases with "daily", ensure word-by-word match to avoid false positives
    if (s1.includes("daily") || s2.includes("daily")) {
      const words1 = s1.split(/\s+/);
      const words2 = s2.split(/\s+/);

      // Check if both have the same frequency words (once, twice, three, etc.)
      const frequencyWords = [
        "once",
        "twice",
        "thrice",
        "three",
        "four",
        "five",
        "1",
        "2",
        "3",
        "4",
        "5",
      ];
      const freq1 = words1.find((w) => frequencyWords.includes(w));
      const freq2 = words2.find((w) => frequencyWords.includes(w));

      // If one has a frequency word and the other doesn't, or they differ, score lower
      if (freq1 !== freq2) {
        return 30; // Low score for mismatched frequencies
      }
    }

    // Contains match (only if both contain similar structure)
    if (s1.includes(s2) || s2.includes(s1)) {
      return 85;
    }

    // Check if all words from shorter string are in longer string
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);

    let matchingWords = 0;
    const shorterWords = words1.length <= words2.length ? words1 : words2;
    const longerWords = words1.length > words2.length ? words1 : words2;

    shorterWords.forEach((word) => {
      if (longerWords.some((w) => w.includes(word) || word.includes(w))) {
        matchingWords++;
      }
    });

    const wordMatchScore = (matchingWords / shorterWords.length) * 80;

    // Levenshtein distance for fuzzy matching
    const levenshteinScore =
      (1 - levenshteinDistance(s1, s2) / Math.max(s1.length, s2.length)) * 70;

    return Math.max(wordMatchScore, levenshteinScore);
  };

  // Find best matching duration from API
  const findBestMatchingDuration = (extractedDuration) => {
    if (
      !extractedDuration ||
      !durationOptions ||
      durationOptions.length === 0
    ) {
      console.log(
        `  ⚠️ No duration options or empty duration, using: "${extractedDuration || "N/A"}"`,
      );
      return extractedDuration || "";
    }

    let bestMatch = null;
    let highestScore = 0;
    const MINIMUM_THRESHOLD = 70;

    console.log(`  🔍 Searching duration for: "${extractedDuration}"`);

    durationOptions.forEach((option) => {
      const hindiText = option.HindiText;
      if (!hindiText) return;

      const score = calculateDurationSpecificSimilarityScore(
        extractedDuration,
        hindiText,
      );

      if (score > 60) {
        console.log(`    → "${hindiText}": ${score.toFixed(1)}%`);
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = hindiText;
      }
    });

    if (highestScore >= MINIMUM_THRESHOLD) {
      console.log(`    ✓ Duration matched: "${bestMatch}"`);
      return bestMatch;
    } else {
      console.log(
        `    ⚠️ No good duration match, using original: "${extractedDuration}"`,
      );
      return extractedDuration;
    }
  };

  const calculateDurationSpecificSimilarityScore = (str1, str2) => {
    // Handle undefined or null values
    if (!str1 || !str2) return 0;

    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    // Exact match
    if (s1 === s2) return 100;

    // Define duration-specific mappings
    const durationNormalizations = {
      "1 day": ["1 day", "one day", "single day", "24 hours"],
      "2 days": ["2 days", "two days", "48 hours"],
      "3 days": ["3 days", "three days", "72 hours"],
      "4 days": ["4 days", "four days"],
      "5 days": ["5 days", "five days"],
      "1 week": ["1 week", "one week", "7 days", "seven days"],
      "2 weeks": [
        "2 weeks",
        "two weeks",
        "14 days",
        "fourteen days",
        "fortnight",
      ],
      "3 weeks": ["3 weeks", "three weeks", "21 days"],
      "1 month": ["1 month", "one month", "30 days", "thirty days"],
      "2 months": ["2 months", "two months"],
      "3 months": ["3 months", "three months"],
      ongoing: [
        "ongoing",
        "continue",
        "continuous",
        "until further notice",
        "long term",
      ],
      "as needed": [
        "as needed",
        "when required",
        "prn",
        "sos",
        "when necessary",
      ],
    };

    // Check normalized mappings
    for (const [canonical, variants] of Object.entries(
      durationNormalizations,
    )) {
      const s1InVariants = variants.some((v) => v === s1);
      const s2InVariants = variants.some((v) => v === s2);
      const s1IsCanonical = s1 === canonical;
      const s2IsCanonical = s2 === canonical;

      if ((s1InVariants || s1IsCanonical) && (s2InVariants || s2IsCanonical)) {
        return 98;
      }
    }

    // Extract numeric duration values
    const extractDurationInfo = (duration) => {
      const dayMatch = duration.match(/(\d+)\s*day/i);
      if (dayMatch) return { value: parseInt(dayMatch[1]), unit: "day" };

      const weekMatch = duration.match(/(\d+)\s*week/i);
      if (weekMatch) return { value: parseInt(weekMatch[1]) * 7, unit: "day" };

      const monthMatch = duration.match(/(\d+)\s*month/i);
      if (monthMatch)
        return { value: parseInt(monthMatch[1]) * 30, unit: "day" };

      return null;
    };

    const dur1 = extractDurationInfo(s1);
    const dur2 = extractDurationInfo(s2);

    // If both have duration info (in days), compare them
    if (dur1 && dur2) {
      if (dur1.value === dur2.value) {
        return 100;
      }
      // Close values (within 10%)
      const diff =
        Math.abs(dur1.value - dur2.value) / Math.max(dur1.value, dur2.value);
      if (diff < 0.1) {
        return 95;
      }
    }

    // Contains match
    if (s1.includes(s2) || s2.includes(s1)) {
      return 85;
    }

    // Word-by-word matching
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);

    let matchingWords = 0;
    const shorterWords = words1.length <= words2.length ? words1 : words2;
    const longerWords = words1.length > words2.length ? words1 : words2;

    shorterWords.forEach((word) => {
      if (longerWords.some((w) => w.includes(word) || word.includes(w))) {
        matchingWords++;
      }
    });

    const wordMatchScore = (matchingWords / shorterWords.length) * 80;

    // Levenshtein distance for fuzzy matching
    const levenshteinScore =
      (1 - levenshteinDistance(s1, s2) / Math.max(s1.length, s2.length)) * 70;

    return Math.max(wordMatchScore, levenshteinScore);
  };

  // Fetch lab tests from API
  const fetchLabTests = async () => {
    try {
      const requestBody = {
        type: "1",
        categoryID: "0",
        subCategoryID: "0",
        isIPDData: 0,
        transactionId: String(patientDetail?.TransactionID || ""),
        appID: String(patientDetail?.App_ID || ""),
      };

      const apiResp = await LoadInvestigation(requestBody); // ✅ Pass the body object
      console.log("Lab Tests API Response:", apiResp);

      if (apiResp?.success && apiResp.data && Array.isArray(apiResp.data)) {
        setLabTests(apiResp.data);
        console.log(
          `✓ Lab tests loaded: ${apiResp.data.length} tests available`,
        );
      } else {
        console.log("Failed to load lab tests", apiResp);
        setLabTests([]);
      }
    } catch (error) {
      console.error("Error fetching lab tests:", error);
      setLabTests([]);
    }
  };

  // Fetch Procedures from API
  const fetchProcedures = async () => {
    try {
      let apiresp = await getProcedureItemSearch(); // ✅ Add 'await'
      console.log("apiresp", apiresp);

      if (apiresp?.success) {
        setProcedures(apiresp.data);
        console.log(`✓ Procedures loaded: ${apiresp.data.length} items`);
      } else {
        console.log("Failed to load procedures", apiresp);
        setProcedures([]);
      }
    } catch (error) {
      console.error("Error fetching procedures:", error);
      setProcedures([]);
    }

    // try {
    //   const response = await fetch(
    //     "http://hospedia.itdoseinfo.com:8088/api/v1/Doctor/ProcedureItemSearch?userValidateID=YS+5pgLU9YiUAQ2I5WhcfA==",
    //     {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   const result = await response.json();

    //   if (result.data && Array.isArray(result.data)) {
    //     setProcedures(result.data);
    //     console.log(`✓ Procedures loaded: ${result.data.length} items`);
    //   } else {
    //     console.error("Unexpected Procedure API response:", result);
    //     setProcedures([]);
    //   }
    // } catch (error) {
    //   console.error("Error fetching procedures:", error);
    //   setProcedures([]);
    // }
  };

  // Common medical test aliases mapping
  const getTestAliases = (testName) => {
    const aliases = {
      cbc: [
        "complete blood count",
        "full blood count",
        "fbc",
        "complete blood picture",
        "blood count",
      ],
      "x-ray chest": ["chest x-ray", "chest xray", "cxr", "chest radiograph"],
      lft: ["liver function test", "liver profile", "hepatic function panel"],
      rft: ["renal function test", "kidney function test", "renal profile"],
      "lipid profile": ["lipid panel", "cholesterol test"],
      "urine culture": ["urine c/s", "urine culture and sensitivity"],
      "blood culture": ["blood c/s", "blood culture and sensitivity"],
      esr: ["erythrocyte sedimentation rate", "sed rate"],
      crp: ["c-reactive protein", "c reactive protein"],
      hba1c: [
        "glycated hemoglobin",
        "glycosylated hemoglobin",
        "hemoglobin a1c",
      ],
      tsh: ["thyroid stimulating hormone", "thyroid profile"],
      ecg: ["electrocardiogram", "ekg"],
      echo: ["echocardiography", "cardiac echo", "2d echo"],
      ultrasound: ["usg", "sonography"],
      "ct scan": ["computed tomography", "cat scan"],
      mri: ["magnetic resonance imaging"],
    };

    const lowerTest = testName.toLowerCase().trim();

    // Check if testName matches any key or value in aliases
    for (const [key, values] of Object.entries(aliases)) {
      if (lowerTest === key || values.includes(lowerTest)) {
        return [key, ...values];
      }
    }

    return [lowerTest];
  };

  // Calculate similarity score between two strings
  const calculateSimilarityScore = (str1, str2) => {
    // Handle undefined or null values
    if (!str1 || !str2) return 0;

    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    // Exact match
    if (s1 === s2) return 100;

    // Check aliases first - this is critical for medical terms
    const aliases1 = getTestAliases(s1);
    const aliases2 = getTestAliases(s2);

    // If either test appears in the other's aliases, it's a strong match
    if (aliases1.some((alias) => aliases2.includes(alias))) {
      return 98;
    }

    // Contains match
    if (s1.includes(s2) || s2.includes(s1)) return 90;

    // Check if all words from shorter string are in longer string
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);

    let matchingWords = 0;
    const shorterWords = words1.length <= words2.length ? words1 : words2;
    const longerWords = words1.length > words2.length ? words1 : words2;

    shorterWords.forEach((word) => {
      if (longerWords.some((w) => w.includes(word) || word.includes(w))) {
        matchingWords++;
      }
    });

    const wordMatchScore = (matchingWords / shorterWords.length) * 85;

    // Levenshtein distance for fuzzy matching
    const levenshteinScore =
      (1 - levenshteinDistance(s1, s2) / Math.max(s1.length, s2.length)) * 75;

    return Math.max(wordMatchScore, levenshteinScore);
  };

  // Levenshtein distance algorithm
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  // Find best matching lab test from API data
  const findBestMatchingTest = (extractedTest) => {
    if (!labTests || labTests.length === 0) {
      console.log(
        "⚠️ No lab tests available, using extracted test as-is:",
        extractedTest,
      );
      return extractedTest;
    }

    let bestMatch = null;
    let bestMatchData = null;
    let highestScore = 0;
    const MINIMUM_THRESHOLD = 65; // Minimum 65% match required

    console.log(`\n🔍 Searching for test: "${extractedTest}"`);

    labTests.forEach((test) => {
      const testName = test.typeName;
      if (!testName) return;

      const score = calculateSimilarityScore(extractedTest, testName);

      if (score > 70) {
        console.log(`  → "${testName}": ${score.toFixed(1)}%`);
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = testName;
        bestMatchData = test;
      }
    });

    if (highestScore >= MINIMUM_THRESHOLD) {
      console.log(
        `✓ MATCHED: "${bestMatch}" (Score: ${highestScore.toFixed(1)}%)`,
      );
      return bestMatch;
    } else {
      console.log(
        `✗ NO MATCH: Highest score ${highestScore.toFixed(1)}% is below ${MINIMUM_THRESHOLD}% threshold`,
      );
      console.log(`  Using original: "${extractedTest}"`);
      return extractedTest;
    }
  };

  // Find best matching procedure from API data
  const findBestMatchingProcedure = (extractedProc) => {
    if (!procedures || procedures.length === 0) {
      console.log(
        "⚠️ No procedures available, using extracted as-is:",
        extractedProc,
      );
      return extractedProc;
    }

    const MINIMUM_THRESHOLD = 60; // keep previous threshold

    // normalize helper (case-insensitive, collapse spaces, drop most punctuation)
    const normalize = (s = "") =>
      s
        .toString()
        .toLowerCase()
        .replace(/[^\w\s\-]/g, "") // keep words, numbers, dash
        .replace(/\s+/g, " ")
        .trim();

    const normExtracted = normalize(extractedProc);
    // Use the full original message as context if available (falls back to extractedProc)
    const rawContext = normalize(
      typeof message !== "undefined" && message ? message : extractedProc,
    );

    console.log(`\n🔍 Searching for procedure: "${extractedProc}"`);
    // build candidate list
    const candidates = [];
    let highestScore = 0;

    procedures.forEach((proc) => {
      const typeName = proc.TypeName;
      if (!typeName) return;

      const cleanTypeName = typeName.replace(/^\s*#\s*/, "").trim();
      const score = calculateSimilarityScore(extractedProc, cleanTypeName);
      const normClean = normalize(cleanTypeName);

      if (score > 60) {
        console.log(`  → "${cleanTypeName}": ${score.toFixed(1)}%`);
      }

      candidates.push({
        typeName,
        cleanTypeName,
        normClean,
        score,
      });

      if (score > highestScore) highestScore = score;
    });

    // Filter to only top-scoring candidates
    const topCandidates = candidates.filter((c) => c.score === highestScore);

    if (highestScore >= MINIMUM_THRESHOLD && topCandidates.length > 0) {
      console.log(
        `  ✓ Highest score: ${highestScore.toFixed(1)}% — ${topCandidates.length} top candidate(s)`,
      );

      // 1) Prefer exact normalized equality (covers case/space/punct differences)
      const exact = topCandidates.find((c) => c.normClean === normExtracted);
      if (exact) {
        console.log(`    ✓ Exact match chosen: "${exact.typeName}"`);
        return exact.typeName;
      }

      // 2) Prefer candidate fully present in the original message (handles extractor trimming)
      const inContext = topCandidates.filter((c) =>
        rawContext.includes(c.normClean),
      );
      if (inContext.length === 1) {
        console.log(
          `    ✓ Context substring match chosen: "${inContext[0].typeName}"`,
        );
        return inContext[0].typeName;
      } else if (inContext.length > 1) {
        // If multiple found, prefer the most specific (longest)
        inContext.sort((a, b) => b.normClean.length - a.normClean.length);
        console.log(
          `    ✓ Context tie resolved to most specific: "${inContext[0].typeName}"`,
        );
        return inContext[0].typeName;
      }

      // 3) If extractor is short (e.g. "Abdomen Tapping") but message has extra tokens (e.g. "day rate"),
      //    prefer candidates whose extra tokens match words in the original message.
      const scoredExtra = topCandidates.map((c) => {
        const cleanTokens = c.normClean.split(" ").filter(Boolean);
        const extractedTokens = normExtracted.split(" ").filter(Boolean);
        // tokens present in candidate but not in extractedProc (extra specificity)
        const extraTokens = cleanTokens.filter(
          (t) => !extractedTokens.includes(t),
        );
        // count how many extra tokens appear in the rawContext
        const extraMatchCount = extraTokens.reduce(
          (acc, t) => acc + (rawContext.includes(t) ? 1 : 0),
          0,
        );
        return { ...c, extraTokens, extraMatchCount };
      });

      // choose candidate with highest extraMatchCount (prefer more matched extras), break ties by longest name
      scoredExtra.sort(
        (a, b) =>
          b.extraMatchCount - a.extraMatchCount ||
          b.normClean.length - a.normClean.length,
      );

      if (scoredExtra[0].extraMatchCount > 0) {
        console.log(
          `    ✓ Extra-token context choose: "${scoredExtra[0].typeName}" (matched extra tokens: ${scoredExtra[0].extraTokens.join(", ")})`,
        );
        return scoredExtra[0].typeName;
      }

      // 4) Containment rule (as before) — prefer the one that contains the other, then most specific
      const containment = topCandidates.filter(
        (c) =>
          c.normClean.includes(normExtracted) ||
          normExtracted.includes(c.normClean),
      );
      if (containment.length === 1) {
        console.log(
          `    ✓ Containment match chosen: "${containment[0].typeName}"`,
        );
        return containment[0].typeName;
      } else if (containment.length > 1) {
        containment.sort((a, b) => b.normClean.length - a.normClean.length);
        console.log(
          `    ✓ Containment tie resolved to most specific: "${containment[0].typeName}"`,
        );
        return containment[0].typeName;
      }

      // 5) Fallback to longest top candidate (most specific)
      topCandidates.sort((a, b) => b.normClean.length - a.normClean.length);
      console.log(
        `    ✓ Fallback to longest top candidate: "${topCandidates[0].typeName}"`,
      );
      return topCandidates[0].typeName;
    } else {
      console.log(
        `✗ NO PROCEDURE MATCH: Highest score ${highestScore.toFixed(1)}% is below ${MINIMUM_THRESHOLD}% threshold`,
      );
      return extractedProc;
    }
  };

  // Fill investigation field one test at a time
  const fillInvestigationField = async (testNames) => {
    if (!testNames || testNames.length === 0) return;

    const investigationField =
      document.querySelector('input[name="Investigation(Lab & Radio)"]') ||
      document.querySelector('textarea[name="Investigation(Lab & Radio)"]');

    if (!investigationField) {
      console.error("Investigation field not found");
      return;
    }

    console.log(`\n📋 Filling ${testNames.length} tests one by one...`);

    for (let i = 0; i < testNames.length; i++) {
      const testName = testNames[i];
      console.log(
        `\n[${i + 1}/${testNames.length}] Processing Test: "${testName}"`,
      );

      // Find best match from API
      const matchedTestName = findBestMatchingTest(testName);

      // Fill the field
      await fillSingleValueInField(investigationField, matchedTestName);

      // Wait before processing next test
      if (i < testNames.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    console.log("\n✅ All tests filled successfully!");
  };

  // Fill procedure field one by one
  const fillProcedureField = async (procNames) => {
    if (!procNames || procNames.length === 0) return;

    // Locate the Prescribed Procedure field
    const procedureField =
      document.querySelector('input[name="Prescribed Procedure"]') ||
      document.querySelector('textarea[name="Prescribed Procedure"]');

    if (!procedureField) {
      console.error("Prescribed Procedure field not found");
      return;
    }

    console.log(`\n📋 Filling ${procNames.length} procedures one by one...`);

    for (let i = 0; i < procNames.length; i++) {
      const procName = procNames[i];
      console.log(
        `\n[${i + 1}/${procNames.length}] Processing Procedure: "${procName}"`,
      );

      // Find best match from API
      const matchedProcName = findBestMatchingProcedure(procName);

      // Fill the field
      await fillSingleValueInField(procedureField, matchedProcName);

      // Wait before processing next
      if (i < procNames.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
    console.log("\n✅ All procedures filled successfully!");
  };

  // Generic function to fill a single value into a field (handles append + enter)
  const fillSingleValueInField = async (field, value) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Focus the field
          field.focus();
          field.click();

          const isTextarea = field.tagName === "TEXTAREA";
          const descriptor = isTextarea
            ? Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                "value",
              )
            : Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value",
              );

          const nativeValueSetter = descriptor.set;

          // Get current value
          let currentValue = field.value || "";

          // Append value with comma if there's existing content
          const newValue = currentValue ? `${currentValue}, ${value}` : value;

          // Set the new value
          nativeValueSetter.call(field, newValue);

          // Trigger events
          field.dispatchEvent(new Event("input", { bubbles: true }));
          field.dispatchEvent(new Event("change", { bubbles: true }));

          // Press Enter (simulate selection)
          const enterEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
          });
          field.dispatchEvent(enterEvent);

          console.log(`  ✓ Filled: "${value}"`);
          resolve();
        } catch (err) {
          console.error(`  ✗ Error filling value:`, err);
          resolve();
        }
      }, 200);
    });
  };

  // Start recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const initVisualizer = (stream) => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      source.connect(analyser);
      analyser.fftSize = 64; // Smaller for smoother bars

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;

      drawVisualizer();
    } catch (err) {
      console.error("Error initializing visualizer:", err);
    }
  };

  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.8;

        // Gradient color for a premium look
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, "#0d6efd");
        gradient.addColorStop(1, "#00d2ff");

        ctx.fillStyle = gradient;

        // Draw rounded bars
        const radius = 2;
        const barX = x;
        const barY = height / 2 - barHeight / 2;
        const bHeight = Math.max(barHeight, 2);

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(barX, barY, barWidth - 1, bHeight, radius);
        } else {
          ctx.rect(barX, barY, barWidth - 1, bHeight);
        }
        ctx.fill();

        x += barWidth;
      }
    };

    draw();
  };

  const cleanupVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
  };

  const startLiveSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let fullTranscript = "";

        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }

        setLiveTranscript(fullTranscript.trim());
      };

      recognition.onerror = (event) => {
        console.error("Live speech recognition error:", event);
      };

      recognition.onend = () => {
        speechRecognitionRef.current = null;
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
    } catch (error) {
      console.error("Error starting live speech recognition:", error);
    }
  };

  const stopLiveSpeechRecognition = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping live speech recognition:", error);
      }
      speechRecognitionRef.current = null;
    }
  };

  // Start recording audio
  const startRecording = async () => {
    if (isRecording) return;

    try {
      setMessage("");
      setLiveTranscript("");
      setStatus("Listening...");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      startLiveSpeechRecognition();
      initVisualizer(stream);
      setIsRecording(true);
    } catch (error) {
      setStatus("Microphone access denied");
      console.error("Recording error:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      stopLiveSpeechRecognition();
      mediaRecorderRef.current.stop();
      cleanupVisualizer();
      setIsRecording(false);
      setStatus("Processing audio with Gemini...");
    }
  };

  useEffect(() => {
    if (embedded) {
      setIsOpen(true);
    }
  }, [embedded]);

  useEffect(() => {
    if ((embedded || isOpen) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [embedded, isOpen]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      inputRef.current.style.overflowY = "auto";
    }
  }, [message]);

  // Transcribe audio using Gemini API
  const transcribeAudio = async (audioBlob) => {
    try {
      const base64Audio = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = reject;
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "Please transcribe the following medical audio dictation accurately without adding any extra commentary:",
                  },
                  {
                    inlineData: {
                      mimeType: audioBlob.type || "audio/webm",
                      data: base64Audio,
                    },
                  },
                ],
              },
            ],
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const transcribedText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      setLiveTranscript("");
      setMessage(transcribedText);
      setStatus("Transcription complete! ✓");
    } catch (error) {
      setStatus("Transcription failed");
      console.error("Transcription error:", error);
    }
  };

  const handleNotepadSave = (text) => {
    setMessage((prev) => (prev ? prev + "\n" + text : text));
    setShowNotepad(false);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {
        const base64String = reader.result?.split(",")?.[1];
        resolve(base64String);
      };
      reader.onerror = reject;
    });
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name?.toLowerCase()?.endsWith(".pdf");

    if (!isPdf) {
      setStatus("Please upload a PDF file.");
      return;
    }

    const maxPdfSize = 20 * 1024 * 1024;

    if (file.size > maxPdfSize) {
      setStatus("PDF is too large. Please upload a file under 20 MB.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatus(`Reading PDF: ${file.name}`);

      const base64Pdf = await fileToBase64(file);

      await handleSubmit([
        {
          text: `Read the attached medical PDF carefully. It may be a prescription, discharge summary, OPD consultation note, lab report, or scanned medical document.

Extract only clinically relevant consultation information from this PDF and map it into the same JSON fields requested by the system instruction.

Important:
- Do not invent values.
- Use "" when a field is missing.
- Use [] when medicines are missing.
- For prescribed medicines, extract medicine name, dose, time/frequency, and duration separately.
- For investigations, include only lab/radiology tests.
- For prescribedProcedure, include only procedures, not medicines or investigations.`,
        },
        {
          inlineData: {
            mimeType: file.type || "application/pdf",
            data: base64Pdf,
          },
        },
      ]);
    } catch (error) {
      setStatus("PDF processing failed. Please try again.");
      console.error("PDF processing error:", error);
      setIsProcessing(false);
    }
  };

  // Process message and fill form using Gemini API
  const handleSubmit = async (overrideMessage) => {
    const textToProcess =
      typeof overrideMessage === "string" ? overrideMessage : message;
    if (!textToProcess.trim()) return;

    setIsProcessing(true);
    setStatus("AI is analyzing...");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: `Extract medical consultation data into JSON fields. Use "" for missing info, [] for empty medicines.

FIELDS (extract ONLY what matches each field — no cross-contamination):
- chiefComplaint: Main reason patient came (brief, e.g. "Fever and jaundice")
- historyOfPresentIllness: Detailed current symptoms with duration/progression
- investigation: Lab/radiology orders only (CBC, X-ray, CT, etc.), comma-separated
- prescribedProcedure: Medical procedures only (surgery, dialysis, catheterization), comma-separated
- signSymptoms: Clinical signs and symptoms observed/reported
- doctorNotes: Observations, family history, exam findings not fitting other fields
- vaccinationStatus: Vaccination info only
- allergies: Known allergies (e.g. "Dust allergy")
- pastHistory: Previous medical/surgical history, chronic conditions
- provisionalDiagnosis: Doctor's suspected diagnosis
- doctorAdvice: Patient instructions (lifestyle, diet, follow-up)
- confidentialData: Sensitive/private info
- treatmentHistory: Previous/ongoing medications or treatments
- diet: Dietary instructions or restrictions
- personalOccupationalHistory: Patient's occupation, personal/social history
- generalExamination: General physical examination findings (BP, pulse, temp, weight, etc.)
- riskFactor: Risk factors relevant to condition
- anyAncHospitalisations: ANC (antenatal care) hospitalisations history
- nst: NST (non-stress test) findings or orders
- pelvicAssessment: Pelvic examination findings
- parturitionDetailsAndOutCome: Labour/delivery details and outcomes
- previousDoctor: Previous treating doctor name
- knownOff: Known off/allergies to specific items
- keyNote: Key clinical notes or important reminders
- paExamination: Per abdomen (P/A) examination findings
- pvExamination: Per vaginum (P/V) examination findings
- historyOfCovid: COVID-19 history or related info
- surgicalHistory: Surgical history details
- imunigrationHistory: Immunization/immigration history
- precaution: Precautions to be taken
- finalDiagnosis: Final confirmed diagnosis (ICD-based)
- stageOfCancer: Cancer stage if applicable
- ihcReport: IHC report or molecular findings
- systemicTherapy: Systemic therapy details (chemo, targeted therapy, etc.)
- prescribedMedicines: Array of {name, dose, time, duration}
  - dose: amount+unit only (e.g. "500mg", "10ml") — never frequency
  - time: frequency only — "Once daily"|"Twice daily"|"Three times daily"|"Four times daily"|"Alternate day"|"Morning"|"Afternoon"|"Night"|"Before meals"|"After meals"|"As needed"
  - duration: period only (e.g. "3 days", "1 week", "1 month", "Ongoing")

Return ONLY valid JSON, no markdown:
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
  "personalOccupationalHistory": "",
  "generalExamination": "",
  "riskFactor": "",
  "anyAncHospitalisations": "",
  "nst": "",
  "pelvicAssessment": "",
  "parturitionDetailsAndOutCome": "",
  "previousDoctor": "",
  "knownOff": "",
  "keyNote": "",
  "paExamination": "",
  "pvExamination": "",
  "historyOfCovid": "",
  "surgicalHistory": "",
  "imunigrationHistory": "",
  "precaution": "",
  "finalDiagnosis": "",
  "stageOfCancer": "",
  "ihcReport": "",
  "systemicTherapy": "",
  "prescribedMedicines": []
}`,
                },
              ],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: textToProcess }],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json", // Gemini native JSON enforcement
            },
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      let jsonContent = data.candidates[0].content.parts[0].text.trim();

      // Safeguard for markdown formatting just in case
      if (jsonContent.startsWith("```json")) {
        jsonContent = jsonContent
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "");
      } else if (jsonContent.startsWith("```")) {
        jsonContent = jsonContent.replace(/```\n?/g, "");
      }

      const medicalData = JSON.parse(jsonContent);

      // Process investigation field separately with API matching
      let investigationTests = [];
      if (medicalData.investigation && medicalData.investigation.trim()) {
        investigationTests = medicalData.investigation
          .split(",")
          .map((test) => test.trim())
          .filter((test) => test.length > 0);
      }

      // Process prescribed procedures separately with API matching
      let prescribedProcedures = [];
      if (
        medicalData.prescribedProcedure &&
        medicalData.prescribedProcedure.trim()
      ) {
        prescribedProcedures = medicalData.prescribedProcedure
          .split(",")
          .map((proc) => proc.trim())
          .filter((proc) => proc.length > 0);
      }

      // Fill all standard fields
      const fieldMappings = {
        // --- Existing fields ---
        "Chief Complaint": medicalData.chiefComplaint,
        historyOfPresentIllness: medicalData.historyOfPresentIllness,
        "Sign & Symptoms": medicalData.signSymptoms,
        "Doctor Notes": medicalData.doctorNotes,
        "Vaccination Status": medicalData.vaccinationStatus,
        Allergies: medicalData.allergies,
        "Past History": medicalData.pastHistory,
        "Provisional Diagnosis": medicalData.provisionalDiagnosis,
        "Doctor Advice": medicalData.doctorAdvice,
        ConfidentialData: medicalData.confidentialData,
        "Treatment History": medicalData.treatmentHistory,
        Diet: medicalData.diet,

        // --- New fields (input[name=...] / textarea[name=...]) ---
        "Personal/Occupational History":
          medicalData.personalOccupationalHistory,
        "General Examination": medicalData.generalExamination,
        RiskFactor: medicalData.riskFactor,
        AnyAncHospitalisations: medicalData.anyAncHospitalisations,
        NST: medicalData.nst,
        PelvicAssessment: medicalData.pelvicAssessment,
        ParturitionDetailsAndOutCome: medicalData.parturitionDetailsAndOutCome,
        "Previous Doctor": medicalData.previousDoctor,
        "Known OFF": medicalData.knownOff,
        "Key Note": medicalData.keyNote,
        paExaminantion: medicalData.paExamination,
        pvExaminantion: medicalData.pvExamination,
        historyOfCovid: medicalData.historyOfCovid,
        surgicalHistory: medicalData.surgicalHistory,
        imunigrationHistory: medicalData.imunigrationHistory,
        precaution: medicalData.precaution,
        searchByICDDecs: medicalData.finalDiagnosis,
        stageOfCancer: medicalData.stageOfCancer,
        ihcReport: medicalData.ihcReport,
        systemicTherapy: medicalData.systemicTherapy,
      };

      Object.entries(fieldMappings).forEach(([fieldName, value]) => {
        fillSingleField(fieldName, value, true);
      });

      // Fill investigation tests one by one with API matching
      if (investigationTests.length > 0) {
        setTimeout(async () => {
          await fillInvestigationField(investigationTests);
        }, 500);
      }

      // Fill prescribed procedures one by one with API matching
      if (prescribedProcedures.length > 0) {
        setTimeout(async () => {
          await fillProcedureField(prescribedProcedures);
        }, 800);
      }

      // Fill medicines
      if (
        medicalData.prescribedMedicines &&
        medicalData.prescribedMedicines.length > 0
      ) {
        console.log(
          "\n💊 Starting to fill medicines:",
          medicalData.prescribedMedicines,
        );
        setTimeout(async () => {
          await fillMedicineFields(medicalData.prescribedMedicines);
        }, 1200);
      }

      setStatus("Form filled successfully! ✓");
      setMessage("");

      setTimeout(() => {
        if (!embedded) {
          setIsOpen(false);
        }
        setStatus("");
      }, 2000);
    } catch (error) {
      setStatus("Error processing. Please try again.");
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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
          ? Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype,
              "value",
            )
          : Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              "value",
            );

        const nativeValueSetter = descriptor.set;
        nativeValueSetter.call(input, value);

        const inputEvent = new Event("input", { bubbles: true });
        const changeEvent = new Event("change", { bubbles: true });
        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);

        if (pressEnter) {
          const enterEvent = new KeyboardEvent("keydown", {
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            bubbles: true,
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

  const fillSingleMedicine = async (medicine, rowIndex) => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        console.log(`\n💊 Processing medicine ${rowIndex + 1}:`, medicine);

        // Search for best matches from APIs
        const matchedMedicineName = await findBestMatchingMedicine(
          medicine.name,
        );
        const matchedDose = findBestMatchingDose(medicine.dose);
        const matchedTime = findBestMatchingTime(medicine.time);
        const matchedDuration = findBestMatchingDuration(medicine.duration);

        const nameInputs = document.querySelectorAll('input[name="Name"]');

        if (nameInputs[rowIndex]) {
          nameInputs[rowIndex].click();
          nameInputs[rowIndex].focus();

          setTimeout(() => {
            const descriptor = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              "value",
            );
            const nativeValueSetter = descriptor.set;

            // Fill matched medicine name
            nativeValueSetter.call(nameInputs[rowIndex], matchedMedicineName);
            nameInputs[rowIndex].dispatchEvent(
              new Event("input", { bubbles: true }),
            );
            nameInputs[rowIndex].dispatchEvent(
              new Event("change", { bubbles: true }),
            );
            nameInputs[rowIndex].dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
              }),
            );

            setTimeout(() => {
              const doseInputs =
                document.querySelectorAll('input[name="Dose"]');
              if (doseInputs[rowIndex]) {
                // Fill matched dose
                nativeValueSetter.call(doseInputs[rowIndex], matchedDose);
                doseInputs[rowIndex].dispatchEvent(
                  new Event("input", { bubbles: true }),
                );
                doseInputs[rowIndex].dispatchEvent(
                  new Event("change", { bubbles: true }),
                );
                doseInputs[rowIndex].dispatchEvent(
                  new KeyboardEvent("keydown", {
                    key: "Enter",
                    code: "Enter",
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                  }),
                );

                setTimeout(() => {
                  const timeInputs =
                    document.querySelectorAll('input[name="Time"]');
                  if (timeInputs[rowIndex]) {
                    // Fill matched time
                    nativeValueSetter.call(timeInputs[rowIndex], matchedTime);
                    timeInputs[rowIndex].dispatchEvent(
                      new Event("input", { bubbles: true }),
                    );
                    timeInputs[rowIndex].dispatchEvent(
                      new Event("change", { bubbles: true }),
                    );
                    timeInputs[rowIndex].dispatchEvent(
                      new KeyboardEvent("keydown", {
                        key: "Enter",
                        code: "Enter",
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                      }),
                    );

                    setTimeout(() => {
                      const durationInputs = document.querySelectorAll(
                        'input[name="Duration"]',
                      );
                      if (durationInputs[rowIndex]) {
                        // Fill matched duration
                        nativeValueSetter.call(
                          durationInputs[rowIndex],
                          matchedDuration,
                        );
                        durationInputs[rowIndex].dispatchEvent(
                          new Event("input", { bubbles: true }),
                        );
                        durationInputs[rowIndex].dispatchEvent(
                          new Event("change", { bubbles: true }),
                        );
                        durationInputs[rowIndex].dispatchEvent(
                          new KeyboardEvent("keydown", {
                            key: "Enter",
                            code: "Enter",
                            keyCode: 13,
                            which: 13,
                            bubbles: true,
                          }),
                        );

                        console.log(
                          `  ✅ Medicine filled: ${matchedMedicineName} | ${matchedDose} | ${matchedTime} | ${matchedDuration}`,
                        );

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

  const fillMedicineFields = async (medicines) => {
    if (!medicines || medicines.length === 0) return;

    for (let i = 0; i < medicines.length; i++) {
      console.log(
        `  [${i + 1}/${medicines.length}] Filling medicine:`,
        medicines[i],
      );
      await fillSingleMedicine(medicines[i], i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    console.log("✅ All medicines filled successfully");
  };

  const containerStyle = embedded
    ? {
        position: "relative",
        bottom: "auto",
        right: "auto",
        width: "100%",
        maxWidth: "100%",
        maxHeight: "none",
        height: "100%",
        borderRadius: "12px",
        boxShadow: "none",
        border: "1px solid #dfe7ef",
      }
    : undefined;

  if (!embedded && !isOpen) {
    return (
      <div className="pat_chatbot_fab" onClick={() => setIsOpen(true)}>
        <i className="bi bi-chat-text-fill"></i>
      </div>
    );
  }

  return (
    <div className="pat_chatbot_container" style={containerStyle}>
      <div className="pat_chatbot_header">
        {/* <div className="pat_chatbot_header_left">
          <div className="pat_chatbot_logo">
            <i className="bi bi-heart-pulse-fill"></i>
          </div>
          <div className="pat_chatbot_title">AI Medical Assistant</div>
        </div> */}

        {!embedded && (
          <div
            className="pat_chatbot_header_right"
            onClick={() => {
              setIsOpen(false);
              setMessage("");
              setStatus("");
              if (isRecording) stopRecording();
            }}
          >
            <i className="bi bi-x-lg"></i>
          </div>
        )}
      </div>

      <div
        className="pat_chatbot_body"
        // style={{ height: embedded ? "auto" : "10vh" }}
      >
        {/* <p className="ai_description">
            Speak or type medical notes and I'll smart-fill fields like
            <strong> Chief Complaint</strong>,<strong> Sign & Symptoms</strong>,
            and
            <strong> Prescribed Medicines</strong>.
          </p> */}

        <div className="feature_item_chat">
          <small className="">🎙️</small>
          <small>Use mic button to record medical notes</small>
        </div>
        <div className="feature_item_chat">
          <small className="">⌨️</small>
          <small>Enter the details manually</small>
        </div>
        <div className="feature_item_chat">
          <small className="">📋</small>
          <small>I will auto-fill the form for you</small>
        </div>
      </div>

      {status && <div className="pat_status_message">{status}</div>}

      <div className="pat_chatbot_footer">
        {(isRecording || liveTranscript) && (
          <div
            style={{
              marginBottom: "12px",
              padding: "12px",
              border: "1px solid #d8e2ec",
              borderRadius: "12px",
              background: "#f8fbff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#4a5568",
              }}
            >
              <span>
                {isRecording ? "Live Dictation" : "Recorded Dictation"}
              </span>
              {isRecording && <span>{formatTime(recordingTime)}</span>}
            </div>

            <div
              style={{
                minHeight: "90px",
                maxHeight: "180px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: "1.6",
                color: "#1f2937",
                fontSize: "14px",
              }}
            >
              {liveTranscript || "Listening..."}
            </div>
          </div>
        )}

        <div className="pat_chatbot_input_container">
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf,.pdf"
            style={{ display: "none" }}
            onChange={handlePdfUpload}
          />
          <textarea
            ref={inputRef}
            className="pat_chatbot_input"
            placeholder={
              isRecording
                ? "Transcription will appear here after you stop recording..."
                : "Type here or use microphone..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={1}
            disabled={isProcessing || isRecording}
          />

          <i
            className="bi bi-paperclip pointer-cursor"
            title="Upload PDF"
            onClick={
              isProcessing || isRecording
                ? undefined
                : () => pdfInputRef.current?.click()
            }
            style={{
              opacity: isProcessing || isRecording ? 0.3 : 1,
              cursor: isProcessing || isRecording ? "not-allowed" : "pointer",
            }}
          ></i>

          {!isRecording ? (
            <div className="pat_mic_wrapper">
              <i
                className="bi bi-pencil-fill pat_mic_icon pat_notepad_icon pointer-cursor"
                title="Smart Notepad"
                onClick={() => setShowNotepad(true)}
              ></i>
              <i
                className="bi bi-mic-fill pat_mic_icon pointer-cursor"
                title="Start recording"
                onClick={isProcessing ? undefined : startRecording}
                style={{ opacity: isProcessing ? 0.3 : 1 }}
              ></i>
            </div>
          ) : (
            <div className="pat_inline_recording_controls">
              <canvas
                ref={canvasRef}
                width="0"
                height="0"
                className="pat_voice_visualizer"
              ></canvas>

              <button
                className="pat_inline_stop_button"
                onClick={stopRecording}
                title="Stop recording"
              >
                <i className="bi bi-stop-circle-fill"></i>
              </button>
            </div>
          )}

          {isProcessing ? (
            <i className="bi bi-arrow-repeat pat_chatbot_loader"></i>
          ) : (
            <i
              className={`bi bi-send-fill pointer-cursor ${
                !message.trim() || isRecording ? "pat_icon_disabled" : ""
              }`}
              onClick={
                !message.trim() || isRecording ? undefined : handleSubmit
              }
              title="Send"
            ></i>
          )}
        </div>
      </div>

      <Modal
        visible={showNotepad}
        setVisible={setShowNotepad}
        modalWidth="600px"
        Header="📝 Smart Notepad"
        footer={<></>}
      >
        <NotePadModal onSave={handleNotepadSave} />
      </Modal>
    </div>
  );
};

export default DoctorAssisstance;
