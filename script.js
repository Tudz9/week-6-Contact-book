//Global VariablesAdd commentMore actions
let apiKey = '';
const rootPath = 'https://mysite.itvasity.org/api/ContactBook/';

//Check if API key exists when page loads
function checkApiKey() { 
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
        apiKey = storedApiKey;
        //show Contacts Page (Show page)
        showContacts();
        //Get Contacts (API Call)
        getContacts()
    }
}

// Set the API key and store it 
function setAPiKey() {
    const inputAPiKey = document.getElementById('apiKeyInput').value.trim();

    if (!inputAPiKey) {
        alert('Please enter a valid API key.');
        return;
    }

    //Validate API Key First
    fetch(rootPath + "controller/api-key/?apikey=" + inputAPiKey)
    .then(function(response) {
        return response.text();
})
.then(function (data) {
    if (data == "1"){
        apiKey = inputAPiKey;
        localStorage.setItem("apiKey", apiKey);
        showContacts();
        getContacts();
    } else {
        alert("Invalid API key entered!");
    }
})
.catch(function (error) {
    alert('Error validation your API key. Please try again.');
});
}

//show different pages
function showPage(pageId) {
    // Hide all pages 
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show the selected page{
        document.getElementById(pageId).classList.add('active');
    }

    function showContacts() {
        showPage('ContactsPage');
    }

function showAddContacts() {
    showPage('AddContactPage');
    // Clear the form
    document.getElementById('addContactsForm').reset();
}

function(contactId) {
    showPage('addContactPage');
    // Load contact data for editing
    loadContactForEdit(contactId);
}

function getContacts() {
            const contactsList = document.getElementById('contactsList');
            contactsList.innerHTML = '<div class="loading"> Loading contacts...</div>';

            fetch(rootPath + "controller/get-contacts/*")
            .then(function (response) {
                return response.json();

            })
            .then(function (data){
                displayContacts(data);
            })
            .catch(function (error) {
                contactsList.innerHTML = '<div class="error">Something went wrong, please try again later.</div>';
            });
}
function displayContacts(contacts) {
    const contactsList = document.getElementById('contactsList');

    if (!contacts || contacts.length === 0) {
        contactsList.innerHTML = '<div class="loading">No contacts found. Add your first contact</div>';
        return;
    }

    let html = '<div class="contact-grid">';

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts(i);

        let avatar = contact.avatar ? contact.avatar ?;
        '${roothpath}controller/uploads/${contact.avatar}' ;
        'https://ui-avatars.com/api/?name=${contact.firstname}+${contact.lastname}&background=ff6b&color=fffsize=120';

        html += `
            <div class="contact-card">
                <img src="${avatarSrc}" alt="Avatar" class="contact-avatar">
                <div class="contact-name">${contact.firstname} ${contact.lastname}</div>
                <div class ="contact-details">
                    <p><strong> Mobile:</strong>${contact.mobile}</p>
                    <p><strong> Email:</strong>${contact.email}</p>
            </div>
                <div class="contact-actions">
                    <button class="btn btn-secondary" onclick="showEditContact('${contact.id}')">\ Edit</button>
                    <button class="btn btn-danger" onclick="deleteContact(${contact.id}')">Delete</button>
                </div>
            </div>
        `;
   
    }

    html += '</div>';
    contactsList.innerHTML = html;
}

function refreshContacts() {
    getContacts();
}

function addContact(event) {
    event.preventDefault();

    const form = new FormData(document.querySelector('#addContactsForm'));
    form.append('apikey', apiKey);

    fetch(rootPath + 'controller/insert-contact/', {
        method: 'POST',
        headers: {'Accept': 'application/json, *.*'},
        body: form
    })

    .then(function (data) {
        return response.text();
    })
    .then(function (data) {
        if (data == "1") {
            alert('Contact added successfully!');
            showContacts();
            getContacts();
        } else {
            alert('Error adding contacts: ' + data);
        }
    })
    .catch(function (error) {
        alert('Something went wrong. Please try again later.');
    });
    function loadContactForEdit(contactId) {
        fetch(rootPath + 'controller/get-contact/' + contactId + '/')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data && data.length > 0) {
                const contact = data[0];

                //Show avatar
                if (contact.avatar) {
                    const avatarImg = '<img src="${rootPath}controller/uploads/${contact.avatar}"
                    width=200 style="border-radius: 10px;" />';
                    document.getElementById('editContactImage').innerHTML = avatarImg;
                } else {
                    document.getElementById("editContactImage').innerHTML = '';
                }

                document.getElementById('editContactId').value = contact.id;
                document.getElementById('editFirstName').value = contact.firstname;
                document.getElementById('editLastName').value = contact.lastname;
                document.getElementById('editMobile').value = contact.mobile;
                document.getElementById('editEmail').value = contact.email;
            }
            })
        .catch(function (error) {
            alert('Error loading contact details.');
            showContacts();
        })
    }
    function updateContact(event) {
        event.preventDefault();

        const form = new FormData(document.querySelector('#editContactForm'));
        const contactId = document.getElementById('editContactId').value;

        form.append('apiKey', apiKey);
        form.append('id', contactId);

        fetch(rootPath + 'controller/edit-contact/', {
            method: 'POST',
            headers: {'Accept': 'application/json, *.*'},
            body: form
        })
        .then(function (response) {
            return response.text();
        })
        .then(function (data) {
            if (data == "1") {
                alert('Contact updated successfully!');
                showContacts();
                getContacts();
            } else {
                alert('Error updating contact: ' + data);
            }
        })
        .catch(function (error) {
            alert('Something went wrong. Please try again later.');
        });
    }

    function deleteContact(contactId) {
        var confirmDelete = confirm("Delete contact. Are you sure?");

        if (confirmDelete === true) {
            fetch(rootPath + 'controller/delete-contact/?id=' + contactId)
            .then(function (response) {
                return response.text();
            })
            .then(function (data) {
                if (data == "1") {
                    alert('Contact deleted successfully!');
                    getContacts();
                } else {
                    alert('Error deleting contact: ' + data);
                }
            })
            .catch(function (error) {
                alert('Something went wrong. Please try again later.');
            });