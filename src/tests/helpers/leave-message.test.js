import addWindowLeaveMessage from '../../helpers/leave-message';
import assert from 'assert';

describe('when the user attempts to leave', () => {
  it('shows no dialog if no notes', () => {
    let mockWindow = {};

    addWindowLeaveMessage({ state: { notes: [] } }, mockWindow);

    const action = mockWindow.onbeforeunload();

    assert.equal(action, undefined);
  });

  it('shows dialog if notes', () => {
    let mockWindow = {};

    addWindowLeaveMessage({ state: { notes: [{}] } }, mockWindow);

    const action = mockWindow.onbeforeunload();

    assert.equal(action, 'Are syou sure you want to leave?');
  });
});
