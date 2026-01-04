import React, { useState } from "react";
import { ArrowRight, BookOpen, X, Globe, Zap } from "lucide-react";

// --- DATA STRUCTURE ---
interface Article {
  id: string;
  category: "Case Study" | "Strategy" | "Press";
  title: string;
  excerpt: string;
  content: React.ReactNode;
  date: string;
  readTime: string;
}

const ARTICLES: Article[] = [
  {
    id: "1",
    category: "Case Study",
    title: "Profuse Beauty: From Hidden Gem to Local Celebrity",
    excerpt: "How we took a local beauty clinic from page 2 obscurity to being fully booked 3 weeks in advance using GMB optimization.",
    date: "Oct 12, 2025",
    readTime: "5 min read",
    content: (
      <div className="space-y-6 text-gray-800">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">The Challenge</h3>
          <p>Profuse Beauty had incredible service but zero digital footprint. Their Google Business Profile was unverified, and they were losing high-intent traffic to inferior competitors simply because they weren't visible.</p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">The Strategy</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Visual Overhaul:</strong> We uploaded 20+ high-quality images of their work, tagged with geo-coordinates.</li>
            <li><strong>Review Velocity:</strong> Implemented an SMS automation system that requested reviews from happy clients immediately after appointments.</li>
            <li><strong>Keyword Injection:</strong> Optimized their service menu with high-volume search terms like "Microblading Centurion" and "Lash Lifts."</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg font-bold text-yellow-900 mb-2">The Results (90 Days)</h3>
          <ul className="list-disc pl-5 text-yellow-800 space-y-1">
            <li>Calls increased by <strong>310%</strong></li>
            <li>Profile views jumped from 50 to <strong>1,200 monthly</strong></li>
            <li>Consistent <strong>Top 3 "Map Pack" ranking</strong></li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "2",
    category: "Case Study",
    title: "The Construction Blueprint: Building Trust Before the First Brick",
    excerpt: "Why traditional flyers failed for this construction firm, and how 'Trust Architecture' on their website landed a R2.5M contract.",
    date: "Nov 05, 2025",
    readTime: "7 min read",
    content: (
      <div className="space-y-6 text-gray-800">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">The Problem
