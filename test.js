const d = new Date();
const p = console.log;
d.setHours(3);
d.setMinutes(0);
d.setSeconds(0);
p(d.getTime());