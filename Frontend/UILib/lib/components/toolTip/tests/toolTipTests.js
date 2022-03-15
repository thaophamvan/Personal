import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Tooltip from './../toolTip';

describe('Tooltip', () => {
  it('should be shown when rendered', () => {
    const toolTip = mount((
      <Tooltip>
        Hello, im visible!
      </Tooltip>
    ));

    expect(toolTip.find('.klara-ui-tooltip')).to.exist();
  });
});
