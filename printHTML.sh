#!/bin/bash

instructions="""
const getEvents=require('./getEvents');
const formatEvents=require('./formatEventsHTML');

async function main() {
    const events=await getEvents();
    const formatted=await formatEvents(events);
    console.log(formatted);
}

main();
"""

echo "$instructions" | node > printing/schedule.html
# open printing/schedule.html
wkhtmltopdf printing/schedule.html printing/schedule.pdf
lp printing/schedule.pdf

