# Voice Query Feature - Library Investigation Report
 
**Author:** William
**Date:** Week 6


1. Executive Summary
For the Sprint 2 "Voice Query" task, I investigated solutions to implement Speech-to-Text (STT) on the frontend. The goal was to convert user audio into a text string to send to the backend (/voice/query), adhering to the Data Science team's architecture requirements.

Decision: I selected react-speech-recognition. It is a React hook wrapper for the native Web Speech API, offering the best balance of implementation speed, zero cost, and React compatibility for our current prototype phase.


2. Options Considered
I evaluated three main approaches before making the final decision:

Option A: Cloud APIs (Google Cloud Speech / Azure Cognitive Services)
Pros: High accuracy, supports various dialects, creates a professional-grade experience.

Cons: Requires setting up a backend proxy to hide API keys, involves billing/credit card setup, and adds significant latency (network round-trip).

Verdict: Rejected for Sprint 2. The infrastructure setup is "overkill" for a prototype.

Option B: Native Web Speech API (No Library)
Pros: Zero dependencies.

Cons: Requires writing extensive boilerplate code to handle browser compatibility, event listeners, and state management manually.

Verdict: Rejected. Too time-consuming to maintain within a short sprint.

Option C: react-speech-recognition (Selected)
Pros:

Plug-and-Play: The useSpeechRecognition hook integrates seamlessly with our React functional components.

Cost: Free (uses the browser's built-in engine).

Privacy: Audio is processed by the browser vendor (e.g., Google/Apple) rather than a third-party app server.

Verdict: Selected. It allowed me to implement the feature in under a day.


3. Implementation & Technical Constraints
Implementation Strategy
The library is used to capture the input, which is then passed to the standard form submission handler.

Hook Usage: const { transcript, listening } = useSpeechRecognition();

Syncing: I used a useEffect to sync the real-time transcript into the search input box, providing immediate visual feedback to the user.

Known Limitations
Browser Compatibility:

Chrome/Edge/Safari: Supported.

Firefox: Not supported.

Mitigation: I implemented a fallback UI. If the browser is unsupported, the microphone icon is hidden or disabled, and the user is guided to use text input.

Accuracy:

Performance degrades with background noise compared to cloud solutions.

Mitigation: Acceptable for Sprint 2. If user testing reveals major issues, we can swap the backend logic for Google Cloud in Sprint 4 without changing the UI.


4. Conclusion
react-speech-recognition meets all the requirements for the Voice Assistant MVP. It keeps the frontend lightweight and aligns with the DS team's request for a text-based backend interface. This choice minimizes technical debt while leaving the door open for future upgrades.