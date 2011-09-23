var ke = require('../kor.events');

describe('basic control flow', function()
{
    beforeEach(function()
    {
        ke.clearAll();
    });

    it('should not break if no listeners have appeared', function()
    {
        expect(function()
        {
            ke.fire({
                verb: 'nobody-home-test'
            });
        }).not.toThrow();
    });

    it('should complain if nothing valid is given to fire on', function()
    {
        expect(function()
        {
            ke.fire();
        }).toThrow('need to provide options to fire on!');

        expect(function()
        {
            ke.fire({});
        }).toThrow('need to provide a verb at minimum!');
    });

    it('should return whether all callbacks fired without complaint', function()
    {
        expect(ke.fire({
            verb: 'empty-verb'
        })).toBeTruthy();

        ke.listen({
            verb: 'non-empty-verb',
            callback: function()
            {
                return false;
            }
        });

        expect(ke.fire({
            verb: 'non-empty-verb'
        })).toBeFalsy();
    });

    it('should halt the call chain if something returns falsy', function()
    {
        var flag = false;

        ke.listen({
            verb: 'chain-test',
            callback: function()
            {
                return false;
            }
        });

        ke.listen({
            verb: 'chain-test',
            callback: function()
            {
                flag = true;
            }
        });

        ke.fire({
            verb: 'chain-test'
        });

        expect(flag).toBeFalsy();
    });
});

