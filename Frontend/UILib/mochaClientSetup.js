import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import dirtyChai from 'dirty-chai';
import { JSDOM } from 'jsdom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

function configureChai() {
  chai.use(chaiEnzyme());
  chai.use(sinonChai);
  chai.use(dirtyChai);
}

function configureGlobals() {
  // pretendToBeVisual -- gives us requestAnimationFrame
  const dom = new JSDOM('', { pretendToBeVisual: true });

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = { userAgent: 'node.js' };
}

configureChai();
configureGlobals();
