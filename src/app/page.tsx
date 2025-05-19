"use client";
import React, { useState, useRef } from "react";
import { useEffect } from "react";

const sentence = "I can jump. I can jump in the water. My sister can jump.";

const ReadingPractice: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const expectedWordsRef = useRef<string[]>([]);
  const processingLockRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = true;

      recognition.onresult = (event: any) => {
        if (processingLockRef.current) return;
        processingLockRef.current = true;

        const transcript =
          event.results[event.results.length - 1][0].transcript;
        console.log(transcript);

        processSpokenWords(transcript).finally(() => {
          processingLockRef.current = false;
        });
      };

      recognition.onerror = (e: any) => {
        console.error("Speech recognition error:", e.error);
        processingLockRef.current = false;
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech Recognition not supported in this browser.");
    }

    expectedWordsRef.current = sentence
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ");

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const processSpokenWords = async (spoken: string): Promise<void> => {
    try {
      const spokenWords = spoken
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(" ")
        .filter((word) => word.length > 0);

      let localCurrentIndex = currentWordIndex;
      let shouldSpeakCorrection = false;

      for (let i = 0; i < spokenWords.length; i++) {
        if (localCurrentIndex >= expectedWordsRef.current.length) break;

        if (spokenWords[i] === expectedWordsRef.current[localCurrentIndex]) {
          localCurrentIndex++;
          shouldSpeakCorrection = false;
        } else {
          shouldSpeakCorrection = true;
          break;
        }
      }

      setCurrentWordIndex(localCurrentIndex);

      if (shouldSpeakCorrection) {
        await new Promise<void>((resolve) => {
          speak(expectedWordsRef.current[localCurrentIndex]);
          resolve();
        });
      } else if (localCurrentIndex >= expectedWordsRef.current.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentWordIndex(0);
        speak("Great job! Let's try again.");
      }
    } catch (error) {
      console.error("Error processing spoken words:", error);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setCurrentWordIndex(0);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      setCurrentWordIndex(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <p className="text-lg mb-4 text-center max-w-lg">
        {sentence.split(" ").map((word, index) => (
          <span
            onClick={() => speak(word)}
            key={`word-${index}`}
            className={`mx-1 cursor-pointer ${
              index === currentWordIndex ? "bg-yellow-200 px-1" : ""
            }`}
          >
            {word}
          </span>
        ))}
      </p>

      <img
        src="https://res.cloudinary.com/duozomapm/image/upload/v1747589727/Screenshot_2025-05-18_232001_m2temm.png"
        alt="Jumping"
        className="w-60 h-60 object-cover rounded-lg shadow mb-4"
      />

      <button
        onClick={toggleRecording}
        className={`px-4 py-2 text-white font-semibold rounded ${
          isRecording ? "bg-red-500" : "bg-green-600"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <p className="mt-4">
        Current progress: {currentWordIndex}/{sentence.split(" ").length}
      </p>
    </div>
  );
};

export default ReadingPractice;
