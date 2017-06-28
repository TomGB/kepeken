import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import assert from 'assert';
import {mount, render} from 'enzyme'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('app renders the note area', () => {
  const component = mount(<App />);
  assert(component.find('.noteContainer').length);
});
