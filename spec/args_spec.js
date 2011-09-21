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

    it('should filter on only registered arguments', function()
    {
        var correctValueFlag = false;
        var incorrectValueFlag = false;

        ke.listen({
            verb: 'multi-arg-test',
            args: {
                argA: 'someValue',
                argB: 'someOtherValue'
            },
            callback: function()
            {
                correctValueFlag = true;
            }
        });

        ke.listen({
            verb: 'multi-arg-test',
            args: {
                argA: 'someValue',
                argB: 'someOtherValue',
                argC: 'someThirdValue'
            },
            callback: function()
            {
                incorrectValueFlag = true;
            }
        });

        ke.fire({
            verb: 'multi-arg-test',
            args: {
                argA: 'someValue',
                argB: 'someOtherValue',
                argC: 'notAThirdValue'
            }
        });

        expect(correctValueFlag).toBeTruthy();
        expect(incorrectValueFlag).toBeFalsy();
    });

    it('should filter on all registered arguments', function()
    {
        var flag = false;

        ke.listen({
            verb: 'all-arg-test',
            args: {
                argA: 'someValue',
                argB: 'someOtherValue'
            },
            callback: function()
            {
                flag = true;
            }
        });

        ke.fire({
            verb: 'all-arg-test'
        });

        expect(flag).toBeFalsy();

        ke.fire({
            verb: 'all-arg-test',
            args: {
                argA: 'someValue'
            }
        });

        expect(flag).toBeFalsy();
    });

    it('should account for both subjects and arguments', function()
    {
        var correctSubjectFlag = false;
        var incorrectSubjectFlag = false;

        var subjectA = {};
        var subjectB = {};

        ke.listen({
            verb: 'subject-arg-test',
            subject: subjectA,
            args: {
                argA: 'someValue'
            },
            callback: function()
            {
                correctSubjectFlag = true;
            }
        });

        ke.listen({
            verb: 'subject-arg-test',
            subject: subjectB,
            args: {
                argA: 'someValue'
            },
            callback: function()
            {
                incorrectSubjectFlag = true;
            }
        });

        ke.fire({
            verb: 'subject-arg-test',
            subject: subjectA,
            args: {
                argA: 'someValue'
            }
        });

        expect(correctSubjectFlag).toBeTruthy();
        expect(incorrectSubjectFlag).toBeFalsy();
    });
});

