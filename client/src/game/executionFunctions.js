function validateRoute(startStation, endStation, selectedSegments) {
    let prev_id;

    if (selectedSegments.length === 0) {
        return false;
    }
 
    if (selectedSegments[0].s1_id === startStation.id) {
        prev_id = selectedSegments[0].s2_id;
    }
    else if (selectedSegments[0].s2_id === startStation.id) {
        prev_id = selectedSegments[0].s1_id;
    }
    else {
        return false;
    }

    for (let i = 1; i < selectedSegments.length; i++) {
        if (selectedSegments[i].s1_id === prev_id) {
            prev_id = selectedSegments[i].s2_id;
        }
        else if (selectedSegments[i].s2_id === prev_id) {
            prev_id = selectedSegments[i].s1_id;
        }
        else {
            return false;
        }
    }

    if (prev_id !== endStation.id) {
        return false;
    }

    return true;
}

function generateListRandomEvents(selectedSegmentsLength, max_index=8) {
    const eventsList = [];

    for (let i = 0; i < selectedSegmentsLength; i++) {
        eventsList.push(getRandomIntInclusive(0,max_index));
    }

    return eventsList;
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}


export {validateRoute, generateListRandomEvents};