var ke = require('../kor.events');

describe('basic listening and firing', function()
{
    beforeEach(function()
    {
        ke.clearAll();
    });

    it('should listen and fire a simple verb successfully', function()
    {
        var flag = false;

        ke.listen({
            verb: 'hit-test',
            callback: function()
            {
                flag = true;
            }
        });

        expect(flag).toBeFalsy();

        ke.fire({
            verb: 'hit-test' 
        });

        expect(flag).toBeTruthy();
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

    it('should not fire if it is not listening to the verb', function()
    {
        var flag = false;

        ke.listen({
            verb: 'miss-test',
            callback: function()
            {
                flag = true;
            }
        });

        ke.fire({
            verb: 'hit-test'
        });

        expect(flag).toBeFalsy();
    });

});

