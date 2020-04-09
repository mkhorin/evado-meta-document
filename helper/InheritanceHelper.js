/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const CLASS_MERGED_LIST_MAP = {
    attrs: true,
    groups: true
};
const CLASS_SKIPPED_MAP = {
    activeDescendants: true,
    parent: true
};
const EXTENDED_MAP = {
    actionBinder: true
};
const IMMUTABLE_ARRAY_MAP = {
    commands: true
};

const Base = require('areto/base/Base');

module.exports = class InheritanceHelper extends Base {

    static getNotEmptyArray (...arrays) {
        for (const array of arrays) {
            if (Array.isArray(array) && array.length > 0) {
                return array;
            }
        }
        return [];
    }

    static mergeClassData (child, parent) {
        for (const key of Object.keys(parent)) {
            if (CLASS_SKIPPED_MAP[key] === true) {
                continue;
            }
            if (CLASS_MERGED_LIST_MAP[key] === true) {
                child[key] = this.mergeObjectList(child[key], parent[key]);
            } else if (Array.isArray(parent[key]) && Array.isArray(child[key])) {
                child[key] = parent[key].concat(child[key]);
            } else if (!Object.prototype.hasOwnProperty.call(child, key)) {
                child[key] = parent[key];
            }
        }
    }

    static mergeObjectList (targets, sources, key = 'name') {
        const inserts = [];
        targets = Array.isArray(targets) ? targets : [];
        sources = Array.isArray(sources) ? sources : [];
        for (const source of sources) {
            if (source) {
                const item = ArrayHelper.searchByProperty(source[key], key, targets);
                item ? this.mergeData(item, source)
                     : inserts.push(source);
            }
        }
        return inserts.concat(targets);
    }

    static mergeData (target, source, savedSourceKeys = []) {
        for (const key of Object.keys(source)) {
            const hasSource = Object.prototype.hasOwnProperty.call(source, key);
            const hasTarget = Object.prototype.hasOwnProperty.call(target, key);
            if (EXTENDED_MAP[key] === true) {
                if (!hasTarget) {
                    target[key] = source[key];
                } else if (hasSource && target[key]) {
                    AssignHelper.assignUndefined(target[key], source[key]);
                }
            } else if (savedSourceKeys.includes(key) && hasSource) {
                target[key] = source[key];
            } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
                if (IMMUTABLE_ARRAY_MAP[key] !== true) {
                    target[key] = source[key].concat(target[key]);
                }
            } else if (!hasTarget) {
                target[key] = source[key];
            }
        }
    }

    static addParents (children, map) {
        for (const key of Object.keys(children)) {
            const parent = map[key] && map[key].data.parent;
            if (parent && !Object.prototype.hasOwnProperty.call(children, parent)) {
                Object.assign(children, this.addParents({[map[key].data.parent]: true}, map));
            }
        }
        return children;
    }
};

const AssignHelper = require('areto/helper/AssignHelper');
const ArrayHelper = require('areto/helper/ArrayHelper');