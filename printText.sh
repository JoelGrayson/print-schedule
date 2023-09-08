#!/bin/bash

instructions="""
const getEvents=require('./getEvents');
const formatEvents=require('./formatEventsText');

async function main() {
    const events=await getEvents();
    const formatted=await formatEvents(events);
    console.log(formatted);
}

main();
"""

echo $instructions | node > printing/formattedText.txt
sleep 1
lp Brother_HL_L2350DW_series printing/formattedText.txt

