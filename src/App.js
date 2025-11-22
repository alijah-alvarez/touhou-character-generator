import React, { useState } from 'react';
import './styles.css';

function App() {
  const [yokaiType, setYokaiType] = useState('');
  const [powerLevel, setPowerLevel] = useState('stage 3 boss');
  const [element, setElement] = useState('');
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://uv0amevpah.execute-api.us-east-1.amazonaws.com/prod/generate';

  const generateCharacter = async () => {
    if (!yokaiType.trim()) {
      setError('Please enter a yokai type!');
      return;
    }

    setLoading(true);
    setError(null);
    setCharacter(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yokai_type: yokaiType,
          power_level: powerLevel,
          element: element || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        setCharacter(data.character);
      } else {
        setError('Failed to generate character');
      }
    } catch (err) {
      setError('Error connecting to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(character, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.characterName.replace(/\s+/g, '_')}.json`;
    link.click();
  };

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>🦊 Touhou Character Generator ⚡</h1>
          <p className="subtitle">Powered by Claude Sonnet 4.5 & AWS</p>
        </header>

        <div className="generator-card">
          <div className="input-section">
            <div className="input-group">
              <label>Yokai Type *</label>
              <input
                type="text"
                placeholder="e.g., kitsune, oni, tengu, kappa, jorogumo"
                value={yokaiType}
                onChange={(e) => setYokaiType(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label>Power Level</label>
              <select 
                value={powerLevel} 
                onChange={(e) => setPowerLevel(e.target.value)}
                disabled={loading}
              >
                <option value="stage 1 boss">Stage 1 Boss</option>
                <option value="stage 2 boss">Stage 2 Boss</option>
                <option value="stage 3 boss">Stage 3 Boss</option>
                <option value="stage 4 boss">Stage 4 Boss</option>
                <option value="stage 5 boss">Stage 5 Boss</option>
                <option value="stage 6 boss">Stage 6 Boss</option>
                <option value="extra boss">Extra Boss</option>
                <option value="phantasm boss">Phantasm Boss</option>
              </select>
            </div>

            <div className="input-group">
              <label>Element (Optional)</label>
              <input
                type="text"
                placeholder="e.g., fire, water, ice, lightning, wind"
                value={element}
                onChange={(e) => setElement(e.target.value)}
                disabled={loading}
              />
            </div>

            <button 
              className="generate-btn" 
              onClick={generateCharacter}
              disabled={loading}
            >
              {loading ? '⚡ Generating...' : '✨ Generate Character'}
            </button>

            {error && <div className="error">{error}</div>}
          </div>

          {character && (
            <div className="character-display">
              <div className="character-header">
                <h2>{character.characterName}</h2>
                <p className="title">{character.title || `${character.species} - ${character.occupation}`}</p>
                <div className="badges">
                  <span className="badge species">{character.species}</span>
                  <span className="badge element">{character.element}</span>
                  <span className="badge power">Power: {character.powerLevel}</span>
                </div>
              </div>

              <div className="character-section">
                <h3>👤 Appearance</h3>
                <p>{character.appearance}</p>
              </div>

              <div className="character-section">
                <h3>⚡ Abilities</h3>
                <ul className="abilities-list">
                  {character.abilities.map((ability, index) => (
                    <li key={index}>
                      <strong>{ability.name || ability}:</strong>{' '}
                      {ability.description || ''}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="character-section">
                <h3>🎭 Personality</h3>
                <p>{character.personality}</p>
              </div>

              <div className="character-section">
                <h3>🏯 Residence</h3>
                <p>{character.residence}</p>
              </div>

              <div className="character-section">
                <h3>📖 Background</h3>
                <p>{character.background}</p>
              </div>

              <div className="character-section">
  <h3>👥 Relationships</h3>
  {typeof character.relationships === 'string' ? (
    <p>{character.relationships}</p>
  ) : (
    <ul className="abilities-list">
      {Object.entries(character.relationships || {}).map(([name, relation], index) => (
        <li key={index}>
          <strong>{name}:</strong> {relation}
        </li>
      ))}
    </ul>
  )}
</div>

              <div className="character-section">
                <h3>🎮 Danmaku Style</h3>
                <p>{character.danmakuStyle}</p>
              </div>

              <button className="export-btn" onClick={exportToJSON}>
                📥 Export to JSON
              </button>
            </div>
          )}
        </div>

        <footer>
          <p>Made with 💜 by Alijah | AWS Builder Challenge Winner 🏆</p>
        </footer>
      </div>
    </div>
  );
}

export default App;