var ke = require('../kor.events');

describe('priority of calls', function()
{
    beforeEach(function()
    {
        ke.clearAll();

        this.addMatchers({
            toBeOrdered: function()
            {
                var lastValue = this.actual[0];
                for (var i = 1; i < this.actual.length; i++)
                {
                    if (this.actual[i] < lastValue)
                        return false;

                    lastValue = this.actual[i];
                }

                return true;
            }
        });
    });

    it('should fire callbacks in stable order', function()
    {
        var results = [];

        for (var i = 0; i < 10; i++)
        {
            (function(locali)
            {
                ke.listen({
                    verb: 'stable-test',
                    callback: function()
                    {
                        results.push(locali);
                    }
                });
            })(i);
        }

        ke.fire({
            verb: 'stable-test'
        });

        expect(results).toBeOrdered();
    });

    it('should account for explicit priority ordering', function()
    {
        var results = [];

        ke.listen({
            verb: 'explicit-ordering-test',
            priority: 10,
            callback: function()
            {
                results.push(2);
            }
        });

        ke.listen({
            verb: 'explicit-ordering-test',
            priority: 0,
            callback: function()
            {
                results.push(3);
            }
        });

        ke.listen({
            verb: 'explicit-ordering-test',
            priority: 20,
            callback: function()
            {
                results.push(1);
            }
        });

        ke.fire({
            verb: 'explicit-ordering-test'
        });

        expect(results).toBeOrdered();
    });

    it('should account for argument match priority', function()
    {
        var results = [];

        ke.listen({
            verb: 'implicit-ordering-test',
            args: {
                argA: 'one fish',
                argB: 'two fish'
            },
            callback: function()
            {
                results.push(2);
            }
        });

        ke.listen({
            verb: 'implicit-ordering-test',
            args: {
                argA: 'one fish',
                argB: 'two fish',
                argC: 'red fish',
                argD: 'blue fish'
            },
            callback: function()
            {
                results.push(1);
            }
        });

        ke.listen({
            verb: 'implicit-ordering-test',
            args: {
                argA: 'one fish'
            },
            callback: function()
            {
                results.push(4);
            }
        });

        ke.listen({
            verb: 'implicit-ordering-test',
            args: {
                argA: 'one fish',
                argB: 'two fish',
                argC: 'red fish'
            },
            callback: function()
            {
                results.push(3);
            }
        });

        expect(results).toBeOrdered();
    });

    it('should bias towards explicit ordering', function()
    {
        var result = [];

        ke.listen({
            verb: 'bias-test',
            priority: -1,
            args: {
                argA: 1,
                argB: 2
            },
            callback: function()
            {
                results.push(2);
            }
        });

        ke.listen({
            verb: 'bias-test',
            args: {
                argA: 1
            },
            callback: function()
            {
                results.push(1);
            }
        });

        ke.fire({
            verb: 'bias-test'
        });

        expect(result).toBeOrdered();
    });

    it('should blend priority styles correctly', function()
    {
        var result = [];

        ke.listen({
            verb: 'ordering-test',
            priority: 2,
            callback: function()
            {
                result.push(2);
            }
        });

        ke.listen({
            verb: 'ordering-test',
            args: {
                argA: 1,
                argB: 2,
                argC: 3
            },
            callback: function()
            {
                result.push(1);
            }
        });

        ke.listen({
            verb: 'ordering-test',
            args: {
                argA: 1
            },
            callback: function()
            {
                result.push(3);
            }
        });

        ke.fire({
            verb: 'ordering-test',
            args: {
                argA: 1,
                argB: 2,
                argC: 3
            }
        });

        expect(result).toBeOrdered();
    });
});

