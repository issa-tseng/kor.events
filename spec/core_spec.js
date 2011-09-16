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

    it('should handle subscribing to a subject correctly given the same verb', function()
    {
        var isListeningFlag = false;
        var isNotListeningFlag = false;

        var subject = {};
        var subject2 = {};

        ke.listen({
            verb: 'subject-test',
            subject: subject,
            callback: function()
            {
                isListeningFlag = true;
            }
        });

        ke.listen({
            verb: 'subject-test',
            subject: subject2,
            callback: function()
            {
                isNotListeningFlag = true;
            }
        });

        ke.fire({
            verb: 'subject-test',
            subject: subject
        });

        expect(isListeningFlag).toBeTruthy();
        expect(isNotListeningFlag).toBeFalsy();
    });
});

