import React from 'react';
import renderer from 'react-test-renderer';
import ApartmentItem from "../../../src/components/ApartmentItem";

test('apartment gets rendered', () => {
  const testApartment = {
    name: 'Test Flat',
    description: 'Bright flat in the center',
    price: 140,
    isAvailable: true,
    rooms: 4,
    realtor: 'John Doe',
    date: new Date(),
  }
  const component = renderer.create(<ApartmentItem apartment={testApartment} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('apartment with different values', () => {
  const testApartment = {
    name: 'House with a view',
    description: 'Panoramic views from this mansion',
    price: 800,
    isAvailable: false,
    rooms: 5,
    realtor: 'Jane Doe',
    date: new Date(),
  }
  const component = renderer.create(<ApartmentItem apartment={testApartment} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
