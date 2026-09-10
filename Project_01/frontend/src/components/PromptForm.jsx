export default function PromptForm({ prompt, onPromptChange, onSubmit, isLoading }) {
  function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit();
  }

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <label className="prompt-label" htmlFor="prompt-input">
        What do you want to study?
      </label>
      <div className="prompt-row">
        <input
          id="prompt-input"
          type="text"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="e.g. Photosynthesis, the French Revolution, Big-O notation"
          disabled={isLoading}
          autoComplete="off"
        />
        <button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? "Generating…" : "Generate flashcards"}
        </button>
      </div>
    </form>
  );
}
