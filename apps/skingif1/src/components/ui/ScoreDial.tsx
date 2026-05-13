"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ScoreDialProps {
  score: number; // 0 to 100
  label: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreDial({ score, label, className, size = "md" }: ScoreDialProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  const textClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        {/* Background circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(212, 175, 55, 0.1)" /* Gold subtle base */
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#D4AF37" /* Gold Premium */
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={cn("font-display font-bold text-[#1A1A1A]", textClasses[size])}>
            {Math.round(animatedScore)}
          </span>
        </div>
      </div>
      <span className="text-sm font-semibold tracking-wide uppercase text-[#1A1A1A]/70 text-center">
        {label}
      </span>
    </div>
  );
}
