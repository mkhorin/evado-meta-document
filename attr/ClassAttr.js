/**
 * @copyright Copyright (c) 2020 Maxim Khorin (maksimovichu@gmail.com)
 */
'use strict';

const Base = require('./ViewAttr');

module.exports = class ClassAttr extends Base {

    init () {
        this.name = this.data.name;
        this.type = this.data.type || TypeHelper.TYPES.STRING;
        this.viewType = this.data.viewType || this.type;
        this.view = this.view || this.class;
        this.id = `${this.name}.${this.class.id}`;
        this.classAttr = this;
        this.templateKey = `_attr/${this.class.name}/${this.name}`;
        this.translationKey = `${this.class.translationKey}.attr.${this.name}`;
        this.initCommon();
    }

    setParent () {
        const parent = this.class.getParent();
        this.parent = parent ? parent.getAttr(this.name) : null;
    }

    createRelation () {
        if (this.data.refClass) {
            this.relation = new Relation({attr: this});
            this.setRelationViews();
        }
    }

    createAttrs () {
        this.attrs = [];
        for (const data of this.data.children) {
            const attr = this.class.createAttr(data);
            if (attr) {
                this.attrs.push(attr);
            }
        }
    }

    createCalc () {
        const expression = this.data.expression;
        this.calc = this.parent && this.parent.data.expression === expression
            ? this.parent.calc
            : this.spawnCalc(expression);
    }

    prepareBehaviors () {
        super.prepareBehaviors();
        if (this.data.trim && !this.isReadOnly() && (this.isString() || this.isText())) {
            this.class.addAttrBehavior(this, {type: 'trim'});
        }
    }

    resolveHeader (docs) {
        if (this.data.asRaw || !this.relation) {
            return;
        }
        if (this.relation.refClass.header) {
            return this.relation.refClass.header.resolve(docs);
        }
        for (const doc of docs) {
            doc._$title = doc[this.relation.refClass.getKey()];
        }
    }
};

const Relation = require('./Relation');
const TypeHelper = require('../helper/TypeHelper');