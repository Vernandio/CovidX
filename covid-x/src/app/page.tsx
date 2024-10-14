"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button"; // shadcn Button component
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  const curX = useRef(0);
  const curY = useRef(0);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);
  const idleCounter = useRef(0);

  const phrases = [
    "Early Covid Detection Saves Lives",
    "Accurate, Timely, and Life-Saving Covid Diagnosis",
  ];

  // Typing effect logic
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 100 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, typingSpeed]);

  // Mouse tracking logic
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouseX(event.clientX);
      setMouseY(event.clientY);
      setIsIdle(false);

      if (idleTimeout.current) clearTimeout(idleTimeout.current);

      idleTimeout.current = setTimeout(() => setIsIdle(true), 500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 animate-spin-slow blur-2xl opacity-60">
          <div className="w-[60%] h-[60%] bg-gradient-to-r from-indigo-400 to-pink-500 rounded-full"></div>
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative z-10 text-center p-8 max-w-1xl mx-auto mt-20">
        <h1 className="text-5xl font-extrabold tracking-wide mb-4">
          {text}
          <span className="animate-pulse">|</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Accurate, timely, and life-saving Covid diagnosis at your fingertips.
        </p>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <a href="/detection">Start Your Assessment</a>
        </Button>
      </header>

      {/* Features Section */}
      <section className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-5xl">
        {features.map((feature) => (
          <Card key={feature.title} className="bg-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Footer */}
      <footer className="relative z-8 mt-24 text-center">
        <p className="text-gray-400">© 2024 COVIDX. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Features data
const features = [
  {
    title: "Why Early Detection?",
    description:
      "Early detection of cancer significantly increases the chances of successful treatment. Learn how our tools can help.",
  },
  {
    title: "Our Technology",
    description:
      "Powered by the latest AI and medical advancements, our platform delivers precise results.",
  },
  {
    title: "How It Works",
    description:
      "Upload your health data and let our AI-driven system analyze the results in minutes.",
  },
];
