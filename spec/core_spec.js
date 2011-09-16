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
            verb: 'test-event',
            callback: function()
            {
                flag = true;
            }
        });

        expect(flag).toBeFalsy();

        ke.fire({
            verb: 'test-event' 
        });

        expect(flag).toBeTruthy();
    });
});

