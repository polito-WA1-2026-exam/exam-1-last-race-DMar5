function Line(id, line_name, line_colour) {
    this.id = id;
    this.line_name = line_name;
    this.line_colour = line_colour;
}

function Station(id, station_name, x, y) {
    this.id = id;
    this.station_name = station_name;
    this.x = x;
    this.y = y;
}

function Segment(id, s1_id, s2_id, x1, y1, x2, y2, line_id) {
    this.id = id;
    this.s1_id = s1_id;
    this.s2_id = s2_id;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.line_id = line_id;
}

function Event(id, title, description, gain) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.gain = gain;
}

function Score(value, date) {
    this.value = value;
    this.date = date;
}


export {Segment, Event, Score}