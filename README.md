## a11ySuite

Performs accessibility test using [accessibility-developer-tools](https://www.npmjs.com/package/accessibility-developer-tools).

It accepts a template string from which a fixture is created or already created element. The later option is useful to perform accessibility test for the element at certain state.

Rules can be ignored by providing 3rd argument which accepts array of rule names to ignore.

This is temporary package until `@open-wc` implement similar functionality in their testing package.

## Usage

### Installation
```sh
npm install --save-dev @advanced-rest-client/a11y-suite
```

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
### Development

```sh
git clone https://github.com/advanced-rest-client/a11y-suite
cd a11y-suite
npm install
```

### Running the tests
```sh
npm test
```
