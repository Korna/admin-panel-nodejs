function addItem(){
    var ul = document.getElementById("dynamic-list");
    var candidate = document.getElementById("candidate");
    var li = document.createElement("li");
    li.setAttribute('id',candidate.value);
    li.appendChild(document.createTextNode(candidate.value));
    ul.appendChild(li);
}

function removeItem(){
    var ul = document.getElementById("dynamic-list");
    var candidate = document.getElementById("candidate");
    var item = document.getElementById(candidate.value);
    ul.removeChild(item);
}

function add(){
    var list = document.getElementById('demo');
    var entry = document.getElementById('formAddName');
    entry.onsubmit = function(evt) {
        evt.preventDefault();
        var firstName = document.getElementById('firstName').value;
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(firstName));
        list.appendChild(entry);
    }

}