let tabScrollPositions = {
    home: 0,
    portfolio: 0,
    'debug-diaries': 0,
    'vuln-diaries': 0,
    podcast: 0
};
let lastActiveTab = 'home';

function showTab(tabId, element) {
    if (lastActiveTab === tabId) return;
    
    tabScrollPositions[lastActiveTab] = window.scrollY;
    
    let tabs = document.querySelectorAll('.content');
    let navLinks = document.querySelectorAll('.navbar a');
    
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
        window.scrollTo({ top: tabScrollPositions[tabId] || 0, behavior: 'smooth' });
    }, 300);
    
    lastActiveTab = tabId;
}

window.addEventListener('scroll', function() {
    let navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shrink');
    } else {
        navbar.classList.remove('shrink');
    }
});