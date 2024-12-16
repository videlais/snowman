import { expect } from 'chai';
import either from '../../lib/Misc/either.js';

describe('#either()', function() {

    it('Should return nothing when given nothing', function() {
        expect(either()).to.equal();
    });

    it('Should non-Array single value', function() {
        expect(either(1)).to.equal(1);
    });

    it('Should return value within single Array', function() {
        expect(either([1])).to.equal(1);
    });

    it('Should return one of the arguments passed to it', function() {
        expect(either("A", "B", "C", "D")).to.be.an('string');
    });

    it('Should return one of the arguments passed to it with arrays', function() {
        expect(either("A", "B", "C", "D", ["E", "F"])).to.be.an('string');
    });
});