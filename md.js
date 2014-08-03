var marked = require('marked');

exports.translate = function(load) {
  // Turn this into a dom structure
  var tmp = document.createElement('div');
  tmp.innerHTML = marked(load.source);

  var mDoc = create(tmp, 0).trim() + ';';
  load.source = "module.exports = function() { return " + mDoc + "};";
};

function create(el, tabCount) {
  var content;
  if(el.nodeType === 3) {
    content = wrapBreaks(el.textContent);
    return tabs(tabCount) + '"' + content + '"\n';
  }

  var tag = el.tagName.toLowerCase();
  var attrs = {}, attr;
  for(var i = 0, len = el.attributes.length; i < len; i++) {
    attr = el.attributes[i];
    attrs[attr.name] = attr.value;
  }

  var vel = tabs(tabCount) + 'm("' + tag + '", ' +
    JSON.stringify(attrs) + ', [';

  // Loop through childs
  var children = [], value;
  for(var i = 0, len = el.childNodes.length; i < len; i++) {
    value = create(el.childNodes[i], tabCount + 1);
    if(value.length) {
      vel += value +
        (i === len - 1 ? "" : ",")
    }
  }

  return vel + tabs(tabCount) + '])';
}

function tabs(count) {
  count = count || 0;
  var out = "\n";
  for(var i = 0; i < count; i++) {
    out += "\t";
  }
  return out;
}

function wrapBreaks(txt) {
  return (txt || "")
    .replace('\n', '\\n')
    .replace('\r', '\\r');
}
