// monkey patch ejs
var jade = require('jade'), old_parse = jade.Compiler.prototype.compile;
jade.Compiler.prototype.compile = function () {
    var str = old_parse.apply(this, Array.prototype.slice.call(arguments));
    // console.log(str);
    return 'arguments.callee.buf = buf;' + str;
};

/**
 * This extension will be used by default for all template files
 */
exports.extension = '.jade';

/**
 * Original templating engine
 */
exports.module = 'jade';

/**
 * Get source template filename
 */
exports.template = function (name) {
    return __dirname + '/templates/' + name + '.jade';
};

exports.templateText = function (name, data) {
    switch (name) {

        case 'default_action_view':
        return '.page-header\n  h1 ' + data.join('#') + '\n';

        case 'scaffold_form':
        var form = '';
        data.forEach(function (property) {
            switch (property.type) {
                case 'Boolean':
                form += [
                    '.clearfix',
                    '  != form.label("' + property.name + '")',
                    '  .input',
                    '    != form.checkbox("' + property.name + '")',
                ].join('\n') + '\n';
                break;
                default:
                form += [
                    '.clearfix',
                    '  != form.label("' + property.name + '")',
                    '  .input',
                    '    != form.input("' + property.name + '")',
                ].join('\n') + '\n';
            }
        });
        return form;
    }
};
