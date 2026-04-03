// API base URL - will work on Railway deployment
const API_BASE = window.location.origin;

document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value;

    try {
        const response = await fetch(`${API_BASE}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, author }),
        });

        if (response.ok) {
            alert('Post created successfully!');
            document.getElementById('postForm').reset();
            loadPosts(); // Refresh the posts list
        } else {
            const error = await response.json();
            alert('Error: ' + error.detail);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
});

document.getElementById('loadPosts').addEventListener('click', loadPosts);

async function loadPosts() {
    try {
        const response = await fetch(`${API_BASE}/posts`);
        if (response.ok) {
            const posts = await response.json();
            displayPosts(posts);
        } else {
            alert('Error loading posts');
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

function displayPosts(posts) {
    const postsList = document.getElementById('postsList');
    postsList.innerHTML = '';

    if (posts.length === 0) {
        postsList.innerHTML = '<p>No posts yet. Create your first post!</p>';
        return;
    }

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <small>By ${post.author} on ${new Date(post.created_at).toLocaleDateString()}</small>
        `;
        postsList.appendChild(postDiv);
    });
}

// Load posts on page load
loadPosts();