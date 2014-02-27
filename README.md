consonant.js
============

JavaScript client library to access Consonant web services.

Consonant is an object-relational, cross-referenced, verifiable and
service-oriented Git object store and corresponding web API.

The Consonant specification is hosted on

  https://github.com/CodethinkLabs/consonant


Usage
-----

Shown below is a simple example of

* connecting to a service,
* logging the SHA1 of the latest commit in the `master` branch,
* fetching all objects from that commit, and
* logging all todo objects.

This is just one of many things you can do with `consonant.js`.

    var service = new consonant.Service('http://localhost:8989');
    service.ref('master', function (master) {
        // log SHA1 of the latest commit in branch "master"
        console.log(master.head.sha1);

        // load all objects from this commit
        service.objects(master.head, function (objects)) {
            var todos = objects.todo;
            for (todo in todos) {
                console.log(todo);
            }
        });
    });


API documentation
-----------------

The consonant.js reference manual can be built by running

    jsdoc -c jsdoc.conf -d doc .

from the source tree. This requires [jsdoc](http://usejsdoc.org) to
be installed.


Contributing
------------

The development of consonant.js takes place within the Codethink labs
project on GitHub:

  https://github.com/CodethinkLabs/consonant.js

Anyone interested in improving consonant.js is welcome to clone the
repository and send pull requests.

We currently have no mailing list set up to discuss the development
of consonant.js. Feel free to contact jannis.pohlmann@codethink.co.uk
with ideas or comments, however.


License
-------

Copyright (C) 2014 Codethink Limited.

consonant.js is licensed under the GNU Affero General Public License
version 3. The full text of the license can be found in the COPYING
file distributed along with this README.
