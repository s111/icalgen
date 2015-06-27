var ical = require('ical-generator'),
    http = require('http'),
    cal = ical({
        domain: 'github.com',
        name: 'something cal'
    });

cal.createEvent({
    start: new Date(),
    end: new Date(new Date().getTime() + 3600000),
    summary: 'Example Event',
    description: 'description',
    location: 'E-404'
});

var port = process.env.PORT || 5000;

http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end(cal.toString());
}).listen(port, function() {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});
