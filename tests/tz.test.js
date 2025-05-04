const tz = require('../dist/tz')

describe('timezones', () => {
    it('useClientLocalTimezone', () => {
        expect (tz.useClientLocalTimezone('Europe/Berlin')).toBe(-2)
    })
})