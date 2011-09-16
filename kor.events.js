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
        subjectSerialId = 0,
        eventSerialId = 0;

// base object and methods
    var korevents = {};

    korevents['listen'] = function(options)
    {
        // pull out everything we need multiple times up front
        var subject = options['subject'],
            verb = options['verb'],
            args = options['args'];

        // construct our own event representation, in case
        var id = eventSerialId++,
            eventSignature = {
                's': subject,
                'v': verb,
                'p': options['priority'],
                'a': args,
                'i': id,
                'c': options['callback']
            };

        var targetRegistry;
        if (isUndefined(subject))
            // no subject; just add to the global registry
            targetRegistry = byVerb;
        else
            // add to the subject-specific registry
            targetRegistry = getObjectForKey(bySubject, getSubjectKey(subject));

        var targetRegistryByVerb = getObjectForKey(targetRegistry, verb);

        // go through args; add to global/verb args registry
        if (!isUndefined(args))
            for (var arg in args)
                getObjectForKey(getObjectForKey(targetRegistrybyVerb, 'arg'), arg)[id] = eventSignature;

        // add to global verb events registry
        getObjectForKey(targetRegistryByVerb, 'all')[id] = eventSignature;

        // give them a ticket number
        return id;
    };

    var fire = korevents['fire'] = function(options)
    {
        var subject = options['subject'],
            verb = options['verb'],
            args = options['args'];

        // basic validation
        if (verb == null) // or undef
            throw 'need to provide a verb at minimum!';

        // keep track of what registrations we've already determined won't fire.
        var invalid = {};

        // first, grab the global subscribers to this verb
        var globalRegistry = byVerb[verb] || {};
        var subscribers = getValues(globalRegistry['all']);

        if (!isUndefined(args))
            var argRegistry = getValues(globalRegistry['arg']);

        // next, look at subject subscribers to the verb if necessary
        if (!isUndefined(subject))
        {
            var subjectKey = getSubjectKey(subject);
            var subjectRegistry = (bySubject[subjectKey] || {})[verb];

            if (!isUndefined(subjectRegistry))
            {
                getValues(subjectRegistry['all'], subscribers);

                if (!isUndefined(args))
                    getValues(subjectRegistry['arg'], argRegistry);
            }
        }

        // make sure we have anything to talk about at all
        if (subscribers.length === 0)
            return true;

        // now filter down the possible set to the matched set if necessary
        if (!isUndefined(args))
        {
            for (var arg in args)
            {
                var argValue = args[arg],
                    argSubscribers = argRegistry[arg];

                if (isUndefined(argSubscribers))
                    continue;

                for (var i = 0; i < argSubscribers.length; i++)
                {
                    var subscriber = argSubscribers[i];
                    if (argValue !== subscriber['a'][arg])
                        invalid[subscriber['i']] = true;
                }
            }
        }

        // sort by priority
        subscribers.sort(function(a, b)
        {
            var aPri = a['p'] || keyCount(a['a']),
                bPri = b['p'] || keyCount(b['a']);

            var result;
            if ((result = (aPri - bPri)) !== 0)
                return result;
            return a['i'] - b['i'];
        });

        // call on those that matched the filter
        for (var i = 0; i < subscribers.length; i++)
        {
            var subscriber = subscribers[i];

            if (invalid[subscriber['i']])
                continue;

            if (subscriber['c'](options) === false)
                return false;
        }
        return true;
    };

    korevents['derez'] = function(subject)
    {
        fire({
            subject: subject,
            verb: 'derez'
        });

        delete byVerb[subject['i']];
    };

    korevents['clearAll'] = function()
    {
        byVerb = {};
        bySubject = {};
    };

// utility
    var isUndefined = function(obj) { return obj === void 0; };

    // gets the values of a hash as an array. can take
    // an array to put the values into.
    var getValues = function(obj, arr)
    {
        var result = arr || [];

        if (obj != null) // or undef
            for (var key in obj)
                result.push(obj[key]);

        return result;
    };

    // counts the number of keys an obj has
    var keyCount = function(obj)
    {
        if (obj == null) // or undef
            return 0;

        var result = 0;
        for (var key in obj)
            result++;
        return result;
    };

    // creates an object at the key if it does not exist;
    // returns the object whether created or not.
    var getObjectForKey = function(obj, key)
    {
        var result;
        isUndefined(result = obj[key]) &&
            (result = obj[key] = {});
        return result;
    };

    // creates a subject key if it does not exist; returns
    // the key whether created or not.
    var getSubjectKey = function(subject)
    {
        var result;
        isUndefined(result = subject['_kor_events_key']) &&
            (result = subject['_kor_events_key'] = subjectSerialId++);
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

