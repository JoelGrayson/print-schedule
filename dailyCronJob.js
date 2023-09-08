// If day number calendar includes an entry, print out the calendar
const { exec }=require('child_process');

(async ()=>{
    const getEvents=require('./getEvents');
    const events=await getEvents('c_616118fba9e65ab4c9d89ff02d9d171615f46e2239a5241f500e643e02fdf84e@group.calendar.google.com');
    if (events.length>0) { //there is school that day because there is a day number
        exec('./printHTML.sh', (err, stdout, stderr)=>{
            if (err)
                return console.error(err);
            console.log(stdout);
        });
    }
})();

