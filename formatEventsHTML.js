const jdate=require('joeldate');

module.exports=events=>{
    const html=`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <style>
                .title {
                    text-align: center;
                }
                .card {
                    border: 1px solid #ccc;
                    width: 500px;
                }
                .card>div {
                    padding: 4px 14px;
                }
                .card .day-wide {
                    padding-left: 1ch;
                }
                .card .start-time {
                    width: 6ch;
                    display: inline-block;
                    text-align: right;
                }
                .card .event-summary {
                    width: 44ch;
                    display: inline-block;
                }
                .card .end-time {
                    width: 6ch;
                    display: inline-block;
                    text-align: left;
                }
                .event:nth-child(2n) {
                    color: #000;
                }
                .event:nth-child(2n+1) {
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class='card'>
                <h3 class='title'>Schedule for ${jdate()}</h3>
                ${events.map(event=>{
                    if (event.start.date) { //day-wide, not datetime
                        return `
                            <div class='day-wide-event>
                                <span class='day-wide'>Day-wide: </span>
                                <span class='event-summary'>${event.summary}</span>
                            </div>
                        `;
                    } else {
                        const start=new Date(event.start.dateTime || event.start.date);
                        const end=new Date(event.end.dateTime || event.end.date);
                        const formattedStart=`${start.getHours()}:${('0'+start.getMinutes()).slice(-2)}`;
                        const summary=event.summary;
                        const formattedEnd=`${end.getHours()}:${('0'+end.getMinutes()).slice(-2)}`;
                        return `
                            <div class='event'>
                                <span class='start-time'>${formattedStart} - </span>
                                <span class='event-summary'>${summary.length > 50 ? summary.slice(0, 47)+'...' : summary}</span>
                                <span class='end-time'> - ${formattedEnd}</span>
                            </div>
                        `;
                    }
                }).join('')}
                <br />
            </div>
        </body>
        </html>
    `;
    return html;
}
