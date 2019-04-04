import React from 'react';
import AppBar from '../components/AppBar';
import renderer from 'react-test-renderer';

test('Component matches snapshot', () => {
  const component = renderer.create(
    <AppBar></AppBar>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

});
