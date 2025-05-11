/*
quartzcron (v.0.0.38)
*/
const describeSeconds=()=>{return false}, describeMinutes=()=>{return false}, describeHours=()=>{return 'at midnight'}, describeDomDowOccurrence=()=>{return 'every day'}, describeMonths=()=>{return false}, describeYears=()=>{return false};const describe=({s, i, h, dom, m, dow, y})=>{return[describeSeconds(s), describeMinutes(i), describeHours(h), describeDomDowOccurrence(dom,dow), describeMonths(m), describeYears(y)].filter(Boolean).join(' of ')}module.exports={describe}