/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class BackRefUserFilter extends Base {

    constructor (config) {
        super({
            attr: 'executor',
            userAttr: 'user',
            ...config
        });
    }

    async apply (query) {
        const user = query.controller.user.getId();
        const attr = query.view.class.getAttr(this.attr);
        const ids = await attr.relation.refClass.find({[this.userAttr]: user}).column(this.attr);
        return query.and({[query.view.getKey()]: ids});
    }
};