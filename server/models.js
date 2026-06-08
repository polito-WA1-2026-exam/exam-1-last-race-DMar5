
function Line(id, line_name, colour, list_stations) {
    this.id = id;
    this.line_name = line_name;
    this.colour = colour;
    this.ordered_list_stations = list_stations;
}

function Segment(station1_name, station2_name, line_colour) {
    this.station1_name = station1_name;
    this.station2_name = station2_name;
    this.line_colour = line_colour;
}

function Event(title, description, gain) {
    this.title = title;
    this.description = description;
    this.gain = gain;
}


export {Line, Segment, Event}