exports.copyToClipboard = (text, userPrompt = prompt) => {
  userPrompt("Copy to clipboard: Ctrl+C, Enter", text);
}
