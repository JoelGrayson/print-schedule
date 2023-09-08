const jdate=require('joeldate');

const maxChars=45;

module.exports=async (events)=>{
    function chopTo(str, length) {
        if (str.length>length-1)
            return str.slice(0, length)+'…';
        else
            return str;
    }
    function formatLine(str, filler='-', align='center') {
        return '|'+filler+(align==='center' ? centerAlign : leftAlign)(chopTo(str, maxChars), filler=filler)+filler+'|'+'\n';
    }
    function centerAlign(str, filler='-') {
        let padStart=(maxChars-str.length)/2;
        let padEnd=padStart;
        if (padStart%1===0.5 && padStart>1) {
            padStart+=0.5;
            padEnd-=0.5;
        }
        return filler.repeat(padStart)+str+filler.repeat(padEnd);
    }
    function leftAlign(str, filler='-') {
        return str+filler.repeat(maxChars-str.length);
    }
    let message=formatLine(`Schedule for ${jdate()}`);
    message+=formatLine('', ' ');
    
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
        return;
    }
    events.map((event, i) => {
        const start=new Date(event.start.dateTime || event.start.date);
        const end=new Date(event.end.dateTime || event.end.date);
        let formattedStart=`${start.getHours()}:${('0'+start.getMinutes()).slice(-2)}`;
        let formattedEnd=`${end.getHours()}:${('0'+end.getMinutes()).slice(-2)}`;
        // message+=formatLine(formattedStart+' - '+chopTo(event.summary, maxChars-4)+' - '+formattedEnd, ' ', 'left');
        const middleLength=maxChars-4 /*pipe and space*/ -8*2/* time and hyphen on both sides */+2/*adjusting, not sure why*/;
        message+=formatLine(formattedStart.padStart(5, ' ')+' - '+chopTo(event.summary, middleLength).padEnd(middleLength+1/*for …*/)+' - '+formattedEnd.padEnd(5, ' '), ' ', 'left');
    });
    message+=formatLine('', ' ');
    message+=formatLine('');
    return message;
}
