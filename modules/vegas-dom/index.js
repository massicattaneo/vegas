function Node(markup) {
    const div = document.createElement('div');
    div.innerHTML = markup;
    return div.children[0];
}

module.exports = { Node };
