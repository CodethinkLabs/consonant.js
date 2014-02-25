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
            var refs = [];
            for (name in data) {
                refs[name] = Ref.parseJSON(data[name]);
            }
            callback(refs);
        });
    };

    return {
        refs: refs,
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
     * @member {string}
     */
    this.type = type;

    /**
     * An array with aliases of the ref.
     * @member {array}
     */
    this.url_aliases = url_aliases;

    /**
     * The latest {Commit} in the {Ref}.
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
 * @param {string} - A JSON representation of a {Ref}.
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
     * @member {string}
     */
    this.sha1 = sha1;

    /**
     * The author of the commit.
     * @member {string}
     */
    this.author = author;

    /**
     * The date the commit was authored.
     * @member {string}
     */
    this.author_date = author_date;

    /**
     * The person who created the commit.
     * @member {string}
     */
    this.committer = committer;

    /**
     * The date the commit was created.
     * @member {string}
     */
    this.committer_date = committer_date;

    /**
     * An array of parent commit SHA1s.
     * @member {array}
     */
    this.parents = parents;

    /**
     * The commit subject.
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
 * @param {string} - A JSON representation of a {Commit}.
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
