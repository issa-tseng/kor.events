var ke = require('../kor.events');

describe('verb-based events', function()
{
    beforeEach(function()
    {
        ke.unlistenAll();
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

