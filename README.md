# Story Analysis Chrome Extension

Story analysis is an academic project sponsored by <b><a href="https://www.gold.ac.uk/">Goldsmiths, University of London</a></b> and <b><a href="https://www.thebyte9.com/">Byte9, London</a></b>. Written documents not only contains topics related information for NLP tasks but also preserves the writer’s rhetoric and cognitive connectivity of the underlying concepts and actions. Inspired by <b><a href="https://en.wikipedia.org/wiki/Hero%27s_journey">Joseph Campbell’s "The Hero’s Journey"</a></b>, this project aims to extract and visualize story for the document evaluating the cognitive richness of the underlying extraction. It also uses <b><a href="https://developers.google.com/knowledge-graph">Google’s Knowledge Graph API</a></b> for categorization.</p>

The feedback section is a comprehension section aiming to be used in a cognitive psychology experiment. The user code is used to identify a unique user. It can be any string. It automatically feels the user code with the user's IP. A user can easily replace it. Feedback information is saved for further research.

Currently this plugin is only activated for individual <a href="https://www.bbc.co.uk/news">BBC</a> news item page. This extension is backed by [Story Analysis API](https://github.com/ishrat2003/story-analysis-api). Thanks for using this extension. If you use this plugin for publication, please add relevant [publication(s)](http://ishratsami.blogspot.com/p/publications.html).

Zip the file using the following command before uploading to [Google Web Store](https://chrome.google.com/webstore/developer/dashboard):

    ```sh
    rm story-analysis-plugin.zip
    zip -vr -D story-analysis-plugin.zip .
    ```

