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

    it('should handle subscribing to two subjects correctly given the same verb', function()
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

    it('should handle subscribing to a subject correctly given different verbs', function()
    {
        var isListeningFlag = false;
        var isNotListeningFlag = false;

        var subject = {};

        ke.listen({
            verb: 'something-useful',
            subject: subject,
            callback: function()
            {
                isListeningFlag = true;
            }
        });

        ke.listen({
            verb: 'something-crazy',
            subject: subject,
            callback: function()
            {
                isNotListeningFlag = true;
            }
        });

        ke.fire({
            verb: 'something-useful',
            subject: subject
        });

        expect(isListeningFlag).toBeTruthy();
        expect(isNotListeningFlag).toBeFalsy();
    });

    it('should handle a subject and not correctly given a verb', function()
    {
        var subjectListenerFlag = false;
        var verbListenerFlag = false;

        var subject = {};

        ke.listen({
            verb: 'unity-test',
            subject: subject,
            callback: function()
            {
                subjectListenerFlag = true;
            }
        });

        ke.listen({
            verb: 'unity-test',
            callback: function()
            {
                verbListenerFlag = true;
            }
        });

        ke.fire({
            verb: 'unity-test',
            subject: subject
        });

        expect(subjectListenerFlag).toBeTruthy();
        expect(verbListenerFlag).toBeTruthy();
    });
});

