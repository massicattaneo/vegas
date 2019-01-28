function Node(markup) {
    const div = document.createElement('div');
    div.innerHTML = markup;
    return div.children[0];
}

function createComponents(node, components, options, array = []) {
    if (node.getAttribute('data-component')) {
        const component = components[node.getAttribute('data-component')];
        const { template, script } = component;
        const props = JSON.parse(node.getAttribute('data-props'));
        node.removeAttribute('data-props');
        const obj = { node, props, template, script };
        component.default.call(obj, options);
        array.push(obj);
    }
    const [...children] = node.children;
    children.forEach(i => createComponents(i, components, options, array));
    return array;
}

module.exports = { Node, createComponents };
