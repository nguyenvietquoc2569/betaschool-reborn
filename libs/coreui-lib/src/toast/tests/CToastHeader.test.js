import React from 'react'
import { configure, mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import renderer from 'react-test-renderer';

import CToastHeader from '../CToastHeader'

configure({ adapter: new Adapter() })

describe('CToastHeader', () => {
  it('renders basic wrapper correctly', () => {
    const component = renderer.create(<CToastHeader/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot()
  })
  it('renders customized wrapper correctly', () => {
    const componentCustomized = renderer.create(
      <CToastHeader
        className='class-name'
        closeButton
      >
        CToastHeader
      </CToastHeader>
    );
    let tree = componentCustomized.toJSON();
    expect(tree).toMatchSnapshot()
  })
})
