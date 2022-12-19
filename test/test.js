import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Clean installation', () => {
    it('Project structure', () => {
        expect('test').eql('test');
    });
});
