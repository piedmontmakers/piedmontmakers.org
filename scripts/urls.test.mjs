import assert from 'node:assert/strict';
import test from 'node:test';
import { withBase } from '../src/lib/urls.ts';
test('resolves internal links in apex and subpath builds without double prefixes', () => {
  assert.equal(withBase('/robotics', '/'), '/robotics');
  assert.equal(withBase('img/logo.png', '/piedmontmakers.org/'), '/piedmontmakers.org/img/logo.png');
  assert.equal(withBase('/piedmontmakers.org/robotics', '/piedmontmakers.org/'), '/piedmontmakers.org/robotics');
});
test('preserves external, email, and same-page links', () => {
  for (const value of ['https://example.org/path','//example.org/image','mailto:hello@example.org','#newsletter']) {
    assert.equal(withBase(value, '/piedmontmakers.org/'), value);
  }
});
