1. Turn-based word chain game where players alternate entering valid English words, each starting with the last letter of the previous word.Built in React.js with score tracking and validation.
2. 30-second timer per turn, score deductions for invalid/timeout submissions. Word validation via DictionaryAPI + structural checks (4+ letters, no repeats), Auto-switch players, word history display, and real-time error feedback.
3. First checks word structure (length, starting letter, duplicates), then verifies via API. Invalid words deduct points and trigger player switch.
4. Uses React hooks (useState, useEffect) for state/timer management. Async API calls for validation, cleanup for memory optimization.
5. Integrate component into React apps, customize styling/rules. Requires internet for API validation; handles errors gracefully.

Live link: https://shiritori-game-two.vercel.app/

