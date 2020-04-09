/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('evado/component/helper/MetaHelper');

module.exports = class MetaHelper extends Base {

    static resolveInteger (value, defaults, max = Number.MAX_SAFE_INTEGER) {
        return !Number.isInteger(value) ? defaults : value > max ? max : value;
    }

    static setModelRelated (data, models, attrs) {
        for (const attr of attrs) {
            for (const model of models) {
                const value = model.get(attr);
                if (Array.isArray(value)) {
                    const values = [];
                    for (const val of value) {
                        if (data[val]) {
                            values.push(data[val]);
                        }
                    }
                    model.related.set(attr, values);
                } else if (value) {
                    model.related.set(attr, data[value]);
                }
            }
        }
    }
};