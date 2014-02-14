arr-cache
=========

Simple cache module for Node.js with interval based storage cleaning

## Example
```javascript
var cache = require('arr-cache');

// provide max interval after which
// items will be removed from storage
var c = cache({ keeptime: 3000 });

// express middleware
exports.getProjects = function (req, res, next) {
  var key = c.key('projects', req.session.id);
  var projects = c.fetch(key);
  if ('undefined' !== typeof projects) {
    res.send({ projects: projects });
  } else {
    Project.find().exec(function (err, data) {
      if (err) return next(err);
      c.add(key, data);
      res.send({ projects: data });
    });
  }
};
```

## License

MIT
