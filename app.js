// Replace with your actual backend URL
const API_URL = 'https://approveme-9658f8db629c.herokuapp.com/api';

async function fetchPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <img src="${post.mediaUrl}" alt="Post image">
            <p>${post.caption}</p>
            <div class="buttons">
                <button onclick="approvePost('${post._id}')">Approve</button>
                <button onclick="showDenialReason('${post._id}')">Deny</button>
            </div>
            <div id="denialReason-${post._id}" style="display:none;">
                <textarea id="denialText-${post._id}" placeholder="Reason for denial"></textarea>
                <button onclick="denyPost('${post._id}')">Submit Denial</button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

async function approvePost(postId) {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}/approve`, {
            method: 'PUT'
        });
        if (response.ok) {
            fetchPosts(); // Refresh the post list
        }
    } catch (error) {
        console.error('Error approving post:', error);
    }
}

function showDenialReason(postId) {
    const denialElement = document.getElementById(`denialReason-${postId}`);
    denialElement.style.display = 'block';
}

async function denyPost(postId) {
    const denialReason = document.getElementById(`denialText-${postId}`).value;
    try {
        const response = await fetch(`${API_URL}/posts/${postId}/deny`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ denialReason })
        });
        if (response.ok) {
            fetchPosts(); // Refresh the post list
        }
    } catch (error) {
        console.error('Error denying post:', error);
    }
}

// Fetch posts when the page loads
fetchPosts();