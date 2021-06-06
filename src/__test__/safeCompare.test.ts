import { expect } from 'chai';

import { safeCompare } from '../safeCompare';

describe('safe compare', function () {
  it('should return false on different inputs', function () {
    expect(!!safeCompare('asdf', 'rftghe')).to.be.false;
  });

  it('should return false on prefix inputs', function () {
    expect(!!safeCompare('some', 'something')).to.be.false;
  });

  it('should return true on same inputs', function () {
    expect(!!safeCompare('anothersecret', 'anothersecret')).to.be.true;
  });
});
