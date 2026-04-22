document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('[data-doc-tab]');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const docName = button.dataset.docTab;

            document.querySelectorAll('.docContent').forEach((content) => {
                content.style.display = 'none';
            });

            document.querySelectorAll('.tablinks').forEach((tab) => {
                tab.classList.remove('active');
            });

            const activeContent = document.getElementById(docName);
            if (activeContent) {
                activeContent.style.display = 'block';
                button.classList.add('active');
            }
        });
    });
});
