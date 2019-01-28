module.exports = function (template) {
    const html = template.replace(/\n/g, '%%%%%%');
    return {
        template: html.match(/<template>([^]+)<\/template>/)[1].replace(/%%%%%%/g, ''),
        script: html.match(/<script>([^]+)<\/script>/)[1].replace(/%%%%%%/g, '\n'),
        style: html.match(/<style .*>([^]+)<\/style>/)[1].replace(/%%%%%%/g, '')
    };
};
