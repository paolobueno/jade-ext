var fs = require('fs');

// monkey patch ejs
try {
    var jade = require('jade'), old_parse = jade.Compiler.prototype.compile;
    jade.Compiler.prototype.compile = function () {
        var str = old_parse.apply(this, Array.prototype.slice.call(arguments));
        // console.log(str);
        return 'arguments.callee.buf = buf;' + str;
    };
} catch (e) {
    // disregard
}

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

        case 'scaffold_show':
        var fields = [];
        data.forEach(function (property) {
            switch (property.type) {
                default:
                fields.push(
                    '    tr\n' +
                    '      th ' + property.name + '\n'+
                    '      td= model.' + property.name + '\n');
                break;
            }
        });
        return fs.readFileSync(exports.template('scaffold_show')).toString().replace(/FIELDS/, fields.join('\n'));

        case 'scaffold_form':
        var form = '';
        data.forEach(function (property) {
            switch (property.type) {
                case 'Boolean':
                form += [
                    '.control-group',
                    '  != form.label("' + property.name + '", false, {class: "control-label"})',
                    '  .controls',
                    '    != form.checkbox("' + property.name + '")'
                ].join('\n') + '\n';
                break;
                case 'Date':
                form += [
                    '.control-group',
                    '  != form.label("' + property.name + '", false, {class: "control-label"})',
                    '  .controls',
                    '    != form.input("' + property.name + '", {type: \'date\'})'
                ].join('\n') + '\n';
                break;
                case 'Number':
                form += [
                    '.control-group',
                    '  != form.label("' + property.name + '", false, {class: "control-label"})',
                    '  .controls',
                    '    != form.input("' + property.name + '", {type: \'number\'})'
                ].join('\n') + '\n';
                break;
                default:
                form += [
                    '.control-group',
                    '  != form.label("' + property.name + '", false, {class: "control-label"})',
                    '  .controls',
                    '    != form.input("' + property.name + '")'
                ].join('\n') + '\n';
            }
        });
        return form;
    }
};
