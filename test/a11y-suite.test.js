import { a11ySuite } from '../';
import { fixture, assert } from '@open-wc/testing';

describe('a11ySuite', () => {
  it('Performs the test', async () => {
    await a11ySuite('Test Suite', `<div></div>`);
  });

  it('Performs accessibility test', async () => {
    await a11ySuite('Test Suite', `<div aria-labelledby="test-x"></div><label id="test-x"></label>`);
  });

  it('Assepts element as an input', async () => {
    const element = await fixture('<div></div>');
    await a11ySuite('Test Suite', element);
  });

  it('Assepts ignored rules list', async () => {
    await a11ySuite('Test Suite', '<div aria-labelledby="test-x"></div>', {
      ignoredRules: ['aria-valid-attr-value']
    });
  });

  it('Prints inapplicable rules ', async () => {
    await a11ySuite('Test Suite', '<div></div>', {
      printNa: true
    });
  });

  it('Calls afterFixture callback function', async () => {
    let arg;
    const afterFixture = (element) => {
      arg = element;
    };
    await a11ySuite('Test Suite', '<div></div>', {
      afterFixture
    });
    assert.equal(arg.nodeName, 'DIV');
  });
});
