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
      show: function() {
        if(!this.isLoaded){
            document.querySelector('.loader-container').style.display = 'flex';
            this.isLoaded = true;
            const script = document.createElement('script');
            script.src = url
            document.body.appendChild(script);
            console.log(key);
        }
      },
      handleBloggerFeed: function(feed) {
        const noPostDiv = document.getElementById(key+"-no-post");
        if (feed && feed.feed && Array.isArray(feed.feed.entry)) {
            if(noPostDiv){
                noPostDiv.style.display = "none";
            }
                            // Create the parent div
            const timelineCentered = document.createElement('div');
            timelineCentered.id = 'timeline-centered';
            feed.feed.entry.forEach(function(entry) {

                // Create the child div
                const timelineEvent = document.createElement('div');
                timelineEvent.classList.add('timeline-event');

                var postLink = entry.link.find(link => link.rel === 'alternate').href;
                const postLinkTag = document.createElement('a');
                postLinkTag.href = postLink;
                postLinkTag.textContent = entry.title.$t;
                postLinkTag.target = '_blank';



                // Create the grandchild h4
                const h4 = document.createElement('h4');
                h4.appendChild(postLinkTag);

                // Append the h4 to the timeline-event div
                timelineEvent.appendChild(h4);

                if(entry.category && Array.isArray(entry.category)) {
                    for (let index = 0; index < entry.category.length; index++) {
                        const category = entry.category[index];

                        const label = document.createElement('div');
                        label.textContent = category.term;
                        label.classList.add(`code-label`);
                        label.classList.add(`label-${index}`);
                        timelineEvent.appendChild(label);
                        if(index==6){
                            break;
                        }
                    }
                }

                // Append the timeline-event div to the timeline-centered div
                timelineCentered.appendChild(timelineEvent);
                
            });
            // Append the timeline-centered div to the body or another container
            document.getElementById(key+"-diaries").appendChild(timelineCentered);

        } else {
            if(noPostDiv){
                noPostDiv.style.display = "flex";
            }
            console.log('No entries found or feed is not properly formatted');
        }
        document.querySelector('.loader-container').style.display = 'none';
      }    
    };
  }
  