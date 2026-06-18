
function getStartEndStations(stations, segments) {
    let startStation;
    let endStation;

    const min_value = 1;
    const max_value = stations.length;

    const map_stations = createMapStations(segments);

    // Get the id of start station
    let startStation_id = getRandomIntInclusive(min_value, max_value);

    // Arrays to search and save stations
    let list_to_check = [startStation_id];
    let list_invalid_stations = [startStation_id];
    let list_adj_stations = [];
    let count = 0;

    while(count < 3) {
        let tmp_to_check = [];
        for (let station_id of list_to_check) {
            list_adj_stations = map_stations.get(station_id);
            for (let adj_id of list_adj_stations) {
                if (!list_invalid_stations.includes(adj_id)) {
                    list_invalid_stations.push(adj_id);
                    tmp_to_check.push(...map_stations.get(adj_id));
                }
            }
        }
        if (tmp_to_check.length === 0)
            break;
        list_to_check = tmp_to_check;
        count++;
    }

    let endStation_id;
    do {
        endStation_id = getRandomIntInclusive(min_value, max_value);
    } while (list_invalid_stations.includes(endStation_id));

    startStation = stations.find(st => parseInt(st.id) === startStation_id);
    endStation = stations.find(st => parseInt(st.id) === endStation_id);

    return [startStation, endStation];
}

// Get a random integer between 1 and stations.length
function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

// Create a map of [key, value] pairs
// where:
// key = station id
// value = list of adjacent station ids
function createMapStations(segments) {
    const map = new Map();
    for (let seg of segments) {
        let s1_id = parseInt(seg.s1_id);
        let s2_id = parseInt(seg.s2_id);
        if (!map.has(s1_id)) {
            map.set(s1_id, [s2_id]);
        }
        else {
            map.get(s1_id).push(s2_id);
        }
        if (!map.has(s2_id)) {
            map.set(s2_id, [s1_id]);
        }
        else {
            map.get(s2_id).push(s1_id);
        }
    }
    return map;
}

export {getStartEndStations}