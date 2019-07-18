import { fixture } from '@open-wc/testing';
/* global Mocha, axe */
const Test = Mocha.Test;
const Suite = Mocha.Suite;
/**
 * Performs the test using AXE core.
 * @param {Element} element The element to be used to perform the test on.
 * @param {Object} opts AXE configuration options.
 * @return {Promise} Promise resolved to the test results object
 */
function runTestAsync(element, opts) {
  return new Promise((resolve, reject) => {
    axe.run(element, opts, (err, results) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(results);
      }
    });
  });
}
/**
 * Adds a test to a suite.
 * @param {String} type Result type, used as the test name prefix.
 * @param {Object} suite Test suite reference.
 * @param {Object} result Single AXE test result object
 */
function addTest(type, suite, result) {
  const title = `${type}: ${result.id} - ${result.description}`;
  const test = new Test(title, function() {
    const error = type === 'Violation' ? result.help + '\n' + result.helpUrl : null;
    if (error) {
      throw new Error(error);
    }
  });
  if (type === 'N/A') {
    // Not sure if that's the right approach but the test is not OK, not FAIL.
    test.pending = true;
  }
  suite.addTest(test);
}
/**
 * Creates test result for a test group. Axe core returns 4 groups of test results:
 * passes, violations, incomplete, and inapplicable. The `type` is a title added to
 * the test name.
 * @param {String} type Result type, used as the test name prefix.
 * @param {Array<Object>} results List of test results for each applicable rule.
 * @param {Object} suite Test suite reference.
 */
function addTestResult(type, results, suite) {
  if (!results.length) {
    return;
  }
  for (let i = 0, len = results.length; i < len; i++) {
    const result = results[i];
    addTest(type, suite, result);
  }
}
/**
 * Creates a map of rules to disable during the test.
 * @param {Array<String>?} ignored List of rule names to ignore during the test.
 * @return {Object|undefined} List of rules to be passed to test configuration or
 * `undefined` when not needed.
 */
function getRules(ignored) {
  if (!ignored || !ignored.length) {
    return;
  }
  const result = {};
  ignored.forEach((rule) => {
    result[rule] = { enabled: false };
  });
  return result;
}

/**
 * Runs accessibility audits for web components.
 *
 * @param {String} id Suite id
 * @param {String|Element} html Fixture template string or created element.
 * @param {Object?} opts Test configuration options:
 * - {Boolean} printNa When set it prints N/A (inapplicable) tests with other results.
 * - {Function} afterFixture A function to be called after the fixture has been created.
 * The only argument of the callback function has the constructed element itself.
 * If the function returns a Promise it waits until the promise is resolved.
 * - {Array<String>} ignoredRules - A list of rule names to ignore.
 */
export async function a11ySuite(id, html, opts) {
  opts = opts || {};
  const element = html instanceof HTMLElement ? html : await fixture(html);
  if (typeof opts.afterFixture === 'function') {
    try {
      await opts.afterFixture(element);
    } catch (_) {}
  }
  const rules = getRules(opts.ignoredRules);
  const mInstancwe = new Mocha();
  const suiteInstance = Suite.create(mocha.suite, 'A11y Audit: ' + id);
  axe.configure({
    branding: {
      brand: 'open-wc',
      application: 'a11y-suite'
    },
    reporter: 'v2'
  });
  const testOpts = {
    resultTypes: ['passes', 'violations', 'incomplete']
  };
  if (opts.printNa) {
    testOpts.resultTypes.push('inapplicable');
  }
  if (rules) {
    testOpts.rules = rules;
  }
  const result = await runTestAsync(element.parentNode, testOpts);
  const { violations, passes, inapplicable, incomplete } = result;
  addTestResult('Violation', violations, suiteInstance);
  addTestResult('Passed', passes, suiteInstance);
  addTestResult('Incomplete', incomplete, suiteInstance);
  if (opts.printNa) {
    addTestResult('N/A', inapplicable, suiteInstance);
  }
  mInstancwe.run();
}
