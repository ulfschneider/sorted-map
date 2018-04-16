'use strict'

function SoMap(iterable, comparator) {
    this.size = 0;
    this.root = null;

    this.compare = function(a, b) {
        if (comparator) {
            return comparator(a, b);
        } else if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }

    this.Node = function(key, value) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
    }

    if (iterable) {
        var iterator = iterable[Symbol.iterator]();
        var next = iterator.next();
        while (!next.done) {
            this.set(next.value[0], next.value[1]);
            next = iterator.next();
        }
    }
}

SoMap[Symbol.species] = SoMap;

SoMap.prototype[Symbol.iterator] = function() {
    return this.entries();
}

SoMap.prototype[Symbol.toStringTag] = 'SoMap';

SoMap.prototype.set = function(key, value) {
    var tree = this;

    var insert = function(parent, node) {
        if (parent == null) {
            //empty tree
            tree.root = node;
            tree.size = 1;
        } else if (tree.compare(parent.key, node.key) == 0) {
            //same key, replace only value
            parent.value = node.value;
        } else if (tree.compare(node.key, parent.key) < 0) {
            //follow left path
            if (parent.left) {
                return insert(parent.left, node);
            } else {
                parent.left = node;
                tree.size++;
            }
        } else {
            //follow right path
            if (parent.right) {
                return insert(parent.right, node);
            } else {
                parent.right = node;
                tree.size++;
            }
        }
        return node;
    }

    var node = new tree.Node(key, value);
    insert(tree.root, node);
}


SoMap.prototype['delete'] = function(key) {
    var tree = this;

    var min = function(node) {
        if (node) {
            if (node.left) {
                return min(node.left);
            } else {
                return node;
            }
        }
        return null;
    }

    var del = function(node, key) {
        if (node) {
            if (tree.compare(key, node.key) > 0) {
                node.right = del(node.right, key);
            } else if (tree.compare(key, node.key) < 0) {
                node.left = del(node.left, key);
            } else if (tree.compare(key, node.key) == 0) {
                if (!node.left) {
                    tree.size--;
                    return node.right
                } else if (!node.right) {
                    tree.size--;
                    return node.left;
                } else {
                    var m = min(node.right);
                    node.key = m.key;
                    node.value = m.value;
                    node.right = del(node.right, node.key);
                }
            }

            return node;
        } else {
            return null;
        }
    }

    tree.root = del(tree.root, key);
}

SoMap.prototype.clear = function() {
    this.size = 0;
    this.root = null;
}

SoMap.prototype.has = function(key) {
    return this.get(key) != null;
}

SoMap.prototype.get = function(key) {
    var tree = this;
    var node = this.root;
    while (node) {
        if (tree.compare(node.key, key) < 0) {
            node = node.right;
        } else if (tree.compare(node.key, key) > 0) {
            node = node.left;
        } else if (tree.compare(node.key, key) == 0) {
            return node.value;
        }
    }
    return null;
}

SoMap.prototype.forEach = function(callback, thisArg) {
    //callback with param: value, key, index, thisArg
    var index = 0;
    var inOrderTraversal = function(node) {
        if (node) {
            inOrderTraversal(node.left);
            callback(node.value, node.key, index, thisArg);
            index++;
            inOrderTraversal(node.right);
        }
    }

    inOrderTraversal(this.root);
}

SoMap.prototype.entries = function() {
    var i = 0;
    var entries = [];
    this.forEach(function(value, key) {
        entries.push([key, value]);
    });

    return {
        next: function() {
            return i < entries.length ? {
                done: false,
                value: entries[i++],
            } : {
                done: true
            }
        },
        [Symbol.iterator]: function() {
            return this;
        },
        return: function() {
            i = entries.length;
            return {
                done: true
            }
        }
    }
}

SoMap.prototype.keys = function() {
    var i = 0;
    var entries = [];
    this.forEach(function(value, key) {
        entries.push(key);
    });

    return {
        next: function() {
            return i < entries.length ? {
                done: false,
                value: entries[i++],
            } : {
                done: true
            }
        },
        [Symbol.iterator]: function() {
            return this;
        },
        return: function() {
            i = entries.length;
            return {
                done: true
            }
        }
    }
}

SoMap.prototype.values = function() {
    var i = 0;
    var entries = [];
    this.forEach(function(value, key) {
        entries.push(value);
    });

    return {
        next: function() {
            return i < entries.length ? {
                done: false,
                value: entries[i++],
            } : {
                done: true
            }
        },
        [Symbol.iterator]: function() {
            return this;
        },
        return: function() {
            i = entries.length;
            return {
                done: true
            }
        }
    }
}

SoMap.prototype.toString = function() {
    var size = this.size;
    var result = this[Symbol.toStringTag] + ' ' + size + ' {';

    this.forEach(function(value, key, i) {
        result += ' ' + key + ' => ' + value;
        result += i < size - 1 ? ',' : '';
    });
    result += ' }';
    return result;
}

SoMap.prototype.isEmpty = function() {
    return this.size == 0;
}

SoMap.prototype.min = function() {
    var node = this.root;
    while (node && node.left) {
        node = node.left;
    }
    if (node) {
        return {
            key: node.key,
            value: node.value
        }
    } else {
        return null;
    }
}

SoMap.prototype.max = function() {
    var node = this.root;
    while (node && node.right) {
        node = node.right;
    }
    if (node) {
        return {
            key: node.key,
            value: node.value
        }
    } else {
        return null;
    }

}


//exports
module.exports = SoMap;