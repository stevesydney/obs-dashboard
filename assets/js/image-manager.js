const socket = io();

const reader = new FileReader();
const formEl = document.getElementById('new-image-form');
const nameEl = document.getElementById('new-image-name');
const tagsEl = document.getElementById('new-image-tags');
const imageEl = document.getElementById('new-image-upload');

const image_obj = {
    meta: {}
};

const addImageData = data => {
    image_obj.data = data;
};

const addFilename = name => {
    image_obj.meta.filename = name;
};

const addType = type => {
    image_obj.meta.type = type;
};

const addTags = tags => {
    image_obj.meta.tags = tags.replace(/\s*,\s*/g, ',');
    //tags.split(',').map(tag => image_obj.tags.push(tag));
};

const addName = name => {
    image_obj.meta.name = name;
};

reader.onload = handleFileRead;

imageEl.addEventListener('change', handleFileUpload, false);

function handleFileRead(e) {
    addImageData(e.target.result);
}

function handleFileUpload(e) {
    const image = e.target.files[0];
    addFilename(image.name);
    addType(image.type);
    reader.readAsDataURL(image);
}


formEl.addEventListener('submit', function(e) {
    e.preventDefault();
    addName(nameEl.value);
    addTags(tagsEl.value);

    socket.emit('new image', image_obj);
});

socket.on('new image', function(data) {
    console.log(data);
});
