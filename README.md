## a11ySuite

Performs accessibility test using [axe-core](https://github.com/dequelabs/axe-core).

It accepts a template string from which a fixture is created or already created element. The later option is useful to perform accessibility test for the element at certain state.

Rules can be ignored by providing configuration option which accepts array of rule names to ignore.

> This is temporary package until `@open-wc` implement similar functionality in their testing package.

## Usage

### Installation
```sh
npm install --save-dev @advanced-rest-client/a11y-suite
```

### Running the tests

```js
import { a11ySuite } from '@advanced-rest-client/a11y-suite/index.js';
import { fixture } from '@open-wc/testing';

const fix = await fixture(`<div role="listbox">
  <my-component>item</my-component>
  </div>`);

describe('<my-component>', () => {
  a11ySuite('Normal state', fix);
  a11ySuite('Disabled state', `<div role="listbox"><my-component disabled>item</my-component></div>`);
  a11ySuite('This passes error in axa', `<div aria-labelledby="non-existing-id"></div><label id="my-id">Title</label>`, ['badAriaAttributeValue']);
});
```

### Ignoring rules

The test below passes even though it is invalid because the rule testing for valid aria attributes is disabled.

```js
describe('<my-component>', () => {
  await a11ySuite('Test Suite', '<div aria-labelledby="test-x"></div>', {
    ignoredRules: ['aria-valid-attr-value']
  });
});
```

### Manipulating component's state before test

You can change the state of the component by creating a fixture before passing it to the suite or by passing `afterFixture` callback function that is invoked when fixture is created but before the test is performed.

#### Direct state manipulation

```js
import { a11ySuite } from '@advanced-rest-client/a11y-suite/index.js';
import { fixture, aTimeout } from '@open-wc/testing';

describe('<my-component>', () => {
  let element;
  before(async () => {
    element = await fixture(`<my-dialog>
      <h1>Dialog</h1>
    </my-dialog>`);
  });

  it('Passes a11y when opened', async () => {
    element.opened = true;
    async aTimeout();
    await a11ySuite('Opened dialog', element);
  });
});
```

#### afterFixture callback

If `afterFixture` returns a promise then the test is executed when the promise is resolved.

```js
import { a11ySuite } from '@advanced-rest-client/a11y-suite/index.js';
import { fixture, aTimeout } from '@open-wc/testing';

describe('<my-component>', () => {
  it('Passes a11y when opened', async () => {
    await a11ySuite('Opened dialog', `<my-dialog><h1>Dialog</h1></my-dialog>`, {
      afterFixture: async (element) => {
        element.opened = true;
        async aTimeout();
      }
    });
  });
});
```

## Development

```sh
git clone https://github.com/advanced-rest-client/a11y-suite
cd a11y-suite
npm install
```

## Running the tests
```sh
npm test
```
