/**
 * Copyright (C) 2014 Codethink Limited
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */



/**
 * The consonant namespace.
 * @namespace consonant
 */
(function (consonant, $, undefined) {
    /**
     * Various helper utilities for working with URLs and more.
     *
     * @constructor
     */
    consonant.Helpers = function () {
    };
    var Helpers = consonant.Helpers;

    consonant.Helpers.prototype = function () {
        return {
        };
    }();

    /**
     * Takes an arbitrary number of URL segments and joins them together into a
     * URL, with all segments separated by slashes.
     *
     * @param {...string} segment - A URL segment.
     * @returns {string} All segments combined into a URL with no redundant slashes.
     */
    consonant.Helpers.urljoin = function (segment) {
        var segments = [];
        for (var i = 0; i < arguments.length; i++) {
            var stripped = arguments[i].replace(/(^[\s\/]+)|([\s\/]+$)/g, '');
            segments.push(stripped);
        }
        return segments.join('/');
    };



    /**
     * Callback that takes a refs dictionary, mapping canonical ref
     * names to {Ref} objects.
     *
     * @callback consonant.RefsCallback
     * @param {array} A refs dictionary mapping ref names to {Ref} objects.
     */

    /**
     * Callback that takes a {Ref}.
     *
     * @callback consonant.RefCallback
     * @param {consonant.Ref} A {Ref} object.
     */

    /**
     * Callback that takes a {Commit}.
     *
     * @callback consonant.CommitCallback
     * @param {consonant.Commit} A {Commit} object.
     */

    /**
     * Callback that takes an array.
     *
     * @callback consonant.ArrayCallback
     * @param {array} An array.
     */

    /**
     * Callback that takes a {string}.
     *
     * @callback consonant.StringCallback
     * @param {string} A string (e.g. the service name).
     */

    /**
     * Callback that takes a {Schema}.
     *
     * @callback consonant.SchemaCallback
     * @param {consonant.Schema} A {Schema}.
     */



    /**
     * A Consonant service.
     *
     * @constructor
     * @param {string} url - The HTTP URL of the Consonant service.
     * @returns {consonant.Service} A Service object for the given URL.
     */
    consonant.Service = function (url) {
        this.url = url;
    };
    var Service = consonant.Service;

    consonant.Service.prototype = function () {
        /**
         * TODO
         */
        var apply = function (transaction, callback) {
            var url = Helpers.urljoin(this.url, 'transactions');
            $.ajax({
                type: 'POST',
                url: url,
                data: transaction.multipart_mixed(),
                success: callback,
                contentType: 'multipart/mixed',
            });
        };

        /**
         * Fetches all refs from the service and returns them via a callback.
         *
         * @method consonant.Service.prototype.refs
         * @param {consonant.RefsCallback} callback - Callback to which the
         *                                            resulting refs are passed
         *                                            on.
         */
        var refs = function (callback) {
            var url = Helpers.urljoin(this.url, 'refs');
            var service = this;
            $.getJSON(url, function (data) {
                var refs = {};
                for (var name in data) {
                    refs[name] = Ref.parseJSON(data[name]);
                    refs[name].head.service = service;
                }
                callback(refs);
            });
        };

        /**
         * Fetches a specific {Ref} from the service and returns it via a
         * callback.
         *
         * @method consonant.Service.prototype.ref
         * @param {string} name - Name of the {Ref} to fetch.
         * @param {consonant.RefCallback} callback - Callback to which the
         *                                           {Ref} is passed on.
         */
        var ref = function (name, callback) {
            var url = Helpers.urljoin(this.url, 'refs', name);
            var service = this;
            $.getJSON(url, function (data) {
                var ref = Ref.parseJSON(data);
                ref.head.service = service;
                callback(ref);
            });
        };

        /**
         * Fetches a {Commit} from the service and returns it via a callback.
         *
         * @method consonant.Service.prototype.commit
         * @param {string} sha1 - SHA1 of the {Commit} to fetch.
         * @param {consonant.CommitCallback} callback - Callback to which the
         *                                              {Commit} is passed on.
         */
        var commit = function (sha1, callback) {
            var url = Helpers.urljoin(this.url, 'commits', sha1);
            var service = this;
            $.getJSON(url, function (data) {
                var commit = Commit.parseJSON(data);
                commit.service = service;
                callback(commit);
            });
        };

        /**
         * Fetches the service name from a given {Commit} and returns it via
         * a callback.
         *
         * @method consonant.Service.prototype.name
         * @param {consonant.Commit} commit - {Commit} to fetch the name from.
         * @param {consonant.StringCallback} callback - Callback to which the
         *                                              name is passed on.
         */
        var name = function (commit, callback) {
            var url = Helpers.urljoin(this.url, 'commits', commit.sha1, 'name');
            $.getJSON(url, function (data) {
                callback(data);
            });
        };

        /**
         * Fetches the service aliases from a given {Commit} and returns them
         * via a callback.
         *
         * @method consonant.Service.prototype.services
         * @param {consonant.Commit} commit - {Commit} to fetch aliases from.
         * @param {consonant.ArrayCallback} callback - Callback to which the
         *                                             service aliases are
         *                                             passed on.
         */
        var services = function (commit, callback) {
            var url = Helpers.urljoin(this.url, 'commits', commit.sha1, 'services');
            $.getJSON(url, function (data) {
                callback(data);
            });
        };

        /**
         * Fetches the {Schema} from a given {Commit} and returns it via a
         * callback.
         *
         * @method consonant.Service.prototype.schema
         * @param {consonant.Commit} commit - {Commit} to fetch the schema from.
         * @param {consonant.SchemaCallback} callback - Callback to which the
         *                                              schema is passed on.
         */
        var schema = function (commit, callback) {
            var url = Helpers.urljoin(this.url, 'commits', commit.sha1, 'schema');
            $.getJSON(url, function (data) {
                var schema = Schema.parseJSON(data);
                callback(schema);
            });
        };

        /**
         * Loads a specific object from a given {Commit} and returns it via a
         * callback.
         *
         * @method consonant.Commit.prototype.object
         * @param {consonant.Commit} commit - The {Commit} to load the object from.
         * @param {string} uuid - The object UUID.
         * @param {consonant.ObjectCallback} callback - Callback to which the
         *                                              resulting object is
         *                                              passed on.
         */

        var object = function(commit, uuid, callback) {
            var url = Helpers.urljoin(this.url, 'commits', commit.sha1,
                                      'objects', uuid);
            $.getJSON(url, function (data) {
                var obj = consonant.Object.parseJSON(data);
                callback(obj);
            });
        };

        /**
         * Fetches all objects from a given {Commit} and returns them via a
         * callback.
         *
         * @method consonant.Service.prototype.objects
         * @param {consonant.Commit} commit - {Commit} to fetch objects from.
         * @param {consonant.ArrayCallback} callback - Callback to which the
         *                                             objects are passed on.
         * @param {string} klass - Optional name of an object class for
         *                         filtering.
         */
        var objects = function (commit, callback, klass) {
            if (klass) {
                var url1 = Helpers.urljoin(this.url, 'commits', commit.sha1,
                                          'classes', klass, 'objects');
                $.getJSON(url1, function (data) {
                    var objects = [];
                    for (var index in data) {
                        var object_data = data[index];
                        var obj = consonant.Object.parseJSON(object_data);
                        objects.push(obj);
                    }
                    callback(objects);
                });
            } else {
                var url2 = Helpers.urljoin(this.url, 'commits', commit.sha1,
                                          'objects');
                $.getJSON(url2, function (data) {
                    var objects = {};
                    for (var class_name in data) {
                        var class_objects = [];
                        for (var index in data[class_name]) {
                            var object_data = data[class_name][index];
                            var obj = consonant.Object.parseJSON(object_data);
                            class_objects.push(obj);
                        }
                        objects[class_name] = class_objects;
                    }
                    callback(objects);
                });
            }
        };

        return {
            apply: apply,
            commit: commit,
            name: name,
            object: object,
            objects: objects,
            ref: ref,
            refs: refs,
            schema: schema,
            services: services,
        };
    }();



    /**
     * A Ref in a Consonant service.
     *
     * @constructor
     * @param {string} type - The {Ref} type, usually "branch" or "tag".
     * @param {array} url_aliases - An array with aliases of the ref.
     * @param {consonant.Commit} head - The latest {Commit} in the {Ref}.
     * @returns {consonant.Ref} - A new {Ref} object.
     */
    consonant.Ref = function (type, url_aliases, head) {
        /**
         * The type of the {Ref}, usually "branch" or "tag".
         *
         * @member {string}
         */
        this.type = type;

        /**
         * An array with aliases of the ref.
         *
         * @member {array}
         */
        this.url_aliases = url_aliases;

        /**
         * The latest {Commit} in the {Ref}.
         *
         * @member {consonant.Commit}
         */
        this.head = head;
    };
    var Ref = consonant.Ref;

    consonant.Ref.prototype = function () {
        /**
         * Returns a JSON representation of the {Ref}.
         *
         * @method consonant.Ref.prototype.json
         * @returns {string} - A JSON representation of the {Ref}.
         */
        var json = function () {
            return JSON.stringify(this, null, 4);
        };

        return {
            json: json,
        };
    }();

    /**
     * Parses a JSON string into a {Ref}.
     *
     * @param {string} data - A JSON representation of a {Ref}.
     * @returns {consonant.Ref} - The parsed {Ref} object.
     */
    consonant.Ref.parseJSON = function (data) {
        var head = Commit.parseJSON(data.head);
        return new Ref(data.type, data['url-aliases'], head);
    };



    /**
     * A Commit in a Consonant service.
     *
     * @constructor
     * @param {string} sha1 - The commit SHA1.
     * @param {string} author - The author of the commit.
     * @param {string} author_date - The date the commit was authored.
     * @param {string} committer - The person who created the commit.
     * @param {string} committer_date - The date the commit was created.
     * @param {array} parents - An array of parent commit SHA1s.
     * @param {array} subject - The commit subject.
     * @returns {consonant.Commit} - A new {Commit} object.
     */
    consonant.Commit = function (sha1, author, author_date, committer,
                                 committer_date, parents, subject)
    {
        /**
         * The commit SHA1.
         *
         * @member {string}
         */
        this.sha1 = sha1;

        /**
         * The author of the commit.
         *
         * @member {string}
         */
        this.author = author;

        /**
         * The date the commit was authored.
         *
         * @member {string}
         */
        this.author_date = author_date;

        /**
         * The person who created the commit.
         *
         * @member {string}
         */
        this.committer = committer;

        /**
         * The date the commit was created.
         *
         * @member {string}
         */
        this.committer_date = committer_date;

        /**
         * An array of parent commit SHA1s.
         *
         * @member {array}
         */
        this.parents = parents;

        /**
         * The commit subject.
         *
         * @member {string}
         */
        this.subject = subject;

        /**
         * The {Service} the commit was loaded from.
         * @member {consonant.Service}
         */
        this.service = undefined;
    };
    var Commit = consonant.Commit;

    consonant.Commit.prototype = function () {
        /**
         * Returns a JSON representation of the {Commit}.
         *
         * @method consonant.Commit.prototype.json
         * @returns {string} - A JSON representation of the {Commit}.
         */
        var json = function () {
            return JSON.stringify(this, null, 4);
        };

        /**
         * Fetches the service name from the {Commit} and returns it via
         * a callback.
         *
         * @method consonant.Commit.prototype.name
         * @param {consonant.StringCallback} callback - Callback to which the
         *                                              name is passed on.
         */
        var name = function (callback) {
            this.service.name(this, callback);
        };

        /**
         * Loads a specific object in the commit and return it via a callback.
         *
         * @method consonant.Commit.prototype.object
         * @param {string} uuid - The object UUID.
         * @param {consonant.ObjectCallback} callback - Callback to which the
         *                                              resulting object is
         *                                              passed on.
         */
        var object = function(uuid, callback) {
          this.service.object(this, uuid, callback);
        };

        /**
         * Loads all objects in the commit, optionally filtered by a class, and
         * returns them via a callback.
         *
         * @method consonant.Commit.prototype.objects
         * @param {consonant.ArrayCallback} callback - Callback to which the
         *                                             resulting objects are
         *                                             passed on.
         * @param {string} klass - Name of the class to fetch objects for.
         */
        var objects = function(callback, klass) {
          this.service.objects(this, callback, klass);
        };

        /**
         * Fetches the {Schema} from the {Commit} and returns it via a callback.
         *
         * @method consonant.Commit.prototype.schema
         * @param {consonant.SchemaCallback} callback - Callback to which the
         *                                              schema is passed on.
         */
        var schema = function (callback) {
            this.service.schema(this, callback);
        };

        /**
         * Fetches the service aliases from the {Commit} and returns them
         * via a callback.
         *
         * @method consonant.Commit.prototype.services
         * @param {consonant.ArrayCallback} callback - Callback to which the
         *                                             service aliases are
         *                                             passed on.
         */
        var services = function (callback) {
            this.service.services(this, callback);
        };

        return {
            json: json,
            name: name,
            object: object,
            objects: objects,
            schema: schema,
            services: services,
        };
    }();

    /**
     * Parses a JSON string into a {Commit}.
     *
     * @param {string} data - A JSON representation of a {Commit}.
     * @returns {consonant.Commit} - The parsed {Commit} object.
     */
    consonant.Commit.parseJSON = function (data) {
        return new Commit(data.sha1,
                          data.author,
                          data['author-date'],
                          data.committer,
                          data['committer-date'],
                          data.parents,
                          data.subject);
    };



    /**
     * A Consonant schema.
     *
     * @constructor
     * @param {string} name - The name of the schema.
     * @param {array} classes - Class definitions of the schema.
     * @returns {consonant.Schema} - A new {Schema} object.
     */
    consonant.Schema = function (name, classes) {
        /**
         * The name of the schema.
         *
         * @member {string}
         */
        this.name = name;

        /**
         * Class definitions of the schema. An associative array
         * mapping class names to {ClassDefinition} objects.
         *
         * @member {array}
         */
        this.classes = classes;
    };
    var Schema = consonant.Schema;

    consonant.Schema.prototype = function () {
        /**
         * Returns a JSON representation of the {Schema}.
         *
         * @method consonant.Schema.prototype.json
         * @returns {string} - A JSON representation of the {Schema}.
         */
        var json = function () {
            var data = JSON.stringify(this, null, 4);
            return data;
        };

        return {
            json: json,
        };
    }();

    /**
     * Parses a JSON string into a {Schema}.
     *
     * @param {string} data - A JSON representation of a {Schema}.
     * @returns {consonant.Schema} - The parsed {Schema} object.
     */
    consonant.Schema.parseJSON = function (data) {
        var classes = {};
        for (var class_name in data.classes) {
            var class_data = data.classes[class_name];
            var class_definition = ClassDefinition.parseJSON(class_data);
            class_definition.name = class_name;
            classes[class_name] = class_definition;
        }
        return new Schema(data.name, classes);
    };



    /**
     * A class definition in a Consonant {Schema}.
     *
     * @constructor
     * @param {string} name - The name of the class.
     * @param {array} properties - Property definitions of the class.
     * @returns {consonant.ClassDefinition} - A new {ClassDefinition} object.
     */
    consonant.ClassDefinition = function (name, properties) {
        /**
         * The name of the class.
         *
         * @member {string}
         */
        this.name = name;

        /**
         * Property definitions of the class. An associative array that
         * maps property names to {PropertyDefinition} objects.
         *
         * @member {array}
         */
        this.properties = properties;
    };
    var ClassDefinition = consonant.ClassDefinition;

    consonant.ClassDefinition.prototype = function () {
        /**
         * Returns a JSON representation of the {ClassDefinition}.
         *
         * @method consonant.ClassDefinition.prototype.json
         * @returns {string} - A JSON representation of the {ClassDefinition}.
         */
        var json = function () {
            return JSON.stringify(this, null, 4);
        };

        return {
            json: json,
        };
    }();

    /**
     * Parses a JSON string into a {ClassDefinition}.
     *
     * @param {string} data - A JSON representation of a {ClassDefinition}.
     * @returns {consonant.ClassDefinition} - The parsed {ClassDefinition}
     *                                        object.
     */
    consonant.ClassDefinition.parseJSON = function (data) {
        var properties = {};
        for (var property_name in data.properties) {
            var property_data = data.properties[property_name];
            var property_def = PropertyDefinition.parseJSON(property_data,
                                                            property_name);
            properties[property_name] = property_def;
        }
        return new ClassDefinition(null, properties);
    };



    /**
     * A property definition in a Consonant {Schema}.
     *
     * All property definitions include a type. Supported types are:
     * `boolean`, `integer`, `float`, `text`, `raw`, `reference`, `timestamp`,
     * and `list`.
     *
     * @constructor
     * @param {string} name - The name of the property.
     * @param {type} type - The property type ("text", "boolean", etc.)
     * @param {boolean} optional - Whether or not the property is optional.
     * @returns {consonant.PropertyDefinition} - A new {PropertyDefinition}
     *                                           object.
     */
    consonant.PropertyDefinition = function (name, type, optional) {
        /**
         * The name of the property.
         *
         * @member {string}
         */
        this.name = name;

        /**
         * The property type. One of `boolean`, `integer`, `float`, `text`,
         * `raw`, `reference`, `timestamp` and `list`.
         *
         * @member {string}
         */
        this.type = type;

        /**
         * A boolean flag indicating whether the property is optional or not.
         *
         * @member {boolean}
         */
        this.optional = optional;

        /**
         * Only for list property definitions. A {PropertyDefinition} that
         * describes what type of values are stored in the list property.
         *
         * @member {consonant.PropertyDefinition}
         */
        this.elements = undefined;

        /**
         * Only for raw property definitions. An array of regular expressions
         * of valid content types to be used for raw property data. The
         * regular expressions are represented as strings.
         *
         * @member {array}
         */
        this.content_type_regex = undefined;

        /**
         * Only for reference property definitions. The name of the class of
         * which objects can be referenced via the reference property.
         *
         * @member {string}
         */
        this.klass = undefined;

        /**
         * Only for reference property definitions. The name of the schema
         * the target class (see the `klass` member) is defined in. This can
         * be used to define a target class in another Consonant service.
         *
         * @member {string}
         */
        this.schema = undefined;

        /**
         * Only for reference property definitions. An optional name of a property
         * in the target class. If specified, expresses that a reference in the
         * property of the source object requires a reference back from the target
         * object via the given property name.
         *
         * @member {string}
         */
        this.bidirectional = undefined;

        /**
         * Only for text property definitions. An array of regular expressions
         * of valid values for the text property. The regular expressions are
         * represented as strings.
         *
         * @member {array}
         */
        this.regex = undefined;
    };
    var PropertyDefinition = consonant.PropertyDefinition;

    consonant.PropertyDefinition.prototype = function () {
        /**
         * Returns a JSON representation of the {PropertyDefinition}.
         *
         * @method consonant.PropertyDefinition.prototype.json
         * @returns {string} - A JSON representation of the {PropertyDefinition}.
         */
        var json = function () {
            return JSON.stringify(this, null, 4);
        };

        return {
            json: json,
        };
    }();

    /**
     * Parses a JSON string into a {PropertyDefinition}.
     *
     * @param {string} data - A JSON representation of a {PropertyDefinition}.
     * @param {string} name - Name of the property that is defined.
     * @returns {consonant.PropertyDefinition} - The parsed
     *                                           {PropertyDefinition} object.
     */
    consonant.PropertyDefinition.parseJSON = function (data, name) {
        var optional = data.optional || false;
        var definition = new PropertyDefinition(name, data.type, optional);

        var type_loaders = {
            'list': function () {
                var elements = PropertyDefinition.parseJSON(data.elements,
                                                            name);
                definition.elements = elements;
            },
            'raw': function () {
                if ('content-type-regex' in data) {
                    definition.content_type_regex = data['content-type-regex'];
                } else {
                    definition.content_type_regex = [];
                }
            },
            'reference': function () {
                if ('class' in data) {
                    definition.klass = data['class'];
                } else {
                    definition.klass = undefined;
                }

                if (data.schema) {
                    definition.schema = data.schema;
                } else {
                    definition.schema = undefined;
                }

                if (data.bidirectional) {
                    definition.bidirectional = data.bidirectional;
                } else {
                    definition.bidirectional = undefined;
                }
            },
            'text': function () {
                if (data.regex) {
                    definition.regex = data.regex;
                } else {
                    definition.regex = [];
                }
            }
        };

        if (data.type in type_loaders) {
            type_loaders[data.type]();
        }

        return definition;
    };



    /**
     * An object in a Consonant {Schema}.
     *
     * @constructor
     * @param {string} uuid - The object UUID.
     * @param {string} klass - The name of the corresponding object class.
     * @param {array} properties - An array mapping property names to {Property}
     *                             objects holding the properties of the object.
     * @returns {consonant.Object} - A new {Object} object.
     */
    consonant.Object = function (uuid, klass, properties) {
        /**
         * The UUID of the object.
         *
         * @member {string}
         */
        this.uuid = uuid;

        /**
         * The name of the class that the object is an instance of.
         *
         * @member {string}
         */
        this.klass = klass;

        /**
         * The object properties, stored in an associative array mapping property
         * names to {Property} objects.
         *
         * @member {array}
         */
        this.properties = properties;
    };

    consonant.Object.prototype = function () {
        /**
         * Returns a JSON representation of the {Object}.
         *
         * @method consonant.Object.prototype.json
         * @returns {string} - A JSON representation of the {Object}.
         */
        var json = function () {
            return JSON.stringify(this, null, 4);
        };

        /**
         * Looks up a property by its name and returns its value.
         *
         * @method consonant.Object.prototype.get
         * @param {string} name - Name of the property.
         * @returns {any} - The value of the property with the given name.
         */
        var get = function (name) {
            if (name in this.properties) {
                return this.properties[name].value;
            } else {
                return undefined;
            }
        };

        return {
            get: get,
            json: json,
        };
    }();

    /**
     * Parses a JSON string into a {Object}.
     *
     * @param {string} data - A JSON representation of a {Object}.
     * @param {string} klass - Name of the corresponding object class.
     * @returns {consonant.Object} - The parsed {Object} object.
     */
    consonant.Object.parseJSON = function (data) {
        var properties = {};
        for (var property_name in data.properties) {
            var property_data = data.properties[property_name];
            var property = Property.parseJSON(property_data, property_name);
            properties[property_name] = property;
        }
        return new consonant.Object(data.uuid, data['class'], properties);
    };



    /**
     * An object property in a Consonant {Schema}.
     *
     * @constructor
     * @param {string} name - The property name.
     * @param {string} value - The property value.
     * @returns {consonant.Property} - A new {Property} object.
     */
    consonant.Property = function (name, value) {
        /**
         * The property name.
         *
         * @member {string}
         */
        this.name = name;

        /**
         * The property value.
         *
         * @member {any}
         */
        this.value = value;
    };
    var Property = consonant.Property;

    consonant.Property.prototype = function () {
        /**
         * Returns a JSON representation of the {Property}.
         *
         * @method consonant.Property.prototype.json
         * @returns {string} - A JSON representation of the {Property}.
         */
        var json = function () {
            return JSON.stringify(this, null, 4);
        };

        return {
            json: json,
        };
    }();

    /**
     * Parses a JSON string into a {Property}.
     *
     * @param {string} data - A JSON representation of a {Property}.
     * @param {string} name - Name of the property.
     * @returns {consonant.Property} - The parsed {Property} object.
     */
    consonant.Property.parseJSON = function (data, name) {
        return new Property(name, data);
    };

    /**
     * TODO
     */
    consonant.Transaction = function (service) {
        /**
         * TODO
         */
        this.service = service;

        /**
         * TODO
         */
        this.actions = [];
    };
    var Transaction = consonant.Transaction;

    consonant.Transaction.prototype = function () {
        /**
         * TODO
         */
        var begin = function (source) {
            this.source = source;
        };

        /**
         * TODO
         */
        var commit = function (target, author, message, callback) {
            this.target = target;
            this.author = author;
            this.message = message;

            this.service.apply(this, callback);
        };

        /**
         * TODO
         */
        var create = function (klass, properties) {
            this.actions.push({
                'action': 'create',
                'id': this.actions.length,
                'class': klass,
                'properties': properties,
            });
            return this.actions.length-1;
        };

        /**
         * TODO
         */
        var update = function (uuid, properties) {
            this.actions.push({
                'action': 'update',
                'id': this.actions.length,
                'object': { 'uuid': uuid },
                'properties': properties,
            });
            return this.actions.length-1;
        };

        /**
         * TODO
         */
        var multipart_mixed = function () {
            var parts = [];

            // add multipart header
            parts.push(['multipart/mixed; boundary=CONSONANT', '']);

            // add begin action
            parts.push(['application/json', JSON.stringify({
                'action': 'begin',
                'source': this.source
            })]);

            $.each(this.actions, function (index, action) {
                parts.push(['application/json',
                            JSON.stringify(action)]);
            });

            // add commit action
            var date = new Date();
            var seconds = Math.round(date.getTime() / 1000);
            var timestamp = seconds + ' +0000';
            parts.push(['application/json', JSON.stringify({
                'action': 'commit',
                'target': this.target,
                'author': this.author,
                'author-date': timestamp,
                'committer': this.author,
                'committer-date': timestamp,
                'message': this.message
            })]);

            parts = $.map(parts, function (part) {
                var type = part[0];
                var data = part[1];
                return ['Content-Type: ' + type, '', data].join('\n');
            });
            parts = parts.join('\n--CONSONANT\n');

            return parts;
        };

        return {
            begin: begin,
            commit: commit,
            create: create,
            multipart_mixed: multipart_mixed,
            update: update,
        };
    }();

} (window.consonant = window.consonant || {}, jQuery));
