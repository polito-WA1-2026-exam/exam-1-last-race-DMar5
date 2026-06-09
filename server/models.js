function User(id, name, surname, email) {
    this.id = id;
    this.name = name;
    this.surname = surname;
}

function StationInLine(line_name, line_colour, station_name, orderInLine) {
    this.line_name = line_name;
    this.line_colour = line_colour;
    this.station_name = station_name;
    this.orderInLine = orderInLine;
}

function Segment(station1_name, station2_name, line_name, line_colour) {
    this.station1_name = station1_name;
    this.station2_name = station2_name;
    this.line_name = line_name;
    this.line_colour = line_colour;
}

function Event(title, description, gain) {
    this.title = title;
    this.description = description;
    this.gain = gain;
}

function Score(value, date) {
    this.value = value;
    this.date = date;
}


export {User, StationInLine, Segment, Event}