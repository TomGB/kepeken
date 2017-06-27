import assert from 'assert';
import { copyToClipboard } from '../../helpers/clipboard';

describe('copyToClipboard', () => {
  it('calls copyToClipboard', () => {
    let promptText = false;
    let promptData = false;
    const prompt = (input, data) => {
      promptText = input;
      promptData = data;
    }
    copyToClipboard('{ some json }', prompt);
    assert.equal(promptText, "Copy to clipboard: Ctrl+C, Enter");
    assert.equal(promptData, "{ some json }");
  });
});
