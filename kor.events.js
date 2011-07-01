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
        subjects = {};

// base object and methods
    var korevents = {};

    korevents['listen'] = function(options)
    {
        var subject = options['subject'],
            verb = options['verb'],
            args = options['args'],
            callback = options['callback'];
    };

    korevents['fire'] = function(options)
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

