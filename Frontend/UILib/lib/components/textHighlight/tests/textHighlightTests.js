import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import TextHighlight from '../textHighlight';

describe('TextHighlight', () => {
  it('should not alter text content', () => {
    const wrapper = mount(<TextHighlight highlight="bar">foobar and more bare</TextHighlight>);

    expect(wrapper.text()).to.equal('foobar and more bare');
  });

  it('should not highlight anything for empty input', () => {
    const wrapper = mount(<TextHighlight highlight="">foobar with bar and more</TextHighlight>);

    expect(wrapper.find('.text-highlight__fragment')).to.not.exist();
    expect(wrapper.text()).to.equal('foobar with bar and more');
  });

  it('should highlight all matches', () => {
    const wrapper = mount(<TextHighlight highlight="bar">foobar with bar and more</TextHighlight>);

    const textFragments = wrapper.find('.text-highlight__fragment').map(n => n.text());
    expect(textFragments).to.have.length(2);
    expect(textFragments).to.deep.equal(['bar', 'bar']);
  });

  it('should highlight case insensitive', () => {
    const wrapper = mount(<TextHighlight highlight="bar">foobar with Bar</TextHighlight>);

    const textFragments = wrapper.find('.text-highlight__fragment').map(n => n.text());
    expect(textFragments).to.have.length(2);
    expect(textFragments).to.deep.equal(['bar', 'Bar']);
  });

  it('should use render prop if provided', () => {
    const wrapper = mount(<TextHighlight highlight="bar" renderHighlight={(fragment, highlightProps) => <article {...highlightProps}>{fragment}</article>}>foobar with Bar</TextHighlight>);

    const textFragments = wrapper.find('article').map(n => n.text());
    expect(textFragments).to.have.length(2);
    expect(textFragments).to.deep.equal(['bar', 'Bar']);
  });
});
