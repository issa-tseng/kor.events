/*
 * kor.events - criteria-based events microframework.
 *  clint tseng (clint@dontexplain.com) - 2011-06-30
 *   Licensed under the WTFPL (http://sam.zoy.org/wtfpl). Do what
 *   you want, but please do let me know what you think.
 */

;(function()
{
// internal data structures
    var byVerb = {},
        bySubject = {},
        subjects = {},
        serialId = 0;

// base object and methods
    var korevents = {};

    korevents['listen'] = function(options)
    {
        // pull out everything we might need up front
        var subject = options['subject'],
            verb = options['verb'],
            args = clone(options['args']),
            priority = options['priority'],
            callback = options['callback'];

        // construct our own, in case
        var eventSignature = {
            subject: subject,
            verb: verb,
            priority: priority,
            args: args
        };

        // determine secondary priority (TODO: this iters twice)
        eventSignature['priority2'] = keyCount(args);

        if (isUndefined(subject))
        {
            // add to global verb events registry
            getArrayForKey(byVerb, verb).push(eventSignature);
        }
        else
        {
            // add to subject-specific events registry
            var subjectKey = getSubjectKey(subject);
            isUndefined(bySubject[subjectKey]) &&
                (bySubject[subjectKey] = {});
            getArrayForKey(bySubject[subjectKey], verb).push(eventSignature);
        }
    };

    var fire = korevents['fire'] = function(options)
    {
        var subject = options['subject'],
            verb = options['verb'],
            args = options['args'];
    };

    korevents['derez'] = function(options)
    {
        var subject = options['subject'];
    };

// utility
    var isUndefined = function(obj) { return obj === void 0; };
    var isArray = function(obj) { return toString.call(obj) === '[object Array]'; };

    // counts keys on obj
    var keyCount = function(obj)
    {
        var result = 0;
        for (var key in obj)
            result++;
        return result;
    };

    // shallow copies an obj/array
    var clone = function(obj)
    {
        if (isArray(obj))
            return obj.slice();

        var result = {};
        for (var key in obj)
            result[key] = obj[key];
        return result;
    };

    // creates an array at the key if it does not exist;
    // returns the array whether created or not.
    var getArrayForKey = function(obj, key)
    {
        var result;
        isUndefined(result = obj[key]) &&
            (result = obj[key] = []);
        return result;
    };

    // creates a subject key if it does not exist; returns
    // the key whether created or not.
    var getSubjectKey = function(subject)
    {
        var result;
        isUndefined(result = subject['_kor_events_key']) &&
            (result = subject['_kor_events_key'] = serialId++);
        return result;
    };

// setup!
    var root = this;

    if ((typeof module !== 'undefined') && module['exports'])
    {
        // export to commonjs/node module if we see one, for unit tests
        // (kind of silly to add an events system to nodejs, no?)
        module['exports'] = korevents;
    }
    else
    {
        // otherwise, install ourselves in kor.events in the root namespace
        var kor = root['kor'];
        if (isUndefined(kor))
            root['kor'] = {};

        kor['events'] = korevents;
    }
})();

