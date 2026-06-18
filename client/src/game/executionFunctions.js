function validateRoute(startStation, endStation, selectedSegments) {
    let prev_id;

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

function generateListRandomEvents(selectedSegmentsLength) {
    const eventsList = [];

    for (let i = 0; i < selectedSegmentsLength; i++) {
        eventsList.push(getRandomIntInclusive(0,8));
    }

    return eventsList;
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}


export {validateRoute, generateListRandomEvents};