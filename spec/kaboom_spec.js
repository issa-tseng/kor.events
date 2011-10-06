var ke = require('../kor.events');

describe('making things go away', function()
{
    beforeEach(function()
    {
        ke.unlistenAll();
    });

    it('should unlisten all events when told to', function()
    {
        var flagA = false;
        var flagB = false;

        var subject = {};

        ke.listen({
            verb: 'event-a',
            callback: function()
            {
                flagA = true;
            }
        });

        ke.listen({
            verb: 'event-b',
            subject: subject,
            callback: function()
            {
                flagB = true;
            }
        });

        ke.unlistenAll();

        ke.fire({
            verb: 'event-a'
        });
        ke.fire({
            verb: 'event-b',
            subject: subject
        });

        expect(flagA).toBeFalsy();
        expect(flagB).toBeFalsy();
    });

    it('should fire the derez event correctly', function()
    {
        var flag = false;

        var subject = {};

        ke.listen({
            verb: 'derez',
            subject: subject,
            callback: function()
            {
                flag = true;
            }
        });

        expect(ke.derez(subject)).toBeTruthy();
        expect(flag).toBeTruthy();
    });

    it('should remove subject registrations on derez', function()
    {
        var flag = false;

        var subject = {};

        ke.listen({
            verb: 'test-event',
            subject: subject,
            callback: function()
            {
                flag = true;
            }
        });

        ke.derez(subject);

        ke.fire({
            verb: 'test-event',
            subject: subject
        });

        expect(flag).toBeFalsy();
    });

    it('should unlisten to a verb-based event properly', function()
    {
        var flag = false;

        var id = ke.listen({
            verb: 'unlisten-verb',
            callback: function()
            {
                flag = true;
            }
        });

        ke.unlisten(id);

        ke.fire({
            verb: 'unlisten-verb'
        });

        expect(flag).toBeFalsy();
    });

    it('should unlisten to a subject-based event properly', function()
    {
        var flag = false;
        var subject = {};

        var id = ke.listen({
            verb: 'unlisten-subject',
            subject: subject,
            callback: function()
            {
                flag = true;
            }
        });

        ke.unlisten(id);

        ke.fire({
            verb: 'unlisten-subject',
            subject: subject
        });

        expect(flag).toBeFalsy();
    });

    it('should unlisten to a argument-based event properly', function()
    {
        var flag = false;

        var id = ke.listen({
            verb: 'unlisten-arg',
            args: {
              someArg: 'someValue'
            },
            callback: function()
            {
                flag = true;
            }
        });

        ke.unlisten(id);

        ke.fire({
            verb: 'unlisten-arg',
            args: {
                someArg: 'someValue'
            }
        });

        expect(flag).toBeFalsy();
    });
});

