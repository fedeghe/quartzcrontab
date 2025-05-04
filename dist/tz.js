/*
Quartz cron string creator (v.0.0.7)
*/
const useClientLocalTimezone = tz => {
    const d = new Date()
    console.log(d)
    // ,
    //     t = Intl.DateTimeFormat().resolvedOptions().timeZone
    //     s = d.toLocaleString(
    //         t.locale,
    //         t
    //     );
    // return parseInt(s, 10)
    return d.getTimezoneOffset()/60
}

module.exports = {
    useClientLocalTimezone
}