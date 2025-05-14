// Main functionality for Criminal Procedure Guide

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Mermaid for flowcharts
    initializeMermaid();
    
    // Set up navigation functionality
    setupNavigation();
    
    // Set up control buttons
    setupControlButtons();
});

// Initialize Mermaid diagrams
function initializeMermaid() {
    mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        fontFamily: 'Georgia, Times New Roman, serif',
        fontSize: 14,
        flowchart: {
            htmlLabels: true,
            useMaxWidth: true,
            curve: 'basis'
        }
    });
    
    // Make sure diagrams are rendered after a short delay to ensure DOM is ready
    setTimeout(function() {
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }, 1000);
}

// Set up navigation and content loading
function setupNavigation() {
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) return;
    
    // Get all navigation links with data-section attribute
    const navLinks = document.querySelectorAll('a[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the section to load
            const sectionName = this.getAttribute('data-section');
            loadSection(sectionName);
            
            // Update URL hash
            window.location.hash = this.getAttribute('href');
            
            // Highlight active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Load section from hash or default to overview
    function loadInitialSection() {
        let sectionToLoad = 'overview'; // Default section
        
        // Check if URL has a hash
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            const hashSection = document.querySelector(`a[href="#${hash}"]`);
            
            if (hashSection && hashSection.getAttribute('data-section')) {
                sectionToLoad = hashSection.getAttribute('data-section');
                
                // Highlight the active link
                navLinks.forEach(l => l.classList.remove('active'));
                hashSection.classList.add('active');
            }
        } else {
            // Highlight the overview link by default
            const overviewLink = document.querySelector('a[data-section="overview"]');
            if (overviewLink) {
                overviewLink.classList.add('active');
            }
        }
        
        loadSection(sectionToLoad);
    }
    
    // Function to load a section content
    function loadSection(sectionName) {
        contentContainer.innerHTML = '<div class="loading">Loading content...</div>';
        
                // Get paths relative to current location rather than using Jekyll
                fetch(`./sections/${sectionName}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Section not found');
                }
                return response.text();
            })
            .then(html => {
                contentContainer.innerHTML = html;
                
                // Initialize mermaid diagrams in the new content
                mermaid.init(undefined, document.querySelectorAll('.mermaid'));
                
                // Scroll to top
                window.scrollTo(0, 0);
            })
            .catch(error => {
                console.error('Error loading section:', error);
                contentContainer.innerHTML = `
                    <div class="warning">
                        <h3>Error Loading Content</h3>
                        <p>Sorry, we couldn't load the ${sectionName} section. Please try again later.</p>
                    </div>
                `;
            });
    }
    
    // Load the initial section when page loads
    loadInitialSection();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        loadInitialSection();
    });
}

// Set up control buttons functionality
function setupControlButtons() {
    // Refresh diagrams button
    const refreshButton = document.getElementById('refresh-diagrams');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        });
    }
    
    // Export to PDF button
    const exportButton = document.getElementById('export-pdf');
    const printInstructions = document.getElementById('print-instructions');
    const cancelPrintButton = document.getElementById('cancel-print');
    
    if (exportButton && printInstructions) {
        exportButton.addEventListener('click', function() {
            printInstructions.style.display = 'block';
        });
    }
    
    if (cancelPrintButton) {
        cancelPrintButton.addEventListener('click', function() {
            printInstructions.style.display = 'none';
        });
    }
}
