//Contact Book App Fixes
let apiKey = '';
const rootPath = 'https://mysite.itvarsity.org/api/ContactBook/';

//Check if API key exists when page loads
function checkApiKey() {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
        apiKey = storedApiKey;
        //show Contacts Page
        showContacts();
        //Get Contacts
        getContacts();
    }
}

// Set the API key and store it
function setApiKey() {
    const inputApiKey = document.getElementById('apiKeyInput').value.trim();
    
    if (!inputApiKey) {
        alert('Please enter a valid API key.');
        return;
    }
    
    // CHANGE: Fixed API key validation endpoint and parameter name (was "apikey", now "apiKey")
    fetch(rootPath + "controller/api-key/?apiKey=" + inputApiKey)
        .then(function(response) {
            return response.text();
        })
        .then(function (data) {
            if (data == "1"){
                apiKey = inputApiKey;
                localStorage.setItem("apiKey", apiKey);
                showContacts();
                getContacts();
            } else {
                alert("Invalid API key entered!");
            }
        })
        .catch(function (error) {
            // CHANGE: Added console
            console.error('API Key validation error:', error);
            // CHANGE: Improved error message
            alert('Error validating your API key. Please check your connection and try again.');
        });
}

//show different pages
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    // Show the selected page
    document.getElementById(pageId).classList.add('active');
}

function showContacts() {
    // CHANGE: Fixed page ID consistency
    showPage('contactsPage');
}

function showAddContacts() {
    // CHANGE: Fixed page ID consistency
    showPage('addContactPage');
    // CHANGE: Fixed form ID reference (was 'addContactsForm', now 'addContactForm')
    document.getElementById('addContactForm').reset();
}

// CHANGE: Fixed function declaration syntax (was missing function name)
function showEditContact(contactId) {
    // CHANGE: Fixed page ID consistency
    showPage('editContactPage');
    // Load contact data for editing
    loadContactForEdit(contactId);
}

function getContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '<div class="loading"> Loading contacts...</div>';
    
    // CHANGE: Fixed endpoint (was "get-contacts/*") and added API key parameter
    const url = rootPath + "controller/get-contacts/" + (apiKey ? "?apiKey=" + apiKey : "");
    
    fetch(url)
        .then(function (response) {
            // CHANGE: Added network response validation
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(function (data){
            displayContacts(data);
        })
        .catch(function (error) {
            // CHANGE: Added console
            console.error('Get contacts error:', error);
            contactsList.innerHTML = '<div class="error">Something went wrong, please try again later.</div>';
        });
}

function displayContacts(contacts) {
    const contactsList = document.getElementById('contactsList');
    
    if (!contacts || contacts.length === 0) {
        contactsList.innerHTML = '<div class="loading">No contacts found. Add your first contact</div>';
        return;
    }
    
    // CHANGE: Improved CSS class name (was 'contact-grid', now 'contacts-grid')
    let html = '<div class="contacts-grid">';
    
    for (let i = 0; i < contacts.length; i++) {
        // CHANGE: Fixed array access syntax (was contacts(i), now contacts[i])
        const contact = contacts[i];
        
        // CHANGE: Added fallback values for missing contact data
        const firstName = contact.firstname || 'Unknown';
        const lastName = contact.lastname || 'Contact';
        const mobile = contact.mobile || 'No mobile';
        const email = contact.email || 'No email';
        
        // CHANGE: Fixed avatar handling (was broken ternary operator)
        let avatarSrc = contact.avatar
            ? `${rootPath}controller/uploads/${contact.avatar}`
            : `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=ff6b6b&color=fff&size=120`;
        
        html += `
            <div class="contact-card">
                <img src="${avatarSrc}" alt="Avatar" class="contact-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=ccc&color=fff&size=120'">
                <div class="contact-name">${firstName} ${lastName}</div>
                <div class="contact-details">
                    <p><strong>📲 Mobile:</strong> ${mobile}</p>
                    <p><strong>📧 Email:</strong> ${email}</p>
                </div>
                <div class="contact-actions">
                    <button class="btn btn-secondary" onclick="showEditContact('${contact.id}')">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="deleteContact('${contact.id}')">🗑️ Delete</button>
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
    
    // CHANGE: Fixed form selector (was '#addContactsForm', now '#addContactForm')
    const form = new FormData(document.querySelector('#addContactForm'));
    // CHANGE: Fixed parameter name (was 'apikey', now 'apiKey')
    form.append('apiKey', apiKey);
    
    fetch(rootPath + 'controller/insert-contact/', {
        method: 'POST',
        // CHANGE: Fixed headers syntax (was missing comma and asterisk)
        headers: {'Accept': 'application/json, */*'},
        body: form
    })
        .then(function (response) {
            // CHANGE: Added network response validation
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.text();
        })
        .then(function (data) {
            if (data == "1") {
                alert('Contact added successfully!');
                showContacts();
                getContacts();
            } else {
                alert('Error adding contact: ' + data);
            }
        })
        .catch(function (error) {
            // CHANGE: Added console
            console.error('Add contact error:', error);
            alert('Something went wrong. Please try again later.');
        });
}

function loadContactForEdit(contactId) {
    // CHANGE: Fixed endpoint and added API key parameter
    const url = rootPath + 'controller/get-contacts/?id=' + contactId + (apiKey ? '&apiKey=' + apiKey : '');
    
    fetch(url)
        .then(function (response) {
            // CHANGE: Added network response validation
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            if (data && data.length > 0) {
                const contact = data[0];
                
                // CHANGE: Fixed avatar image handling
                if (contact.avatar) {
                    const avatarImg = `<img src="${rootPath}controller/uploads/${contact.avatar}"
                                            width="200" style="border-radius: 10px;" />`;
                    // CHANGE: Fixed element ID (was 'editContactImage', now 'editAvatarImage')
                    document.getElementById("editAvatarImage").innerHTML = avatarImg;
                } else {
                    document.getElementById("editAvatarImage").innerHTML = '';
                }
                
                // CHANGE: Added fallback empty strings for missing data
                document.getElementById('editContactId').value = contact.id;
                document.getElementById('editFirstName').value = contact.firstname || '';
                document.getElementById('editLastName').value = contact.lastname || '';
                document.getElementById('editMobile').value = contact.mobile || '';
                document.getElementById('editEmail').value = contact.email || '';
            }
        })
        .catch(function (error) {
            // CHANGE: Added console.error for debugging
            console.error('Load contact error:', error);
            alert('Error loading contact details.');
            showContacts();
        });
}

function updateContact(event) {
    event.preventDefault();
    
    const form = new FormData(document.querySelector('#editContactForm'));
    const contactId = document.getElementById('editContactId').value;
    
    // CHANGE: Fixed parameter name (was 'apikey', now 'apiKey')
    form.append('apiKey', apiKey);
    form.append('id', contactId);
    
    fetch(rootPath + 'controller/edit-contact/', {
        method: 'POST',
        // CHANGE: Fixed headers syntax
        headers: {'Accept': 'application/json, */*'},
        body: form
    })
        .then(function (response) {
            // CHANGE: Added network response validation
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status);
            }
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
            // CHANGE: Added console
            console.error('Update contact error:', error);
            alert('Something went wrong. Please try again later.');
        });
}

function deleteContact(contactId) {
    var confirmDelete = confirm("Delete contact. Are you sure?");
    
    if (confirmDelete === true) {
        // CHANGE: Added API key parameter to delete request
        const url = rootPath + 'controller/delete-contact/?id=' + contactId + (apiKey ? '&apiKey=' + apiKey : '');
        
        fetch(url)
            .then(function (response) {
                // CHANGE: Added network response validation
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status);
                }
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
                // CHANGE: Added console
                console.error('Delete contact error:', error);
                alert('Something went wrong. Please try again later.');
            });
    } // CHANGE: Fixed missing closing brace for deleteContact function
} // CHANGE: Fixed missing closing brace for deleteContact function

// CHANGE: Added automatic app initialization on page load
window.addEventListener('load', function() {
    try {
        checkApiKey();
    } catch (error) {
        console.error('Error during page load:', error);
    }
});