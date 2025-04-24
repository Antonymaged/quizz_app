// Profile page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const userNameElement = document.querySelector('.user-name');
    
    // Edit Profile button functionality
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Get current username
            const currentUsername = userNameElement.textContent;
            
            // Create edit mode elements
            const editContainer = document.createElement('div');
            editContainer.className = 'edit-username-container';
            editContainer.style.display = 'flex';
            editContainer.style.alignItems = 'center';
            editContainer.style.gap = '10px';
            
            // Input field
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = currentUsername;
            inputField.className = 'username-input';
            inputField.style.padding = '8px 15px';
            inputField.style.borderRadius = '20px';
            inputField.style.border = '2px solid #001528';
            inputField.style.background = '#CFE7FF';
            inputField.style.fontWeight = 'bold';
            inputField.style.fontSize = '18px';
            
            // Save button
            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.className = 'save-username-btn';
            saveBtn.style.background = '#001528';
            saveBtn.style.color = '#CFE7FF';
            saveBtn.style.border = 'none';
            saveBtn.style.borderRadius = '20px';
            saveBtn.style.padding = '8px 15px';
            saveBtn.style.cursor = 'pointer';
            saveBtn.style.fontWeight = 'bold';
            
            // Cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.className = 'cancel-username-btn';
            cancelBtn.style.background = 'transparent';
            cancelBtn.style.color = '#001528';
            cancelBtn.style.border = '1px solid #001528';
            cancelBtn.style.borderRadius = '20px';
            cancelBtn.style.padding = '8px 15px';
            cancelBtn.style.cursor = 'pointer';
            
            // Add elements to container
            editContainer.appendChild(inputField);
            editContainer.appendChild(saveBtn);
            editContainer.appendChild(cancelBtn);
            
            // Replace username element with edit container
            userNameElement.style.display = 'none';
            userNameElement.parentNode.insertBefore(editContainer, userNameElement.nextSibling);
            
            // Focus on input
            inputField.focus();
            
            // Save button click handler
            saveBtn.addEventListener('click', function() {
                const newUsername = inputField.value.trim();
                if (newUsername) {
                    userNameElement.textContent = newUsername;
                    
                    // Show success message
                    showToast('Username updated successfully!', 'success');
                } else {
                    // Show error message if empty
                    showToast('Username cannot be empty!', 'error');
                    return;
                }
                
                // Remove edit container and show username
                editContainer.remove();
                userNameElement.style.display = 'block';
            });
            
            // Cancel button click handler
            cancelBtn.addEventListener('click', function() {
                // Remove edit container and show username with no changes
                editContainer.remove();
                userNameElement.style.display = 'block';
            });
            
            // Handle Enter key press
            inputField.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    saveBtn.click();
                } else if (e.key === 'Escape') {
                    cancelBtn.click();
                }
            });
        });
    }
    
    // Function to display toast notifications
    function showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.style.position = 'fixed';
            toastContainer.style.top = '20px';
            toastContainer.style.right = '20px';
            toastContainer.style.zIndex = '1000';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Style the toast based on type
        toast.style.padding = '10px 20px';
        toast.style.marginBottom = '10px';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        toast.style.fontWeight = 'bold';
        toast.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
        toast.style.minWidth = '200px';
        
        if (type === 'success') {
            toast.style.backgroundColor = '#002141';
            toast.style.color = '#CFE7FF';
        } else if (type === 'error') {
            toast.style.backgroundColor = '#9e1b1b';
            toast.style.color = 'white';
        }
        
        // Add the toast to the container
        toastContainer.appendChild(toast);
        
        // Remove the toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Avatar modal functionality
    function openAvatarModal() {
        document.getElementById('avatarModal').style.display = 'flex';
    }
    
    function closeAvatarModal() {
        document.getElementById('avatarModal').style.display = 'none';
    }
    
    function saveAvatar() {
        const selectedAvatar = document.querySelector('.avatar-option.selected i');
        const currentAvatar = document.querySelector('.current-avatar i');
        
        if (selectedAvatar && currentAvatar) {
            currentAvatar.className = selectedAvatar.className;
        }
        
        closeAvatarModal();
    }
    
    // Add event listeners to avatar options
    const avatarOptions = document.querySelectorAll('.avatar-option');
    
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
    
    // Close modal if clicked outside content
    const avatarModal = document.getElementById('avatarModal');
    if (avatarModal) {
        avatarModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAvatarModal();
            }
        });
    }
    
    // Add click handlers for avatar selector
    const avatarSelector = document.querySelector('.avatar-selector');
    if (avatarSelector) {
        avatarSelector.addEventListener('click', openAvatarModal);
    }
    
    // Add click handlers for modal buttons
    const saveAvatarBtn = document.querySelector('.save-btn');
    if (saveAvatarBtn) {
        saveAvatarBtn.addEventListener('click', saveAvatar);
    }
    
    const cancelAvatarBtn = document.querySelector('.cancel-btn');
    if (cancelAvatarBtn) {
        cancelAvatarBtn.addEventListener('click', closeAvatarModal);
    }
}); 