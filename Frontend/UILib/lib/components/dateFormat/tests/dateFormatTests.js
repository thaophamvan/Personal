/* eslint-disable no-mixed-operators */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import DateFormat from '../dateFormat';

const time = require('../time');

const now = 1516627620000; // 2018-01-22 14:27.00 UTC+1

describe('DateFormat', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers({ now });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should render a basic date format if only the input is set', () => {
    expect(mount(<DateFormat input={now - 2 * time.day} />).text()).to.equal('20 jan');
    expect(mount(<DateFormat input={now + 3 * time.month} />).text()).to.equal('22 apr');
  });

  it('should render with the year if needed', () => {
    expect(mount(<DateFormat input={now - 2 * time.year} />).text()).to.contain('2 feb 2016');
    expect(mount(<DateFormat input={now + 5 * time.year} />).text()).to.equal('27 dec 2022');
  });

  it('should render with the time if withTime is set', () => {
    expect(mount(<DateFormat withTime input={now - 2 * time.day} />).text()).to.equal('20 jan 14.27');
    expect(mount(<DateFormat withTime input={now + 3 * time.week} />).text()).to.equal('12 feb 14.27');
  });

  it('should render a longer format if longFormat is set', () => {
    expect(mount(<DateFormat input={now - 2 * time.day} longFormat />).text()).to.equal('20 januari');
    expect(mount(<DateFormat input={now + 2 * time.year} longFormat />).text()).to.equal('12 januari 2020');
    expect(mount(<DateFormat input={now - 1 * time.week} longFormat withTime />).text()).to.equal('15 januari 14.27');
  });

  it('should render with weekday if withWeekday is set', () => {
    expect(mount(<DateFormat input={now - 5 * time.day} withWeekday />).text()).to.equal('tor 17 jan');
    expect(mount(<DateFormat input={now - 7 * time.day} withWeekday longFormat />).text()).to.equal('tisdag 15 januari');
  });

  it('should render with "igår", "idag", och "imorgon" instead of the dates', () => {
    expect(mount(<DateFormat input={now - 2 * time.hour} withTime />).text()).to.equal('idag 12.27');
    expect(mount(<DateFormat input={now - 1 * time.day} withTime />).text()).to.equal('igår 14.27');
    expect(mount(<DateFormat input={now + 1 * time.day} withTime />).text()).to.equal('imorgon 14.27');
  });

  it('should render using the render prop', () => {
    const wrap = mount(<DateFormat input={now} render={date => <button>{date}</button>} />);

    expect(wrap.find('button')).to.be.present();
  });

  describe('Relative Dates', () => {
    it('should consider timestamps within 10 seconds as "now"', () => {
      expect(mount(<DateFormat input={now + 5 * time.second} relative />).text()).to.equal('alldeles nyss');
      expect(mount(<DateFormat input={now - 9 * time.second} relative />).text()).to.equal('alldeles nyss');
    });

    describe('Past Timestamps', () => {
      it('should render anything less than an hour ago with minute precision', () => {
        expect(mount(<DateFormat input={now - 3 * time.minute} relative />).text()).to.equal('3 minuter sedan');
        expect(mount(<DateFormat input={now - 43 * time.minute} relative />).text()).to.equal('43 minuter sedan');
        expect(mount(<DateFormat input={now - 59 * time.minute} relative />).text()).to.equal('59 minuter sedan');
      });

      it('should render anything from 1 to 23 hours ago, while within the same day, with hour precision', () => {
        expect(mount(<DateFormat input={now - 2 * time.hour} relative />).text()).to.equal('2 timmar sedan');
        expect(mount(<DateFormat input={now - 10 * time.hour} relative />).text()).to.equal('10 timmar sedan');
        expect(mount(<DateFormat input={now - 15 * time.hour} relative />).text()).to.equal('igår');
      });
    });

    describe('Future Timestamps', () => {
      it('should render anything within an hour with minute precision', () => {
        expect(mount(<DateFormat input={now + 3 * time.minute} relative />).text()).to.equal('om 3 minuter');
        expect(mount(<DateFormat input={now + 43 * time.minute} relative />).text()).to.equal('om 43 minuter');
        expect(mount(<DateFormat input={now + 59 * time.minute} relative />).text()).to.equal('om 59 minuter');
      });

      it('should render anything within 1 to 23 hours, while within the same day, with hour precision', () => {
        expect(mount(<DateFormat input={now + 1 * time.hour} relative />).text()).to.equal('om 1 timmar');
        expect(mount(<DateFormat input={now + 8.5 * time.hour} relative />).text()).to.equal('om 8 timmar');
        expect(mount(<DateFormat input={now + 15 * time.hour} relative />).text()).to.equal('imorgon');
      });
    });

    describe('Live Updates', () => {
      it('should not be live updating by default', () => {
        const wrapper = mount(<DateFormat input={now - 20 * time.second} relative />);

        expect(wrapper.text()).to.equal('20 sekunder sedan');

        clock.tick(10000);

        expect(wrapper.text()).to.equal('20 sekunder sedan');
      });

      it('should update automatically if autoUpdate is set', () => {
        const wrapper = mount(<DateFormat input={now - 20 * time.second} relative autoUpdate />);

        expect(wrapper.text()).to.equal('20 sekunder sedan');

        clock.tick(10000);

        expect(wrapper.text()).to.equal('30 sekunder sedan');

        clock.tick(120000);

        expect(wrapper.text()).to.equal('2 minuter sedan');
      });
    });

    describe('Format through a staic method', () => {
      it('should render a normal value on the defined format', () => {
        expect(DateFormat.format(now, now + 3 * time.day)).to.equal('25 jan');
      });

      it('should render a relative value if that option is specified', () => {
        expect(DateFormat.format(now, now + 1 * time.day, { relative: true })).to.equal('imorgon');
        expect(DateFormat.format(now, now + 3 * time.minute, { relative: true })).to.equal('om 3 minuter');
        expect(DateFormat.format(now, now + 3 * time.minute, { relative: true })).to.equal('om 3 minuter');
      });
    });
  });
});
