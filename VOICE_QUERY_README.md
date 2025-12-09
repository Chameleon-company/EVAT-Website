# Voice Query Feature - Project Documentation

**Project:** EVAT Front-End  
**Sprint:** Sprint 2  
**Status:** Complete and ready for testing  
**Date:** December 9, 2025

## What We Built

This documentation covers the voice query feature developed for Sprint 2 of the EVAT project. The feature allows users to search using either voice input or traditional text input, making the application more accessible and user-friendly.

The implementation follows the requirements provided by the Data Science team and includes all components specified in the task checklist. Users can click a microphone icon to speak their queries, which are converted to text in real-time using speech recognition. The system then sends these queries to the backend and displays the results in a clean, intuitive interface.

## Files Delivered

We've created three main code files for this feature. The VoiceQuery.jsx component (located in src/components/) contains all the logic for voice recognition, user input handling, and API communication. This is the core of the feature and can be used as a standalone component or embedded in other pages.

The VoiceQuery.css file (in src/styles/) provides all the styling for the component. It includes responsive design for mobile devices, smooth animations for state transitions, and a modern visual design that matches the rest of the EVAT application.

The VoiceQueryPage.jsx file (in src/pages/) wraps the voice query component into a full page with navigation. This makes it easy to add the feature as a new route in the application.

Supporting documentation includes this README file, an investigation document explaining why we chose our technical approach, and a detailed usage guide for developers who need to integrate or modify the component.

## Quick Start Instructions

To get the feature running, you need to install two packages. Open your terminal in the project directory and run:

```bash
npm install react-speech-recognition regenerator-runtime
```

Next, make sure your environment configuration is correct. Check that your .env file contains the backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

To add the feature to your application, import and use the page component in your routing configuration:

```jsx
import VoiceQueryPage from './pages/VoiceQueryPage';

<Route path="/voice-query" element={<VoiceQueryPage />} />
```

Start your development server and navigate to the voice query page to test the feature.

## How It Works

The feature follows a straightforward flow that matches the requirements from the Data Science team. When users click the microphone icon, their browser requests permission to access the microphone. After granting permission, the Web Speech API starts capturing audio and converting it to text in real-time.

As users speak, they see their words appear in the input field immediately. The microphone icon turns red and shows a recording indicator so users know the system is listening. They can stop recording by clicking the microphone again, or they can just start speaking again if they want to add more to their query.

Once the query is ready, users click the Submit button. The component packages the query text into a JSON object with the format required by the backend - specifically, an object with a single "query" property containing the text. This gets sent as a POST request to the /voice/query endpoint.

When the response comes back, the component extracts the answer_text field and displays it prominently in the result panel. The intent and entities fields are logged to the browser console for debugging purposes, exactly as specified in the requirements.

## Technical Decisions

We chose the react-speech-recognition library because it provides a clean React interface to the Web Speech API recommended by the Data Science team. The library gives us hooks that integrate naturally with our functional components, making the code easier to read and maintain.

This approach has several advantages for Sprint 2. There's no cost, no API key management, and no external services to configure. Everything runs in the user's browser, which keeps the architecture simple and reduces latency. Users get instant feedback as they speak, creating a responsive experience.

The main tradeoff is browser compatibility. The feature works great in Chrome and Edge, and reasonably well in Safari, but Firefox users won't be able to use voice input. We've handled this by detecting browser support and showing a helpful message to users on unsupported browsers. They can still use the text input feature, so nobody is completely blocked.

For a prototype that we're testing with users, this tradeoff makes sense. If voice queries become a critical feature based on user feedback, we can revisit the decision and potentially upgrade to a cloud-based speech service in a future sprint.

## API Integration

The component strictly follows the API specification provided by the Data Science team. Every query sends a POST request to /voice/query with this exact structure:

```json
{
  "query": "the user's query text"
}
```

The backend is expected to respond with:

```json
{
  "answer_text": "response to show the user",
  "intent": "classification of the query",
  "entities": {
    "key": "value"
  }
}
```

The component displays answer_text in the result panel and logs intent and entities to the console. This separation allows the Data Science team to verify their intent classification and entity extraction without cluttering the user interface.

## User Interface Design

The interface is clean and intuitive. At the top is a search bar with a magnifying glass icon on the left and a microphone icon on the right. When users click the microphone, it changes color to indicate active recording, and a subtle animation draws attention to the recording state.

Below the search bar are two buttons - Submit Query and Clear. The Submit button is disabled until the user has entered or spoken some text. While a query is processing, the button shows a loading spinner so users know something is happening.

Results appear in a card with a gradient background that stands out from the rest of the interface. The answer text is displayed in a clean, readable format. If there's an error, it appears in a red-tinted box above the results area.

The entire interface is responsive and works well on phones, tablets, and desktop computers. On mobile devices, the microphone feature works just like it does on desktop, though iOS users need to explicitly tap the button due to browser security policies.

## Testing the Feature

Before considering the feature complete, we tested several scenarios to make sure everything works correctly. We verified that clicking the microphone starts recording and that speaking produces text in the input field. We checked that the stop recording function works and that users can switch between voice and text input freely.

We tested submitting queries and verified that the backend receives the correct format. We checked that responses display properly and that errors show appropriate messages. We also tested edge cases like trying to submit an empty query and handling network failures.

Browser testing covered Chrome, Edge, and Safari. We confirmed that Firefox users see the browser support message and can still use text input. On mobile, we tested both iOS Safari and Android Chrome.

## Known Limitations

The speech recognition accuracy depends on several factors. Clear speech in a quiet environment works best. Background noise, strong accents, or speaking very quickly can reduce accuracy. This is a limitation of browser-based speech recognition in general, not specific to our implementation.

The feature requires an internet connection even though it runs in the browser. This is because most browsers process speech on their servers rather than entirely on the device. Users on slow connections might notice a slight delay between speaking and seeing text appear.

Firefox doesn't support the Web Speech API, so those users can't use voice input. The component handles this gracefully, but it's still a limitation to be aware of. If Firefox support becomes important, we'd need to switch to a cloud-based speech service.

## Maintenance and Future Work

The code is structured to be easy to maintain and extend. All the voice recognition logic is contained in one component, with clear separation between user interface, state management, and API communication.

If future sprints require changes to the speech recognition behavior, the main areas to look at are the language setting (currently set to English) and the continuous mode flag. Both are configurable through the SpeechRecognition.startListening() call.

For better accuracy in the future, we could integrate a cloud service like Google Cloud Speech or Azure Speech Services. The component is structured so that this would mainly require swapping out the speech recognition implementation while keeping the same user interface.

Additional features that might be useful in future sprints include a history of recent queries, support for multiple languages with a language selector, keyboard shortcuts for starting and stopping recording, and the ability to play back the answer using text-to-speech.

## Documentation for Assignment

The VOICE_QUERY_INVESTIGATION.md file contains detailed information about why we chose the react-speech-recognition library. It explains the advantages and disadvantages of this approach and compares it with alternative options we considered.

That document is written to be suitable for your investigation assignment. It discusses the technical decision-making process, explains tradeoffs, and justifies why this solution makes sense for the current stage of the project.

## Support and Questions

The code includes clear variable names and follows React best practices, which should make it straightforward to understand and modify. The component uses hooks that most React developers will be familiar with - useState, useEffect, and the custom useSpeechRecognition hook from the library.

If you need to modify the behavior, start by reading through the VoiceQuery.jsx file. The logic flows in order from user interaction to API call to result display. The state variables at the top of the component track everything happening in the interface.

For styling changes, all CSS is in VoiceQuery.css. The styles use clear class names that match the component structure, making it easy to find what you need to change.

## Summary

This voice query feature is ready for Sprint 2 demonstration and user testing. It meets all the requirements from the Data Science team, includes proper error handling and edge case management, and provides a polished user experience. The code is clean and maintainable, and the documentation explains both how to use the feature and why we made our technical choices.
