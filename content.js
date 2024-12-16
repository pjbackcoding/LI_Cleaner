// Function to clean up the LinkedIn profile UI
function cleanupLinkedInProfile() {
    console.log('LinkedIn Profile Cleaner: Starting cleanup...');

    // Define protected keywords to skip certain sections
    const protectedKeywords = ['experience', 'expérience', 'education', 'formation'];

    // Helper function to check if text contains any protected keyword
    const shouldProtect = (text) => protectedKeywords.some(keyword => text.includes(keyword));

    // Select all section elements that could contain unwanted content
    const allSections = document.querySelectorAll('section');

    allSections.forEach(section => {
        // Find the first h2 within the section
        const h2 = section.querySelector('h2');

        if (h2) {
            const titleText = h2.textContent.trim().toLowerCase();
            console.log(`Processing section: "${titleText}"`);

            // Check if the section is protected
            if (shouldProtect(titleText)) {
                console.log(`Protected section detected: "${titleText}" - Skipping.`);
                return;
            }

            // Define unwanted section titles
            const unwantedTitles = [
                'activité',
                'plus de profils pour vous',
                'ressources',
                'analytics',
                'highlights',
                'people you may know',
                'personnes que vous pourriez connaître'
            ];

            // Check if the section title matches any unwanted titles
            if (unwantedTitles.some(title => titleText.includes(title))) {
                section.style.display = 'none';
                console.log(`Removed section: "${titleText}"`);
            }
        }
    });

    // Remove ad banners
    const adSelectors = [
      'section.ad-banner-container',
      'div[data-ad-banner]',
      'iframe.ad-banner'
    ];

    // Remove "People you may know" sections
    const peopleSelectors = [
      'section[data-view-name="profile-card"]',
      'div#pymk_recommendation_from_school',
      'section:has(h2:contains("Personnes que vous pourriez connaître"))',
      'section:has(h2:contains("People you may know"))'
    ];

    // Combine all selectors
    const additionalSelectors = [...adSelectors, ...peopleSelectors];

    // Elements UI à supprimer
    const elementsToRemove = [
        // Header / profil / sponsor / dashboard
        '.pv-profile-sticky-header-v2__actions-container',
        '.pv-profile__sponsor-module',
        '.pvs-profile-actions',
        '.pv-top-card-v2__cta-container',
        '.pv-top-card__actions',
        '.pv-dashboard-section',
        
        // Premium & promos
        '.premium-icon',
        '.dist-value',
        '.pv-profile__premium-settings',
        '.pv-profile__premium-badge',
        '.pv-profile__ads',
        '.pv-profile__ads-container',
        
        // Social proof / stats
        '.social-proof-container',
        '.pv-profile-section__connections',
        '.pv-profile__connection-insights',
        '.pv-profile__stats-container',
        '.pv-profile__connection-count',
        '.social-details-social-counts',
        '.social-details-social-activity',
        
        // Divers UI
        '.presence-entity__indicator',
        '.msg-overlay-container',
        '.global-nav__secondary-items',
        '.share-box-feed-entry__wrapper',
        '.artdeco-modal',
        '.artdeco-toast',
        '.artdeco-notification-badge',
        ...additionalSelectors
    ];

    // Suppression des éléments UI
    elementsToRemove.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Vérifie si l'élément est dans une section protégée
                const parentSection = element.closest('section');
                if (parentSection) {
                    const sectionText = parentSection.textContent.toLowerCase();
                    if (
                        sectionText.includes('experience') ||
                        sectionText.includes('expérience') ||
                        sectionText.includes('education') ||
                        sectionText.includes('formation')
                    ) {
                        return;
                    }
                }
                element.style.display = 'none';
                console.log(`LinkedIn Profile Cleaner: Removed element: ${selector}`);
            });
        } catch (error) {
            console.log(`LinkedIn Profile Cleaner: Error processing selector ${selector}:`, error);
        }
    });

    // Simplification du header
    const header = document.querySelector('.pv-top-card');
    if (header) {
        header.style.padding = '1rem';
        header.style.marginBottom = '1rem';
        console.log('LinkedIn Profile Cleaner: Simplified header');
    }

    console.log('LinkedIn Profile Cleaner: Cleanup complete!');
}

// Debounce function to limit how often cleanup runs
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedCleanup = debounce(cleanupLinkedInProfile, 1000);

// MutationObserver for dynamic content
const observer = new MutationObserver((mutations) => {
    let hasChanges = false;
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0 || mutation.type === 'attributes') {
            hasChanges = true;
        }
    });
    if (hasChanges) {
        console.log('LinkedIn Profile Cleaner: Detected DOM changes, running cleanup...');
        debouncedCleanup();
    }
});

// Start observing
observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
});

// Initial cleanup when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('LinkedIn Profile Cleaner: Page loaded, running initial cleanup...');
    cleanupLinkedInProfile();
});

// Cleanup when the URL changes (internal navigation)
let lastUrl = location.href;
setInterval(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        console.log('LinkedIn Profile Cleaner: URL changed, running cleanup...');
        cleanupLinkedInProfile();
    }
}, 1000);

// Periodic cleanup
setInterval(() => {
    console.log('LinkedIn Profile Cleaner: Running periodic cleanup...');
    cleanupLinkedInProfile();
}, 3000);
