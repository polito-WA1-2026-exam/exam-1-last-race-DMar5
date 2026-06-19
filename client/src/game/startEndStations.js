
function getStartEndStations(stations, segments) {
    // Guard against empty arrays
    if (!stations || stations.length === 0 || !segments || segments.length === 0) {
        return [null, null];
    }

    let startStation;
    let endStation;

    const adjacency_map = createAdjacencyMap(segments);

    let startStation_id;

    let listValidEndStations = [];
    
    while (listValidEndStations.length === 0) {
        // Get the id of start station
        startStation_id = stations[getRandomIntInclusive(0, stations.length-1)].id;
        listValidEndStations = getValidEndStations(startStation_id, adjacency_map);
    }

    let endStation_id = listValidEndStations[getRandomIntInclusive(0, listValidEndStations.length-1)];
    
    startStation = stations.find(st => parseInt(st.id) === startStation_id);
    endStation = stations.find(st => parseInt(st.id) === endStation_id);

    return [startStation, endStation];
}

// Computes breadth-first search to get the distance of each station from the start station
function getValidEndStations(startStation_id, adjacency_map) {
    const distance_map = new Map();
    
    distance_map.set(startStation_id, 0);

    // Helpful data structures
    let list_to_check = [startStation_id];
    let list_adj_stations = [];
    let tmp_to_check = [];
    let distance = 1;

    // BFS logic
    while (list_to_check.length !== 0) {
        tmp_to_check = [];
        for (let station_id of list_to_check) {
            list_adj_stations = adjacency_map.get(station_id);
            if (list_adj_stations) {
                for (let adj_id of list_adj_stations) {
                    if (!distance_map.has(adj_id)) {
                        distance_map.set(adj_id, distance);
                        tmp_to_check.push(adj_id);
                    }
                }
            }
        }
        list_to_check = tmp_to_check;
        distance++;
    }
    let listValidEndStations = [];

    for (let elem of adjacency_map.keys()) {
        if (distance_map.get(elem) >= 3) {
            listValidEndStations.push(elem);
        }
    }

    return listValidEndStations;
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
function createAdjacencyMap(segments) {
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