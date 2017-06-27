exports.copyToClipboard = (text, prompt = prompt) => {
  prompt("Copy to clipboard: Ctrl+C, Enter", text);
}
