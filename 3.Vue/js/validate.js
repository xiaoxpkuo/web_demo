(function () {

window.getValidate = function(options) {
    options = options || {};
    $.extend(methods, options.methods);
    return {
        name: 'validate',
        data: function () {
            return {
                errors: {}
            };
        },
        computed: {
            isValid: function () {
                var errors = JSON.parse(JSON.stringify(this.errors));
                return $.isEmptyObject(errors);
            }
        },
        mounted: mounted,
        methods: {
            valid: function (selector) {
                var self = this;
                selector = selector || 'input, textarea, select';
                var $fieldList = $(self.$el).find(selector).trigger('check.validate');
                var errors = {};
                $fieldList.each(function () {
                    var name = $(this).attr('name');
                    if(self.errors[name]) {
                        errors[name] = self.errors[name];
                    }
                });
                return $.isEmptyObject(errors);
            }
        }
    };
};

var methods = {
    required: function (value, elem, param) {
        return value.length > 0;
    },
    mobile: function (value, elem, param) {
        return optional(elem) || /^1\d{10}$/.test(value);
    },
    equalto: function (value, elem, param) {
        return value === $(elem).closest('form').find(param).val();
    },
    mix: function (value, elem, param) {
        return optional(elem) || value >= param;
    },
    max: function (value, elem, param) {
        return optional(elem) || value <= param;
    },
    mixlength: function (value, elem, param) {
        var length = $.isArray( value ) ? value.length : getLength(value, elem);
        return optional(elem) || length >= param;
    },
    maxlength: function (value, elem, param) {
        var length = $.isArray( value ) ? value.length : getLength(value, elem);
        return optional(elem) || length <= param;
    },
    range: function (value, elem, param) {
        var range = getRange(param);
        if(!range) {
            return true;
        }
        return optional(elem) || (value >= range[0] && value <= range[1]);
    },
    rangelength: function (value, elem, param) {
        var range = getRange(param);
        if(!range) {
            return true;
        }
        var length = getLength(value, elem);
        return optional(elem) || (length >= range[0] && length <= range[1]);
    }
};

function getLength(value, elem) {
    switch (elem.nodeName.toLowerCase()) {
    case 'select':
        return $('option:selected', elem).length;
    case 'input':
        if (checkable(elem)) {
            var $field = $(elem).closest('form').find('[name="' + elem.name + '"]');
            return $field.filter(":checked").length;
        }
    }
    return value.length;
}

function checkable(elem) {
    return (/radio|checkbox/i).test(elem.type);
}

function getRange(param) {
    var range = param.match(/(\d+)\s*,\s*(\d+)/);
    if(range) {
        return [Number(range[1]), Number(range[2])];
    }
    return range;
}

function optional(elem) {
    return !$(elem).val();
}

function mounted() {
    var self = this;
    $(this.$el).on('focusin.validate focusout.validate keyup.validate check.validate',
        'input, textarea, select', function (event) {
        var field = event.target;
        Vue.delete(self.errors, field.name);
        $.each(getRules(field), function (key, value) {
            var valid = methods[key]($(field).val(), field, value);
            if(!valid) {
                var message = valid ? null : $(field).data('message-' + key);
                Vue.set(self.errors, field.name, message);
            }
            return valid;
        });
    });
}

function getRules(field) {
    var rules = {};
    $.each($(field).data(), function (key, value) {
        if(key.slice(0, 4) === 'rule') {
            var name = key.slice(4).toLowerCase();
            rules[name] = value;
        }
    });
    return rules;
}

})();