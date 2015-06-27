var ical = require('ical-generator'),
    url = require('url'),
    fs = require('fs'),
    http = require('http'),
    port = process.env.PORT || 5000;

http.createServer(function(req, res) {
    var url_parts = url.parse(req.url, true);

    try {
        subjects = url_parts.pathname.substring(1).split("/")
    } catch (e) {
        subjects = [];
    }

    var lectures = [];
    var names = [];

    for (subject of subjects) {
        try {
            var file = fs.readFileSync('lectures/' + decodeURIComponent(subject) + '.json');
            var sub = JSON.parse(file.toString());

            lectures = lectures.concat(sub.Lectures);
            names.push(sub.Name);
        } catch (e) {
            continue;
        }
    }

    var cal = ical({
        domain: 'github.com',
        name: names.toString()
    });

    for (lecture of lectures) {
        cal.createEvent({
            start: new Date(lecture.Date),
            end: new Date(new Date(lecture.Date).getTime() + lecture.Length * 3600000),
            summary: lecture.Name,
            description: lecture.Lecturers,
            location: lecture.Rooms
        });
    }

    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });
    res.end(cal.toString());
}).listen(port, function() {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});
