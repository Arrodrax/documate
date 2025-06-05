import React, { useState } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [translated, setTranslated] = useState('');
  const [language, setLanguage] = useState('Hindi');
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const handleSummarize = async () => {
    if (!apiKey) {
      setSummary('❌ API key is missing. Please configure REACT_APP_OPENAI_API_KEY.');
      return;
    }

    setLoading(true);
    setSummary('');
    setTranslated('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful document summarizer.' },
            { role: 'user', content: `Summarize this:\n${inputText}` },
          ],
        }),
      });

      const data = await response.json();
      const result = data.choices?.[0]?.message?.content || 'No summary returned.';
      setSummary(result);
      translateSummary(result);
    } catch (error) {
      setSummary('❌ Error during summarizing.');
    } finally {
      setLoading(false);
    }
  };

  const translateSummary = async (summaryText) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a translator.' },
            { role: 'user', content: `Translate the following into ${language}:\n${summaryText}` },
          ],
        }),
      });

      const data = await response.json();
      const translation = data.choices?.[0]?.message?.content || 'No translation returned.';
      setTranslated(translation);
    } catch (error) {
      setTranslated('❌ Error during translation.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2>📄 DocuMate - AI Summarizer & Translator</h2>

      <textarea
        rows="10"
        cols="80"
        placeholder="Paste your document here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <div style={{ marginTop: '15px' }}>
        <label>🌍 Translate summary to: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>Hindi</option>
          <option>Marathi</option>
          <option>Gujarati</option>
          <option>Bengali</option>
          <option>French</option>
          <option>Spanish</option>
        </select>
      </div>

      <button
        onClick={handleSummarize}
        disabled={loading || !inputText}
        style={{ marginTop: '20px', padding: '10px 20px' }}
      >
        {loading ? '⏳ Processing...' : '⚡ Summarize & Translate'}
      </button>

      <div style={{ marginTop: '30px' }}>
        <h3>📌 Summary (English):</h3>
        <p>{summary}</p>

        <h3>🌐 Translation ({language}):</h3>
        <p>{translated}</p>
      </div>
    </div>
  );
}

export default App;
