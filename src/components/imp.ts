    useEffect(() => {
    if (!eventData || eventData.length === 0) {
        console.log("No event data available");
        return;
    }

    const tMinArray = [];
    const tMaxArray = [];

    // Gather t_min and t_max dates for all events and check event types
    eventData.forEach(event => {
        const tMinDate = event.t_min[0].split('_')[0]; // "210719"
        const tMaxDate = event.t_max[0].split('_')[0]; // "210722"
        tMinArray.push(tMinDate);
        tMaxArray.push(tMaxDate);
    });

    const sortedTMinArray = Array.from(new Set(tMinArray)).sort();
    const sortedTMaxArray = Array.from(new Set(tMaxArray)).sort();

    const ranges = [];
    const rangeCount = Math.min(sortedTMinArray.length, sortedTMaxArray.length);

    // Define ranges with start and end dates
    for (let i = 0; i < rangeCount; i++) {
        ranges.push({
            start: sortedTMinArray[i],
            end: sortedTMaxArray[i],
            volumes: {},
        });
    }

    // Log the date range being checked
    const minDate = new Date(dateRange.fromDate);
    const maxDate = new Date(dateRange.toDate);
    console.log("Checking Events Between:", minDate, maxDate);

    // Aggregate volumes for each range
    eventData.forEach(event => {
        const tMinDate = event.t_min[0].split('_')[0]; // Extract date part (e.g., 210719)
        const tMaxDate = event.t_max[0].split('_')[0]; // Extract date part (e.g., 210722)
        const eventType = event.event_type[0]; // Extract first element of event_type array
        const volume = event.volumes_from_convex_hulls[0]; // Extract first element of volumes_from_convex_hulls array

        // Convert event dates to Date objects for comparison
        const eventStartDate = new Date(`20${tMinDate.substring(0, 2)}-${tMinDate.substring(2, 4)}-${tMinDate.substring(4, 6)}`);
        const eventEndDate = new Date(`20${tMaxDate.substring(0, 2)}-${tMaxDate.substring(2, 4)}-${tMaxDate.substring(4, 6)}`);

        // Log each event's start and end dates
        console.log(`Event ${event.object_id}: ${eventStartDate} to ${eventEndDate}`);

        // Check if the event falls within the selected date range
        if (eventStartDate >= minDate && eventEndDate <= maxDate) {
            console.log(`Event ${event.object_id} is within the selected range.`);
            
            ranges.forEach(range => {
                if (tMinDate >= range.start && tMaxDate <= range.end) {
                    if (!range.volumes[eventType]) {
                        range.volumes[eventType] = 0;
                    }
                    range.volumes[eventType] += volume;
                }
            });
        }
    });

    // Log the ranges after aggregation
    console.log("Aggregated Ranges:", ranges);

    // Convert ranges into chartData format
    const chartData = ranges.map(range => {
        const dataPoint = { 
            name: `${range.start.substring(4, 6)}-${range.end.substring(4, 6)}`
        };

        Object.entries(range.volumes).forEach(([type, volume]) => {
            dataPoint[type] = volume;
        });

        Object.keys(eventColors).forEach(type => {
            if (!(type in dataPoint)) {
                dataPoint[type] = 0;
            }
        });

        return dataPoint;
    });

    // Log the final chart data for verification
    console.log("Final Chart Data for Graph:", chartData);

    setDateRanges(chartData); 
}, [eventData, dateRange]);
