import { useState, useEffect } from 'react';

const generateNumbers = () => {
  const numbers = Array.from({ length: 100 }, (_, i) => i);
  return numbers.sort(() => Math.random() - 0.5); // Shuffle numbers 0-99
};

export default function Home() {
  const [intervalSecs, setIntervalSecs] = useState(100); // Default interval
  const [currentNumber, setCurrentNumber] = useState<any>(null); // Initialize as null to handle the start condition
  const [currentIndex, setCurrentIndex] = useState(0); // Keep track of the current index
  const [isPlaying, setIsPlaying] = useState(false);
  const [screen, setScreen] = useState('title'); // 'title' or 'play'
  const [numbers, setNumbers] = useState(generateNumbers()); // Shuffled numbers

  useEffect(() => {
    let intervalId: any;
    if (isPlaying && currentIndex < numbers.length) {
      intervalId = setInterval(() => {
        setCurrentNumber(numbers[currentIndex]);
        setCurrentIndex(currentIndex + 1);
        if (currentIndex >= numbers.length - 1) {
          setIsPlaying(false); // Stop when reaching the last number
        }
      }, intervalSecs);
    }
    return () => clearInterval(intervalId); // Cleanup interval on component unmount or isPlaying change
  }, [isPlaying, currentIndex, numbers, intervalSecs]);

  const handlePlayPauseClick = () => {
    if (currentIndex >= numbers.length) {
      // Reset to start if at the end
      setCurrentIndex(0);
      setCurrentNumber(numbers[0]);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setScreen('play'); // Switch to play screen
    setCurrentIndex(0); // Ensure we start from the beginning
    setCurrentNumber(numbers[0]); // Set the first number to display
  };

  const progressText = `${currentIndex}/${numbers.length}`; // Displayed as x/100

  if (screen === 'title') {
    return (
      <main>
        <h1>Enter Interval (in milliseconds)</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={intervalSecs}
            onChange={(e) => setIntervalSecs(Number(e.target.value))}
            min="100" // Minimum interval set to 100 milliseconds
            max="10000" // Maximum interval set to 10000 milliseconds
            required
          />
          <button type="submit">Start</button>
        </form>
      </main>
    );
  } else {
    return (
      <main>
        <h1>{currentNumber !== null ? String(currentNumber).padStart(2, '0') : '00'}</h1>
        <button onClick={handlePlayPauseClick}>{isPlaying ? 'Pause' : 'Play'}</button>
        <div>
          <label htmlFor="progress">Progress: </label>
          <span id="progress">{progressText}</span>
        </div>
      </main>
    );
  }
}
