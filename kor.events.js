/*
 * kor.events - criteria-based events microframework.
 *  clint tseng (clint@dontexplain.com) - 2011-06-30
 *   Licensed under the WTFPL (http://sam.zoy.org/wtfpl). Do what
 *   you want, but please do let me know what you think.
 */

;(function()
{
// internal data structures
    var byVerb = { all: {}, arg: {} },
        bySubject = {},
        subjects = {},
        subjectSerialId = 0,
        eventSerialId = 0;

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

        // construct our own, just in case
        var id = eventSerialId++;
        var eventSignature = {
            's': subject,
            'v': verb,
            'p': priority,
            'a': args,
            'i': id,
            'c': callback
        };

        var targetRegistry;
        if (isUndefined(subject))
            // no subject; just add to the global registry
            targetRegistry = byVerb;
        else
            // add to the subject-specific registry
            targetRegistry = getObjectForKey(bySubject, getSubjectKey(subject));

        // go through args; add to global/verb args registry
        if (!isUndefined(args))
            for (var arg in args)
                getObjectForKey(targetRegistry.arg, arg)[id] = eventSignature;

        // add to global verb events registry
        getObjectForKey(targetRegistry.all, id) = eventSignature;
    };

    var fire = korevents['fire'] = function(options)
    {
        var subject = options['subject'],
            verb = options['verb'],
            args = options['args'];

        // keep track of what registrations we've already determined won't fire.
        var invalid = {};
        var priority = {};

        // first, look at global subscribers to this verb
        var globalSubscribers = clone(getArrayForKey(byVerb, verb));
        if (!isUndefined(args))
            checkArgs(byArg, args, invalid, priority);

        // next, look at subject subscribers to the verb
        var subjectKey = getSubjectKey(subject);
        var subjectSubscribers = clone(getArrayForKey(getObjectForKey(bySubject, subjectKey), verb));
        var subjectArgRegistry = getObjectForKey(getObjectForKey(bySubjectAndArg, subjectKey), verb);
        if (!isUndefined(args))
            checkArgs(subjectArgRegistry, args, invalid, priority);

        // join, sort
        var allSubscribers = globalSubscribers.concat(subjectSubscribers);
        allSubscribers.sort(function(a, b)
        {
            var result;
            if ((result = (a['p'] || 0) - (b['p'] || 0)) !== 0)
                return result;
            return (priority[a['i']] || 0) - (priority[b['i']] || 0);
        });

        // call
        var result = true;
        for (var i = 0; i < allSubscribers.length; i++)
        {
            if (invalid[allSubscribers[i]['i']])
                continue;

            if (allSubscribers[i]['c'](options) === false)
            {
                result = false;
                break;
            }
        }
        return result;
    };

    korevents['derez'] = function(subject)
    {
        fire({
            subject: subject,
            verb: 'derez'
        });

        delete byVerb[subject['i']];
    };

// helper
    var checkArgs = function(byArg, args, invalid, priority)
    {
        for (var arg in args)
        {
            var argRegistry = byArg[arg],
                argValue = args[arg];

            if (!isUndefined(argRegistry))
            {
                for (var i = 0; i < argRegistry.length; i++)
                {
                    // check validity
                    var registeredEvent = argRegistry[i];
                    if (registeredEvent['a'][arg] !== argValue)
                    {
                        invalid[registeredEvent['i']] = true;
                        continue;
                    }

                    // init and incr priority for this registry
                    if (isUndefined(priority[registeredEvent['i']]))
                        priority[registeredEvent['i']] = 0;
                    priority[registeredEvent['i']]++;
                }
            }
        }
    };

// utility
    var isUndefined = function(obj) { return obj === void 0; };
    var isArray = function(obj) { return toString.call(obj) === '[object Array]'; };

    // shallow copies an obj/array
    var clone = function(obj)
    {
        if (isUndefined(obj))
            return undefined;
        if (isArray(obj))
            return obj.slice();

        var result = {};
        for (var key in obj)
            result[key] = obj[key];
        return result;
    };

    // creates an object at the key if it does not exist;
    // returns the object whether created or not.
    var getObjectForKey = function(obj, key)
    {
        return getXForKey(obj, key, {});
    };

    // creates an array at the key if it does not exist;
    // returns the array whether created or not.
    var getArrayForKey = function(obj, key)
    {
        return getXForKey(obj, key, []);
    };

    var getXForKey = function(obj, key, x)
    {
        var result;
        isUndefined(result = obj[key]) &&
            (result = obj[key] = x);
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

