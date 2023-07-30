// Initialize Firebase with your project's configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAAlQUSqHUBr_cTRNFKtVzV9vkKJQt6wQ",
    authDomain: "khati-app.firebaseapp.com",
    databaseURL: "https://khati-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "khati-app",
    storageBucket: "khati-app.appspot.com",
    messagingSenderId: "675664862411",
    appId: "1:675664862411:web:d32ce4914638ac95014f4e",
    measurementId: "G-JW5PHGM5RC"
};
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
// Initialize Firebase with your project's configuration (you should have already done this before)
// ...

const userForm = document.getElementById('userForm');
const userData = document.getElementById('userData');

userForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the values from the form
    const username = document.getElementById('username').value;
    const address = document.getElementById('address').value;

    const bannerUrl = document.getElementById('bannerUrl').value;
    const direction = document.getElementById('direction').value;
    const menu_photos = document.getElementById('menu_photos').value.split(',');
    const per_two_person_cost = document.getElementById('per_two_person_cost').value;
    const place = document.getElementById('place').value;
    const post_photos = document.getElementById('post_photos').value.split(',');
    const photoURL = document.getElementById('photoURL').value;
    const toggle = document.getElementById('toggle').value;

    // Store the data in Firestore
    db.collection('users').add({
        username: username,
        address: address,

        bannerUrl: bannerUrl,
        direction: direction,
        menu_photos: menu_photos,
        per_two_person_cost: per_two_person_cost,
        place: place,
        post_photos: post_photos,
        photoURL: photoURL,
        toggle: toggle,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(() => {
            alert('Data successfully submitted!');
            userForm.reset();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            alert('An error occurred. Please try again later.');
        });
});

// Fetch data from Firestore and display it in a table format
function displayUserData(doc) {
    const userData = document.getElementById('userData');
    const tr = document.createElement('tr');

    const fields = [
        'username',
        'address',
        'bannerUrl',
        'direction',
        'menu_photos',
        'per_two_person_cost',
        'place',
        'post_photos',
        'photoURL',
        'toggle',
    ];

    fields.forEach((field) => {
        const td = document.createElement('td');
        const data = doc.data()[field];

        if (field === 'menu_photos' || field === 'post_photos') {
            if (Array.isArray(data)) {
                td.textContent = data.join(', ');
            } else {
                td.textContent = '';
            }
        } else {
            td.textContent = data || ''; // Handle case when data is undefined or null
        }
        tr.appendChild(td);
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.setAttribute('class', 'btn btn-secondary');
    editButton.addEventListener('click', () => {
        // Populate the form fields with the data from the selected row
        document.getElementById('username').value = doc.data().username;
        document.getElementById('address').value = doc.data().address;
        document.getElementById('bannerUrl').value = doc.data().bannerUrl;
        document.getElementById('direction').value = doc.data().direction;
        document.getElementById('menu_photos').value = doc.data().menu_photos.join(', ');
        document.getElementById('per_two_person_cost').value = doc.data().per_two_person_cost;
        document.getElementById('place').value = doc.data().place;
        document.getElementById('post_photos').value = doc.data().post_photos.join(', ');
        document.getElementById('photoURL').value = doc.data().photoURL;
        document.getElementById('toggle').value = doc.data().toggle;

        // Clear any previous event listeners on the submit button
        userForm.removeEventListener('submit', handleSubmit);

        // Add a new event listener to update the existing document when the form is submitted
        userForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const editedUsername = document.getElementById('username').value;
            const editedAddress = document.getElementById('address').value;
            const editedBannerUrl = document.getElementById('bannerUrl').value;
            const editedDirection = document.getElementById('direction').value;
            const editedMenuPhotos = document.getElementById('menu_photos').value.split(',');
            const editedPerTwoPersonCost = document.getElementById('per_two_person_cost').value;
            const editedPlace = document.getElementById('place').value;
            const editedPostPhotos = document.getElementById('post_photos').value.split(',');
            const editedPhotoURL = document.getElementById('photoURL').value;
            const editedToggle = document.getElementById('toggle').value;

            // Update the Firestore document with the edited data
            db.collection('users').doc(doc.id).update({
                username: editedUsername,
                address: editedAddress,
                bannerUrl: editedBannerUrl,
                direction: editedDirection,
                menu_photos: editedMenuPhotos,
                per_two_person_cost: editedPerTwoPersonCost,
                place: editedPlace,
                post_photos: editedPostPhotos,
                photoURL: editedPhotoURL,
                toggle: editedToggle,
            })
                .then(() => {
                    alert('Data successfully updated!');
                    userForm.reset();
                    userForm.removeEventListener('submit', handleSubmit);
                    userForm.addEventListener('submit', handleSubmit);
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                    alert('An error occurred while updating data. Please try again later.');
                });
        });
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('class', 'btn btn-danger');
    deleteButton.addEventListener('click', () => {
        // Delete the Firestore document
        db.collection('users').doc(doc.id).delete()
            .then(() => {
                alert('Data successfully deleted!');
            })
            .catch((error) => {
                console.error("Error deleting document: ", error);
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
db.collection('users').get().then((snapshot) => {
    snapshot.forEach((doc) => {
        displayUserData(doc);
    });
});