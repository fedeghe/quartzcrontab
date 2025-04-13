module.exports = (function () {
    function getRanger(max) {
        return function(n){
            let normN = parseInt(n, 10) % max
            while (normN < 0) normN += max
            return normN
        }
    }
    var A = '*';
    function ct(o) {
        this.months = { min: 0, max: 11 }
        this.elements = {
            s: o.s || 0,
            i: o.i || 0,
            h: o.h || 0,
            dom: o.dom || A,
            m: o.m || A,
            dow: o.dow || A,
            y: o.y || null
        };
    }
    ct.protptype.range24 =getRanger(24);
    ct.protptype.range12 = getRanger(12);
    ct.protptype.range60 = getRanger(60);
    ct.prototype.over = function(o) {
        this.elements = {
            s: o.s ?? this.elements.s,
            i: o.i ?? this.elements.i,
            h: o.h ?? this.elements.h,
            dom: o.dom ?? this.elements.dom,
            m: o.m ?? this.elements.m,
            dow: o.dow ?? this.elements.dow,
            y: o.y ?? this.elements.y
        };
    };

    ct.prototype.everyMinute = function() {
        this.over({
            s: '0',
            i: '*',
            h: '*',
            dom: '*',
            m: '*',
            dow: '*',
            y: '*',
        });
    }
    ct.prototype.everyHour = function() {
        this.over({
            s: '0',
            i: '0',
            h: '*',
            dom: '*',
            m: '*',
            dow: '*',
            y: '*',
        });
    }
    ct.prototype.everyDay = function() {
        this.over({
            s: '0',
            i: '0',
            h: '0',
            dom: '*',
            m: '*',
            dow: '*',
            y: '*',
        })
    }
    ct.prototype.everyDayAt = function({ h = 0, i = 0, s = 0 } = {}){
        this.over({
            s: this.range60(s),
            i: this.range60(i),
            h: this.range24(h),
            dom: '*',
            m: '*',
            dow: '*',
            y: '*',
        })
    }
    ct.prototype.out = function() {
        return [
            this.elements.s,
            this.elements.i,
            this.elements.h,
            this.elements.dom,
            this.elements.m,
            this.elements.dow,
            this.elements.y,
        ]
            .filter(e => e !== undefined && e !== null)
            .join(' ')
    }
    return ct
})();