var ke = require('../kor.events');

describe('argument-based subscriptions', function()
{
    beforeEach(function()
    {
        ke.clearAll();
    });

    it('should pass through options correctly', function()
    {
        var value;

        ke.listen({
            verb: 'pass-test',
            callback: function(options)
            {
                value = (options.args || {}).testArg;
            }
        });

        ke.fire({
            verb: 'pass-test'
        });

        expect(value).toBeUndefined();

        ke.fire({
            verb: 'pass-test',
            args: {
                testArg: true
            }
        });

        expect(value).toBeTruthy();
    });

    it('should filter events based on provided arguments', function()
    {
        var correctValueFlag = false;
        var incorrectValueFlag = false;

        ke.listen({
            verb: 'basic-arg-test',
            args: {
                someArg: 'someValue'
            },
            callback: function()
            {
                correctValueFlag = true;
            }
        });

        ke.listen({
            verb: 'basic-arg-test',
            args: {
                someArg: 'someOtherValue'
            },
            callback: function()
            {
                incorrectValueFlag = true;
            }
        });

        ke.fire({
            verb: 'basic-arg-test',
            args: {
                someArg: 'someValue'
            }
        });

        expect(correctValueFlag).toBeTruthy();
        expect(incorrectValueFlag).toBeFalsy();
    });
});

