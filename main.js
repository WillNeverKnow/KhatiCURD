// Initialize Firebase with your project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbUoKsSovN14loWebbG-TjDBFd-cORC9M",
  authDomain: "khati-66403.firebaseapp.com",
  databaseURL: "https://khati-66403-default-rtdb.firebaseio.com",
  projectId: "khati-66403",
  storageBucket: "khati-66403.appspot.com",
  messagingSenderId: "806817050418",
  appId: "1:806817050418:web:ff8fcab325574e2292f12b",
  measurementId: "G-B0M0JS7T5X"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const userForm = document.getElementById('userForm');
const userData = document.getElementById('userData');

// Function to update form data for editing
function updateFormData(doc) {
    document.getElementById('username').value = doc.data().username || '';
    document.getElementById('instaUsername').value = doc.data().instaUsername || '';
    document.getElementById('address').value = doc.data().address || '';
    document.getElementById('bannerUrl').value = doc.data().bannerUrl || '';
    document.getElementById('direction').value = doc.data().direction || '';
    document.getElementById('menu_photos').value = (doc.data().menu_photos || []).join(', ');
    document.getElementById('per_two_person_cost').value = doc.data().per_two_person_cost || '';
    document.getElementById('place').value = doc.data().place || '';
    document.getElementById('post_photos').value = (doc.data().post_photos || []).join(', ');
    document.getElementById('vibe_photos').value = (doc.data().vibe_photos || []).join(', ');
    document.getElementById('photo').value = doc.data().photo || '';
    document.getElementById('toggle').checked = doc.data().toggle || false;

    userForm.removeEventListener('submit', handleSubmit);
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const editedUsername = document.getElementById('username').value || '';
        const editedInstaUsername = document.getElementById('instaUsername').value || '';
        const editedAddress = document.getElementById('address').value || '';
        const editedBannerUrl = document.getElementById('bannerUrl').value || '';
        const editedDirection = document.getElementById('direction').value || '';
        const editedMenuPhotos = document.getElementById('menu_photos').value.split(',').map(item => item.trim());
        const editedVibePhotos = document.getElementById('vibe_photos').value.split(',').map(item => item.trim());
        const editedPerTwoPersonCost = document.getElementById('per_two_person_cost').value || '';
        const editedPlace = document.getElementById('place').value || '';
        const editedPostPhotos = document.getElementById('post_photos').value.split(',').map(item => item.trim());
        const editedPhoto = document.getElementById('photo').value || '';
        const editedToggle = document.getElementById('toggle').checked;

        const directionInput = document.getElementById('coordinates').value;
        const [latitude, longitude] = directionInput.split(',').map(item => item.trim());

        db.collection('users')
            .doc(doc.id)
            .update({
                username: editedUsername,
                instaUsername: editedInstaUsername,
                vibe_photos: editedVibePhotos,
                address: editedAddress,
                bannerUrl: editedBannerUrl,
                direction: editedDirection,
                menu_photos: editedMenuPhotos,
                per_two_person_cost: editedPerTwoPersonCost,
                place: editedPlace,
                post_photos: editedPostPhotos,
                photo: editedPhoto,
                toggle: editedToggle,
                coordinates: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                },
            })
            .then(() => {
                alert('Data successfully updated!');
                userForm.reset();
                userForm.removeEventListener('submit', handleSubmit);
                userForm.addEventListener('submit', handleSubmit);
            })
            .catch((error) => {
                console.error('Error updating document: ', error);
                alert('An error occurred while updating data. Please try again later.');
            });
    });
}

// Function to handle form submission for new data
function handleSubmit(event) {
    event.preventDefault();

    const username = document.getElementById('username').value || '';
    const instaUsername = document.getElementById('instaUsername').value || '';
    const address = document.getElementById('address').value || '';
    const bannerUrl = document.getElementById('bannerUrl').value || '';
    const direction = document.getElementById('direction').value || '';
    const menu_photos = document.getElementById('menu_photos').value.split(',').map(item => item.trim());
    const per_two_person_cost = document.getElementById('per_two_person_cost').value || '';
    const place = document.getElementById('place').value || '';
    const vibe_photos = document.getElementById('vibe_photos').value.split(',').map(item => item.trim());

    const post_photos = document.getElementById('post_photos').value.split(',').map(item => item.trim());
    const photoUrl = document.getElementById('photoUrl').value || '';
    const toggle = !document.getElementById('toggle').checked;
    const directionInput = document.getElementById('coordinates').value||'';
    const [latitude, longitude] = directionInput.split(',').map(item => item.trim());


    db.collection('users')
        .add({
            username: username,
            instaUsername: instaUsername,
            address: address,
            bannerUrl: bannerUrl,
            direction: direction,
            menu_photos: menu_photos,
            per_two_person_cost: per_two_person_cost,
            place: place,
            post_photos: post_photos,
            photoUrl: photoUrl,
            toggle: toggle,
            vibe_photos: vibe_photos,

            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            coordinates: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            },
        })
        .then(() => {
            alert('Data successfully submitted!');
            userForm.reset();
        })
        .catch((error) => {
            console.error('Error adding document: ', error);
            alert('An error occurred. Please try again later.');
        });
}

userForm.addEventListener('submit', handleSubmit);
// Fetch data from Firestore and display it in a table format
function displayUserData(doc) {
    const tr = document.createElement('tr');
    
    // Add a new column for the document UID
    const uidTd = document.createElement('td');
    uidTd.textContent = doc.id; // Set the text content of the cell to the document UID
    tr.appendChild(uidTd);

    // Add other columns for user data
    const fields = [
        'username',
        'instaUsername',
        'address',
        'bannerUrl',
        'direction',
        'menu_photos',
        'per_two_person_cost',
        'place',
        'post_photos',
        'photoUrl',
        'toggle',
    ];

   fields.forEach((field) => {
        const td = document.createElement('td');
        const data = doc.data()[field];

        if (field === 'menu_photos' || field === 'post_photos') {
            if (Array.isArray(data)) {
                // Remove extra spaces after commas and store the cleaned data as an attribute
                const cleanedData = data.map(item => item.trim());
                td.setAttribute('data-value', JSON.stringify(cleanedData));
                td.textContent = cleanedData.join(','); // Display cleaned data with spaces in the table cell
            } else {
                td.textContent = '';
            }
        } else {
            td.textContent = data || ''; // Handle case when data is undefined or null
        }
        tr.appendChild(td);
    });

    // Add action buttons
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.setAttribute('class', 'btn btn-secondary');
    editButton.addEventListener('click', () => {
        updateFormData(doc);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('class', 'btn btn-danger');
    deleteButton.addEventListener('click', () => {
        // Delete the Firestore document
        db.collection('users')
            .doc(doc.id)
            .delete()
            .then(() => {
                alert('Data successfully deleted!');
            })
            .catch((error) => {
                console.error('Error deleting document: ', error);
                alert('An error occurred while deleting data. Please try again later.');
            });
    });

    const tdAction = document.createElement('td');
    tdAction.appendChild(editButton);
    tdAction.appendChild(deleteButton);
    tr.appendChild(tdAction);

    userData.appendChild(tr);
}
// Fetch data from Firestore collection 'users' and display it in the table
db.collection('users')
    .get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            displayUserData(doc);
        });
    });
// Function to handle the search operation
function handleSearch() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const tableRows = userData.getElementsByTagName('tr');

    for (let i = 1; i < tableRows.length; i++) { // Start from index 1 to skip the table header row
        const row = tableRows[i];
        const rowData = row.textContent.toLowerCase();

        if (rowData.includes(searchInput)) {
            row.style.display = ''; // Show the row if it matches the search input
        } else {
            row.style.display = 'none'; // Hide the row if it doesn't match the search input
        }
    }
}

// Attach an event listener to the search button
document.getElementById('searchButton').addEventListener('click', handleSearch);
