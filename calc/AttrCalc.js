/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

// ["$attr", "attrName"]
// ["$attr", "refAttrName", "attrName"]
// ["$attr", "$key"] // primary key
// ["$descendants", "parentAttrName", [condition]] // get descendant ids by parent

// ".attrName"
// ".refAttrName.attrName"

const Base = require('./Calc');

module.exports = class AttrCalc extends Base {

    init () {
        this.view = this.attr.view;
        super.init();
        if (this.attr.defaultValue) {
            this.resolveExpression = this.resolve;
            this.resolve = this.resolveDefaultValue;
        }
    }

    normalizeData (data) {
        if (typeof data === 'string' && data.indexOf('.') === 0) {
            return ['$attr', ...data.split('.').slice(1)];
        }
        return super.normalizeData(data);
    }

    getTokenClass (data) {
        if (Array.isArray(data)) {
            switch (data[0]) {
                case '$attr': return CalcAttr;
                case '$descendants': return CalcDescendants;
            }
        }
        return super.getTokenClass(data);
    }

    async resolveDefaultValue () {
        const value = await this.resolveExpression(...arguments);
        return value === undefined
            ? this.attr.defaultValue.resolve(...arguments)
            : value;
    }

    async resolveAll (models) {
        for (const model of models) {
            model.set(this.attr, await this.resolve(model));
        }
    }

    resolveToken (model) {
        return this.token.resolve({
            view: model.view,
            user: model.user,
            model
        });
    }

    log () {
        CommonHelper.log(this.attr, this.constructor.name, ...arguments);
    }
};

const CommonHelper = require('areto/helper/CommonHelper');
const CalcAttr = require('./CalcAttr');
const CalcDescendants = require('./CalcDescendants');