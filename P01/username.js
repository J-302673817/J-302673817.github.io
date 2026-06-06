
    document.addEventListener('DOMContentLoaded', function() {
      const popup = document.getElementById('usernamePopup');
      const usernameInput = document.getElementById('usernameInput');
      const submitBtn = document.getElementById('submitUsername');
      const usernameDisplay = document.getElementById('usernameDisplay');
      const displayedUsername = document.getElementById('displayedUsername');
      
     
   
    
      submitBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        
        if (username) {
         
          localStorage.setItem('quizUsername', username);
          
        
          popup.style.display = 'none';
          usernameDisplay.style.display = 'block';
          displayedUsername.textContent = username;
        } else {
         
          alert('Please enter a username to continue.');
        }
      });
      
    
      usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          submitBtn.click();
        }
      });
      
   
      usernameInput.focus();
    });
