class ResumeDownloader {
    constructor() {
        this.modal = document.getElementById('resume-modal');
        this.form = document.getElementById('resume-form');
        this.resumeUrl = './assets/Shakeel_Ahamed_Resume.pdf';
        this.init();
    }

    init() {
        // Find and update resume download buttons
        document.querySelectorAll('a').forEach(link => {
            if (link.textContent.includes('Resume') || link.textContent.includes('Download')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal();
                });
            }
        });

        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    openModal() {
        this.modal.classList.remove('hidden');
        document.getElementById('user-name').focus();
    }

    closeModal() {
        this.modal.classList.add('hidden');
        this.form.reset();
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        
        if (!name || !email) {
            alert('Please fill in required fields');
            return;
        }

        // Log the download
        console.log('Resume downloaded by:', { name, email });
        
        // Download the file
        const link = document.createElement('a');
        link.href = this.resumeUrl;
        link.download = 'Shakeel_Ahamed_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Close modal
        this.closeModal();
        alert('Resume downloaded successfully!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ResumeDownloader();
});
