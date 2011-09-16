var ke = require('../kor.events');

describe('basic listening and firing', function()
{
    beforeEach(function()
    {
        ke.clearAll();
    });

    it('should pass through options correctly', function()
    {
        var value;

        ke.listen({
            verb: 'test-event2',
            callback: function(options)
            {
                value = (options.args || {}).testArg;
            }
        });

        ke.fire({
            verb: 'test-event2'
        });

        expect(value).toBeUndefined();

        ke.fire({
            verb: 'test-event2',
            args: {
                testArg: true
            }
        });

        expect(value).toBeTruthy();
    });
});

