# Voice Query Component - Usage Guide

## Installation

Open your terminal and navigate to the project directory, then install the required packages:

```bash
npm install react-speech-recognition regenerator-runtime
```

The first package provides the React hooks for speech recognition, and the second ensures compatibility with older JavaScript environments.

## Setting Up the Component

You can use the Voice Query component in two ways depending on your needs.

If you want it as a standalone page with navigation, import the page component in your routing configuration:

```jsx
import VoiceQueryPage from './pages/VoiceQueryPage';

<Route path="/voice-query" element={<VoiceQueryPage />} />
```

If you prefer to embed it within an existing page, import just the component:

```jsx
import VoiceQuery from './components/VoiceQuery';

function MyPage() {
  return (
    <div>
      <VoiceQuery />
    </div>
  );
}
```

## Configuration

Make sure your environment variables are set correctly. Create or update your `.env` file with the backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, use `.env.production`:

```env
VITE_API_URL=https://your-production-api.com/api
```

## Backend Requirements

The component expects a specific API endpoint to be available on your backend:

**Endpoint:** POST `/voice/query`

**Request format:**
```json
{
  "query": "the text captured from speech or typed by user"
}
```

**Response format:**
```json
{
  "answer_text": "The answer to display to the user",
  "intent": "The classification of the query",
  "entities": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

The component displays the answer_text to users and logs the intent and entities to the browser console for debugging purposes.

## How Users Interact with the Feature

Users can input their queries in two ways. They can type directly into the search box, or they can use voice input by clicking the microphone icon. When they click the microphone, the browser asks for permission to access the microphone on first use. After granting permission, they simply speak their query, and the text appears in the input field in real-time.

The microphone icon changes color to red while recording, and users see a "Recording... Please speak" indicator below the input field. They can stop recording by clicking the microphone icon again. Once they're happy with their query, whether typed or spoken, they click the "Submit Query" button.

While the system processes the query, the button shows a loading spinner. When the response arrives, it appears in a styled result panel below the form. Users can start a new query by clicking the "Clear" button, which resets everything.

## Browser Compatibility

The voice recognition feature works best in Chrome, which has supported the Web Speech API since version 25. Microsoft Edge also works well since version 79. Safari users need version 14.1 or later. Firefox doesn't support the Web Speech API, so users on that browser will see a message explaining they can still use the text input feature.

The component automatically detects whether the browser supports speech recognition and adjusts the interface accordingly.

## Customizing the Appearance

You can modify the component's styling by editing the CSS file at `src/styles/VoiceQuery.css`.

To change the color scheme, find the submit button styles and update the background color:

```css
.submit-button {
  background: #4CAF50;
}
```

The result panel uses a gradient that you can customize:

```css
.result-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

To adjust the maximum width of the component container:

```css
.voice-query-container {
  max-width: 800px;
}
```

## Troubleshooting Common Issues

If the microphone doesn't work, first check that the browser has permission to access it. Look for a microphone icon in the address bar and click it to review permissions. Make sure you're using Chrome, Edge, or Safari. If the browser is correct but it still doesn't work, try refreshing the page.

When speech recognition accuracy is poor, suggest to users that they speak clearly and at a moderate pace. Background noise can interfere with recognition, so a quieter environment helps. The quality of the microphone also matters - built-in laptop microphones usually work fine, but external microphones often provide better results.

If queries fail with network errors, verify that the VITE_API_URL in your .env file is correct and that the backend server is running. Check the browser console for detailed error messages that can help identify the problem.

To change the recognition language, edit the VoiceQuery.jsx file and find the SpeechRecognition.startListening call. Change the language parameter:

```jsx
SpeechRecognition.startListening({ 
  continuous: true,
  language: 'en-US'  // for English
  // language: 'es-ES'  // for Spanish
  // language: 'fr-FR'  // for French
});
```

## Mobile Device Support

The component works on mobile devices with some considerations. On iOS Safari, users must manually tap the microphone button - automatic voice activation isn't possible due to browser security policies. The site must also be served over HTTPS for voice features to work on iOS.

Android Chrome provides full support with an experience similar to the desktop version. The responsive design ensures the interface adapts properly to smaller screens.

## Debugging

To see what's happening behind the scenes, open the browser's developer console. When a query succeeds, you'll see log entries showing the intent and entities returned by the backend:

```
Intent: search_location
Entities: { city: "Sydney", type: "fast_charger" }
```

These logs help you verify that the backend is processing queries correctly and returning the expected data structure.

## Development Tips

During development, it's helpful to test with both voice input and text input to ensure both paths work correctly. Try edge cases like empty queries, very long queries, and queries with special characters.

Test the error handling by temporarily pointing the API URL to an invalid address, then verify that users see appropriate error messages rather than a broken interface.

Make sure to test on the actual browsers your users will use, especially if you're developing on Chrome but have Safari users. The speech recognition behavior can vary slightly between browsers.

## Performance Considerations

The component is lightweight and doesn't require any special optimization for typical use. The speech recognition runs in the browser, so it doesn't create server load. API calls only happen when users submit queries, not during voice input.

If you're concerned about bundle size, the component and its dependencies add approximately 15KB to your application when gzipped.

## Security Notes

The component handles voice data entirely in the browser - no audio is sent to your servers. Only the transcribed text goes to your backend through the /voice/query endpoint. Make sure your backend properly validates and sanitizes the query text before processing it.

If you're deploying to production, serve your application over HTTPS. Some browsers require secure contexts for microphone access.
