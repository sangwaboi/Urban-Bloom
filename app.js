class PlantIdentificationService {
    constructor() {
        
        this.apiKey = "AIzaSyCsXIzac-9mHrqVtsN6y4Hlk_DMT012HRE"; 
        this.apiUrl = "https://aistudio.google.com/app/apikey"; 
    }

    async identifyPlant(imageFile) {
        const formData = new FormData();
        formData.append('images', imageFile); 
        formData.append('organs', 'leaf'); 
        formData.append('api_key', this.apiKey); 

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to identify plant');
            }

            return result;
        } catch (error) {
            console.error('Error identifying plant:', error);
            throw error; 
        }
    }
}

const plantService = new PlantIdentificationService();
const videoElement = document.getElementById('video');
const captureButton = document.getElementById('captureButton');
const imagePreview = document.getElementById('imagePreview');
const canvas = document.getElementById('canvas');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const imageUpload = document.getElementById('imageUpload');

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            videoElement.srcObject = stream;
        })
        .catch(function(err) {
            console.log("Error accessing camera: " + err);
        });
}

captureButton.addEventListener('click', function() {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');
    imagePreview.src = imageDataUrl;
    imagePreview.style.display = 'block';
});

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

async function identifyPlant() {
    let imageFile;
    if (imagePreview.src.startsWith('data:image')) {
        imageFile = dataURLtoFile(imagePreview.src, 'plant_image.png');
    } else {
        alert('Please capture or upload an image first');
        return;
    }

    resultDiv.innerHTML = '';
    loadingDiv.style.display = 'block';

    try {
        const apiResponse = await plantService.identifyPlant(imageFile);
        displayPlantDetails(apiResponse);
    } catch (error) {
        resultDiv.innerHTML = `<p>Error identifying plant: ${error.message}</p>`;
    } finally {
        loadingDiv.style.display = 'none';
    }
}

function displayPlantDetails(apiResponse) {
    const resultDiv = document.getElementById('result');

    if (apiResponse.suggestions && apiResponse.suggestions.length > 0) {
        const plant = apiResponse.suggestions[0]; 

        resultDiv.innerHTML = `
            <div class="detail-card">
                <h2>Identified Plant</h2>
                <p><strong>Scientific Name:</strong> ${plant.scientific_name}</p>
                <p><strong>Common Name:</strong> ${plant.common_name || 'Unknown'}</p>
                <p><strong>Confidence:</strong> ${(plant.probability * 100).toFixed(2)}%</p>
            </div>

            <div class="detail-card">
                <h3>Plant Details</h3>
                <p><strong>Origin:</strong> ${plant.origin || 'Unknown'}</p>
                <p><strong>Watering Needs:</strong> ${plant.watering_needs || 'Unknown'}</p>
                <p><strong>Light Requirements:</strong> ${plant.light_requirements || 'Unknown'}</p>
                <p><strong>Care Level:</strong> ${plant.care_level || 'Unknown'}</p>
                <p><strong>Toxicity:</strong> ${plant.toxicity || 'Unknown'}</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = '<p>No plant could be identified. Please try another image.</p>';
    }
}

function dataURLtoFile(dataURL, filename) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);

    for (let n = 0; n < bstr.length; n++) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}const chatOneBox = document.getElementById('chatOneBox');
const chatOneMessageInput = document.getElementById('chatOneMessageInput');
const chatOneSendBtn = document.getElementById('chatOneSendBtn');

const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

chatOneSendBtn.addEventListener('click', () => {
    const messageText = chatOneMessageInput.value.trim();

    if (messageText) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sent');
        messageElement.textContent = messageText;

        chatOneBox.appendChild(messageElement);
        chatOneBox.scrollTop = chatOneBox.scrollHeight;

        chatOneMessageInput.value = '';
    }
});

chatOneMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        chatOneSendBtn.click();
    }
});

sendBtn.addEventListener('click', () => {
    const messageText = messageInput.value.trim();

    if (messageText) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sent');
        messageElement.textContent = messageText;

        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
