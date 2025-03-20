const feedMeta = {
    debug: createFeedMeta('debug', "https://bugtales.blogs.mukilarasan.com/feeds/posts/default?alt=json-in-script&callback=feedMeta.debug.handleBloggerFeed"),
    engg: createFeedMeta('engg', "https://engg.blogs.mukilarasan.com/feeds/posts/default?alt=json-in-script&callback=feedMeta.engg.handleBloggerFeed"),
    vuln: createFeedMeta('vuln', "https://sec.blogs.mukilarasan.com/feeds/posts/default?alt=json-in-script&callback=feedMeta.vuln.handleBloggerFeed")
};

// Factory function to create feedMeta entries
function createFeedMeta(key, url) {
    return {
        isLoaded: false,
        url: url,
        show: function () {
            if (!this.isLoaded) {
                document.querySelector('.loader-container').style.display = 'flex';
                this.isLoaded = true;
                const script = document.createElement('script');
                script.src = url
                document.body.appendChild(script);
                console.log(key);
            }
        },
        handleBloggerFeed: function (feed) {
            const noPostDiv = document.getElementById(key + "-no-post");
            if (feed && feed.feed && Array.isArray(feed.feed.entry)) {
                if (noPostDiv) {
                    noPostDiv.style.display = "none";
                }
                // Create the parent div
                const timelineCentered = document.createElement('div');
                timelineCentered.id = 'timeline-centered';
                feed.feed.entry.forEach(function (entry) {

                    // Create the child div
                    const timelineEvent = document.createElement('div');
                    timelineEvent.classList.add('timeline-event');

                    const wrappedDiv = document.createElement('div');
                    wrappedDiv.classList.add('timeline-event-wrap');

                    var postLink = entry.link.find(link => link.rel === 'alternate').href;
                    const postLinkTag = document.createElement('a');
                    postLinkTag.href = postLink;
                    postLinkTag.textContent = entry.title.$t;
                    postLinkTag.target = '_blank';



                    // Create the grandchild h4
                    const h4 = document.createElement('h4');
                    h4.appendChild(postLinkTag);

                    // Append the h4 to the timeline-event div
                    wrappedDiv.appendChild(h4);

                    if (entry.category && Array.isArray(entry.category)) {
                        for (let index = 0; index < entry.category.length; index++) {
                            if (index == 6) {
                                break;
                            }
                            const category = entry.category[index];
                            const label = generateLabels(category.term);
                            wrappedDiv.appendChild(label);
                        }
                    }
                    timelineEvent.appendChild(wrappedDiv);

                    // Append the timeline-event div to the timeline-centered div
                    timelineCentered.appendChild(timelineEvent);

                });
                // Append the timeline-centered div to the body or another container
                document.getElementById(key + "-diaries").appendChild(timelineCentered);

            } else {
                if (noPostDiv) {
                    noPostDiv.style.display = "flex";
                }
                console.log('No entries found or feed is not properly formatted');
            }
            document.querySelector('.loader-container').style.display = 'none';
        }
    };
}

function getLabelGradient(labelName) {
    let hash = 0;
    for (let i = 0; i < labelName.length; i++) {
        hash = (hash * 31 + labelName.charCodeAt(i)) >>> 0; // Unsigned right shift for stability
    }

    // Generate two unique hues with better contrast
    let hue1 = (hash % 300) + 30;  // Avoids extreme reds (0) and purples (360)
    let hue2 = ((hash * 7) % 270) + 45; // Ensures the second color is distinct

    let color1 = `hsl(${hue1}, 90%, 55%)`; // Balanced brightness for readability
    let color2 = `hsl(${hue2}, 85%, 40%)`; // Slightly darker for contrast

    return `linear-gradient(45deg, ${color1}, ${color2})`; // Smooth diagonal gradient
}



// Function to generate labels dynamically with gradients
function generateLabels(label) {
    label = label.toUpperCase();
    let gradient = getLabelGradient(label);
    let div = document.createElement("div");
    div.className = "code-label code-labelsel";
    div.innerText = label;
    div.style.background = gradient; // Apply dynamic gradient

    // Optional hover effect
    //div.onmouseover = () => (div.style.opacity = "0.8");
    //div.onmouseout = () => (div.style.opacity = "1");

    return div;
}

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("code-label")) {
        let range = document.createRange();
        let selection = window.getSelection();
        range.selectNodeContents(event.target);
        selection.removeAllRanges();
        selection.addRange(range);
    }
});
