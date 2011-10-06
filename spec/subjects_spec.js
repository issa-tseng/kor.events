var ke = require('../kor.events');

describe('subject-based subscriptions', function()
{
    beforeEach(function()
    {
        ke.clearAll();
    });

    it('should be able to subscribe by subject', function()
    {
        var flag = false;

        var subject = {};

        ke.listen({
            verb: 'simple-subjects',
            subject: subject,
            callback: function()
            {
                flag = true;
            }
        });

        ke.fire({
            verb: 'simple-subjects',
            subject: subject
        });

        expect(flag).toBeTruthy();
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

    it('should use data() to store id when it finds a jQuery obj subject', function()
    {
        var id, flag;

        // poor man's jQuery mock
        var subject = {
            jquery: '1.6.1',
            data: function(key, value)
            {
                if (typeof value == 'undefined')
                {
                    return id;
                }
                else
                {
                    id = value;
                    return subject;
                }
            }
        };

        ke.listen({
            verb: 'jquery-subject-test',
            subject: subject,
            callback: function()
            {
                flag = true;
            }
        });

        expect(id).toBeDefined();

        ke.fire({
            verb: 'jquery-subject-test',
            subject: subject
        });

        expect(flag).toBeTruthy();
    });

    it('should allow override of kor events subject key', function()
    {
        var flag;
        var subject = {};

        ke.key = 'test_key';

        ke.listen({
            verb: 'key-test',
            subject: subject,
            callback: function()
            {
                flag = true;
            }
        });

        expect(subject.test_key).toBeDefined();

        ke.fire({
            verb: 'key-test',
            subject: subject
        });

        expect(flag).toBeTruthy();
    });
});

