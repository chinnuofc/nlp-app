# AI-Powered SMS Spam Classifier

## 1. Project Overview & Purpose

This project is a modern web application designed to classify SMS messages as **Spam** (unsolicited, often malicious or advertising) or **Ham** (legitimate, desired messages).  
Using the advanced reasoning power of the **Google Gemini API**, it goes beyond simple keyword matching to deliver highly accurate, nuanced message classification in real time.

This app serves as a practical demonstration of how Large Language Models (LLMs) can solve classic Natural Language Processing (NLP) problems with minimal setup and complexity.

---

## 2. Core Features

- **Instant AI-Powered Classification:** Submit SMS text for immediate analysis by the Gemini API.  
- **Confidence Score Visualization:** Animated, color-coded donut chart showing AI confidence (Red for Spam, Green for Ham) as a percentage.  
- **Clean, Responsive UI:** Minimalist, intuitive interface built with React and styled using Tailwind CSS, optimized for desktop and mobile.  
- **Classification History:** Automatically saves classified messages and results in a scrollable log for easy review.  
- **Share/Copy Functionality:** Use the Web Share API on mobile or copy classification summaries on desktop.  
- **Dynamic User Feedback:** Loading spinners and clear error messages improve UX during processing or failures.  
- **Informative Tooltips:** An info icon explains the difference between "Spam" and "Ham" for users unfamiliar with the terms.

---

## 3. How It Works (Technical Workflow)

1. **User Input:** User enters or pastes an SMS message in the textarea (`App.tsx`).  
2. **API Service Call:** Clicking "Classify Message" triggers `handleSubmit` in `App.tsx`, which calls `classifySmsMessage` from `services/geminiService.ts`.  
3. **Request to Gemini API:**  
   - `geminiService.ts` constructs a request to Google Gemini (model: `gemini-2.5-flash`).  
   - The request includes:  
     - **System Instruction:** Instructs the AI to classify messages as "Spam" or "Ham" and respond only in a strict JSON format.  
     - **Response Schema:** Defines required JSON structure:
      ```
      {
        "classification": "Spam" | "Ham",
        "probability": number (0 to 1)
      }
      ```  
4. **AI Analysis & Structured Response:** The Gemini model returns a strictly formatted JSON response (e.g., `{"classification": "Spam", "probability": 0.98}`), ensuring reliable machine-readable output.  
5. **Parsing and State Update:** The response is parsed and sent back to `App.tsx`.  
6. **UI Rendering:** React updates the UI with the result — animating the donut chart, displaying classification text in appropriate colors, and appending the entry to the history list.

---

## 4. Technology Stack

- **Frontend Framework:** React 19 (with `React.StrictMode`)  
- **Language:** TypeScript for type safety and enhanced developer experience  
- **AI Engine:** Google Gemini API (`gemini-2.5-flash` model) via the `@google/genai` SDK  
- **Styling:** Tailwind CSS for fast utility-first styling  
- **Icons:** SVG icons included as React components for simplicity and performance  
- **Module Loading:** ES Modules with `importmap` in `index.html` for a modern, build-tool-free environment

---

## 5. Project File Structure Breakdown

- **index.html:** Main HTML file loading dependencies, animation styles, the root `<div>`, and the importmap.  
- **index.tsx:** React app entry point that renders the `App` component.  
- **App.tsx:** Main component managing all state (input, loading, results, history, errors) and rendering the UI.  
- **services/geminiService.ts:** Encapsulates all communication with the Gemini API, keeping API logic separate from UI code.  
- **components/:** Folder containing reusable React components, including:  
  - `ProbabilityDonut.tsx`: Animated donut chart visualization of confidence scores.  
  - `InfoTooltip.tsx`: Info icon with hover-tooltips explaining key terms.  
- **types.ts:** Centralized TypeScript interfaces and types, such as `ClassificationResult` and `HistoryEntry`, ensuring consistent typing.  
- **metadata.json:** Project configuration file.

---

This project highlights how modern LLM APIs can be integrated into user-friendly web apps to solve real-world classification challenges with ease and accuracy.

---

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1cqeM1vsrZck5ES_GS3zTLJ4HO83Xajo9

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
