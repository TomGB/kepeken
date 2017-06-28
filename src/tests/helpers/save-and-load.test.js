import { saveState, loadState } from '../../helpers/save-and-load';
import assert from 'assert';
import { copyToClipboard } from '../../helpers/clipboard';

jest.mock('../../helpers/clipboard', () => ({
  copyToClipboard: jest.fn()
}))

describe('saveState', () => {
  it('calls copyToClipboard', () => {
    saveState({});
    expect(copyToClipboard).toBeCalled();
  });
});

describe('loadState', () => {
  it('reads input from user', () => {
    let promptCalled = false;

    loadState({}, () => {
      promptCalled = true;
    })

    assert(promptCalled);
  });

  it('pass input from user and set state with it', () => {
    const userInput = '{"banana":"apple"}';

    let setState;

    const master = {
      setState: (input) => {setState = input}
    }

    loadState(master, () => {
      return userInput;
    });

    assert.deepEqual(setState, { banana: 'apple' });
  });
});
