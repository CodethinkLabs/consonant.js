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
 * Various helper utilities for working with URLs and more.
 *
 * @constructor
 */
var Helpers = function () {
};

Helpers.prototype = function () {
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
Helpers.urljoin = function (segment) {
    var segments = [];
    for (var i = 0; i < arguments.length; i++) {
        var segment = arguments[i].replace(/(^[\s\/]+)|([\s\/]+$)/g, '');
        segments.push(segment);
    }
    return segments.join('/');
};



/**
 * A Consonant service.
 *
 * @constructor
 * @param {string} url - The HTTP URL of the Consonant service.
 * @returns {Service} A Service object for the given URL.
 */
var Service = function (url) {
    this.url = url;
};

Service.prototype = function () {
    /**
     * Callback that takes a refs dictionary, mapping canonical ref
     * names to {Ref} objects.
     *
     * @callback refsCallback
     * @param {array} A refs dictionary mapping ref names to {Ref} objects.
     */

    /**
     * Fetches all refs from the service and returns them via a callback.
     *
     * @method Service.prototype.refs
     * @param {refsCallback} callback - Callback to which the resulting refs
     *                                  are passed on.
     */
    var refs = function (callback) {
        var url = Helpers.urljoin(this.url, 'refs');
        $.getJSON(url, function (data) {
            var refs = {};
            for (name in data) {
                refs[name] = Ref.parseJSON(data[name]);
            }
            callback(refs);
        });
    };

    /**
     * Callback that takes a {Ref}.
     *
     * @callback refCallback
     * @param {Ref} A {Ref} object.
     */

    /**
     * Fetches a specific {Ref} from the service and returns it via a callback.
     *
     * @method Service.prototype.ref
     * @param {string} name - Name of the {Ref} to fetch.
     * @param {refCallback} callback - Callback to which the {Ref} is passed on.
     */
    var ref = function (name, callback) {
        var url = Helpers.urljoin(this.url, 'refs', name);
        $.getJSON(url, function (data) {
            var ref = Ref.parseJSON(data);
            callback(ref);
        });
    };

    /**
     * Callback that takes a {Commit}.
     *
     * @callback commitCallback
     * @param {Commit} A {Commit} object.
     */

    /**
     * Fetches a {Commit} from the service and returns it via a callback.
     *
     * @method Service.prototype.commit
     * @param {string} sha1 - SHA1 of the {Commit} to fetch.
     * @param {commitCallback} callback - Callback to which the {Commit} is
     *                                    passed on.
     */
    var commit = function (sha1, callback) {
        var url = Helpers.urljoin(this.url, 'commits', sha1);
        $.getJSON(url, function (data) {
            var commit = Commit.parseJSON(data);
            callback(commit);
        });
    };

    /**
     * Callback that takes a {string}.
     *
     * @callback stringCallback
     * @param {string} A string (e.g. the service name).
     */

    /**
     * Fetches the service name from a given {Commit} and returns it via
     * a callback.
     *
     * @method Service.prototype.name
     * @param {Commit} commit - {Commit} to fetch the service name from.
     * @param {stringCallback} callback - Callback to which the name is
     *                                    passed on.
     */
    var name = function (commit, callback) {
        var url = Helpers.urljoin(this.url, 'commits', commit.sha1, 'name');
        $.getJSON(url, function (data) {
            callback(data);
        });
    };

    /**
     * Callback that takes an array.
     *
     * @callback arrayCallback
     * @param {array} An array.
     */

    /**
     * Fetches the service aliases from a given {Commit} and returns them
     * via a callback.
     *
     * @method Service.prototype.services
     * @param {Commit} commit - {Commit} to fetch the service aliases from.
     * @param {arrayCallback} callback - Callback to which the service aliases
     *                                   are passed on.
     */
    var services = function (commit, callback) {
        var url = Helpers.urljoin(this.url, 'commits', commit.sha1, 'services');
        $.getJSON(url, function (data) {
            callback(data);
        });
    };

    /**
     * Callback that takes a {Schema}.
     *
     * @callback schemaCallback
     * @param {Schema} A {Schema}.
     */

    /**
     * Fetches the {Schema} from a given {Commit} and returns it via a callback.
     *
     * @method Service.prototype.schema
     * @param {Commit} commit - {Commit} to fetch the schema from.
     * @param {schemaCallback} callback - Callback to which the schema is
     *                                    passed on.
     */
    var schema = function (commit, callback) {
        var url = Helpers.urljoin(this.url, 'commits', commit.sha1, 'schema');
        $.getJSON(url, function (data) {
            var schema = Schema.parseJSON(data);
            callback(schema);
        });
    };

    return {
        commit: commit,
        name: name,
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
 * @param {Commit} head - The latest {Commit} in the {Ref}.
 */
var Ref = function (type, url_aliases, head) {
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
     * @member {Commit}
     */
    this.head = head;
};

Ref.prototype = function () {
    /**
     * Returns a JSON representation of the {Ref}.
     *
     * @method Ref.prototype.json
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
 * @returns {Ref} - The parsed {Ref} object.
 */
Ref.parseJSON = function (data) {
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
 */
var Commit = function (sha1, author, author_date, committer, committer_date,
                       parents, subject)
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
};

Commit.prototype = function () {
    /**
     * Returns a JSON representation of the {Commit}.
     *
     * @method Commit.prototype.json
     * @returns {string} - A JSON representation of the {Commit}.
     */
    var json = function () {
        return JSON.stringify(this, null, 4);
    };

    return {
        json: json,
    };
}();

/**
 * Parses a JSON string into a {Commit}.
 *
 * @param {string} data - A JSON representation of a {Commit}.
 * @returns {Commit} - The parsed {Commit} object.
 */
Commit.parseJSON = function (data) {
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
 */
var Schema = function (name, classes) {
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

Schema.prototype = function () {
    /**
     * Returns a JSON representation of the {Schema}.
     *
     * @method Schema.prototype.json
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
 * @returns {Schema} - The parsed {Schema} object.
 */
Schema.parseJSON = function (data) {
    var classes = {};
    for (class_name in data.classes) {
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
 */
var ClassDefinition = function (name, properties) {
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

ClassDefinition.prototype = function () {
    /**
     * Returns a JSON representation of the {ClassDefinition}.
     *
     * @method ClassDefinition.prototype.json
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
 * @returns {ClassDefinition} - The parsed {ClassDefinition} object.
 */
ClassDefinition.parseJSON = function (data) {
    var properties = {};
    for (property_name in data.properties) {
        var property_data = data.properties[property_name];
        var property_definition = PropertyDefinition.parseJSON(property_data,
                                                               property_name);
        properties[property_name] = property_definition;
    }
    return new ClassDefinition(null, properties);
};



/**
 * A property definition in a Consonant {Schema}.
 *
 * All property definitions include a type. Supported types are:
 * `boolean`, `integer`, `float`, `text`, `raw`, `reference`, `timestamp`, and
 * `list`.
 *
 * @constructor
 * @param {string} name - The name of the property.
 * @param {type} type - The property type ("text", "boolean", etc.)
 * @param {boolean} optional - Whether or not the property is optional.
 */
var PropertyDefinition = function (name, type, optional) {
    /**
     * The name of the property.
     *
     * @member {string}
     */
    this.name = name;

    /**
     * The property type. One of `boolean`, `integer`, `float`, `text`, `raw`,
     * `reference`, `timestamp` and `list`.
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
     * @member {PropertyDefinition}
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

PropertyDefinition.prototype = function () {
    /**
     * Returns a JSON representation of the {PropertyDefinition}.
     *
     * @method PropertyDefinition.prototype.json
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
 * @param {string name - Name of the property that is defined.
 * @returns {PropertyDefinition} - The parsed {PropertyDefinition} object.
 */
PropertyDefinition.parseJSON = function (data, name) {
    var optional = data.optional || false;
    var definition = new PropertyDefinition(name, data.type, optional);

    var type_loaders = {
        'list': function () {
            var elements = PropertyDefinition.parseJSON(data.elements, name);
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
