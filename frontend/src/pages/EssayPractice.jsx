import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import './EssayPractice.css';

const ESSAY_TOPICS = [
    'The Impact of Artificial Intelligence on Education',
    'Climate Change: Challenges and Solutions for the Next Decade',
    'The Role of Technology in Bridging the Urban-Rural Divide',
    'Ethics in Engineering: Balancing Innovation with Responsibility',
    'The Future of Remote Work in India',
    'Importance of Soft Skills for Engineering Graduates',
    'Digital India: Achievements and Remaining Challenges',
    'The Role of Women in STEM Fields',
    'Cybersecurity: Protecting Privacy in the Digital Age',
    'Sustainable Development Goals and India\'s Progress',
];

export default function EssayPractice() {
    const [topic, setTopic] = useState('');
    const [customTopic, setCustomTopic] = useState('');
    const [essay, setEssay] = useState('');
    const [isWriting, setIsWriting] = useState(false);
    const [timeLimit, setTimeLimit] = useState(30);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [savedEssays, setSavedEssays] = useState([]);
    const timerRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem('savedEssays');
        if (saved) setSavedEssays(JSON.parse(saved));
    }, []);

    useEffect(() => {
        const words = essay.trim().split(/\s+/).filter(Boolean).length;
        setWordCount(words);
    }, [essay]);

    useEffect(() => {
        if (!isWriting) return;
        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [isWriting]);

    const startWriting = () => {
        const selectedTopic = customTopic.trim() || topic;
        if (!selectedTopic) return alert('Please select or enter a topic');
        setTopic(selectedTopic);
        setTimeRemaining(timeLimit * 60);
        setIsWriting(true);
        setEssay('');
    };

    const handleFinish = () => {
        clearInterval(timerRef.current);
        setIsWriting(false);

        if (essay.trim()) {
            const entry = {
                id: Date.now(),
                topic,
                essay,
                wordCount,
                timeSpent: timeLimit * 60 - timeRemaining,
                date: new Date().toLocaleDateString()
            };
            const updated = [entry, ...savedEssays].slice(0, 20);
            setSavedEssays(updated);
            localStorage.setItem('savedEssays', JSON.stringify(updated));
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const randomTopic = () => {
        const random = ESSAY_TOPICS[Math.floor(Math.random() * ESSAY_TOPICS.length)];
        setTopic(random);
        setCustomTopic('');
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-main">
                {!isWriting ? (
                    <div className="essay-setup animate-fadeInUp">
                        <div className="essay-hero">
                            <h1>✍️ Essay Practice</h1>
                            <p>Improve your writing skills with timed essay practice sessions</p>
                        </div>

                        <div className="essay-config card">
                            <h2>Choose a Topic</h2>
                            <div className="topic-list">
                                {ESSAY_TOPICS.map((t, i) => (
                                    <button key={i} className={`topic-chip ${topic === t ? 'active' : ''}`}
                                        onClick={() => { setTopic(t); setCustomTopic(''); }}>
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <button className="btn btn-ghost btn-sm" onClick={randomTopic} style={{ marginTop: 12 }}>
                                🎲 Random Topic
                            </button>

                            <div className="form-group" style={{ marginTop: 20 }}>
                                <label>Or enter a custom topic:</label>
                                <input className="form-input" placeholder="Enter your own topic..."
                                    value={customTopic} onChange={e => { setCustomTopic(e.target.value); setTopic(''); }} />
                            </div>

                            <div className="form-group">
                                <label>Time Limit (minutes)</label>
                                <select className="form-input" value={timeLimit} onChange={e => setTimeLimit(parseInt(e.target.value))}>
                                    <option value={15}>15 minutes</option>
                                    <option value={20}>20 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>60 minutes</option>
                                </select>
                            </div>

                            <button className="btn btn-primary btn-lg" onClick={startWriting} style={{ marginTop: 8 }}>
                                🚀 Start Writing
                            </button>
                        </div>

                        {/* Saved Essays */}
                        {savedEssays.length > 0 && (
                            <div className="saved-essays card" style={{ marginTop: 24 }}>
                                <h2>📚 Previous Essays</h2>
                                {savedEssays.map((entry) => (
                                    <div key={entry.id} className="saved-essay-item">
                                        <div className="saved-essay-info">
                                            <h4>{entry.topic}</h4>
                                            <div className="saved-meta">
                                                <span>{entry.wordCount} words</span>
                                                <span>•</span>
                                                <span>{Math.floor(entry.timeSpent / 60)}m {entry.timeSpent % 60}s</span>
                                                <span>•</span>
                                                <span>{entry.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="essay-writing animate-fadeIn">
                        <div className="essay-writing-header">
                            <div>
                                <h2>{topic}</h2>
                                <div className="essay-stats">
                                    <span className="badge badge-primary">{wordCount} words</span>
                                    <span className={`essay-timer ${timeRemaining < 300 ? 'timer-low' : ''}`}>
                                        ⏱️ {formatTime(timeRemaining)}
                                    </span>
                                </div>
                            </div>
                            <button className="btn btn-success" onClick={handleFinish}>✓ Finish</button>
                        </div>

                        <textarea
                            className="essay-textarea"
                            placeholder="Start writing your essay here..."
                            value={essay}
                            onChange={e => setEssay(e.target.value)}
                            autoFocus
                        />

                        <div className="essay-footer">
                            <span>{wordCount} words • {essay.length} characters</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
