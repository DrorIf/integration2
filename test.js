const p = console.log;

let date = new Date();
// date.setHours(date.getHours()-3);
// output = {date: date.toString()};
p(date.toString())
p(date.toLocaleString('en-GB', { timeZone: 'UTC+3' }))