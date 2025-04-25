async function searchUser() {
  var username = document.getElementById('username').value;
  var profileDiv = document.getElementById('profile');
  var repoButton = document.getElementById('searchRepoButton');

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error('User not found');
    
    var data = await res.json();
    profileDiv.innerHTML = `
      <h2>${data.name} (${data.login})</h2>
      <img src="${data.avatar_url}" width="100" />
      <p>Public Repos: ${data.public_repos}</p>
      <p>Followers: ${data.followers}</p>
      <p><a href="${data.html_url}" target="_blank">View Profile</a></p>
    `;
    repoButton.style.display = "block";
  } catch (err) {
    profileDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

async function searchRepo(username) {
    var username = document.getElementById('username').value;
    var repoDiv = document.getElementById('repos');
    repoDiv.innerHTML = ''; // clear old content

    try {
        var repoRes = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!repoRes.ok) throw new Error('Could not fetch repos');
        
        var repos = await repoRes.json();
        if (!Array.isArray(repos)) throw new Error('Unexpected response format');

        repoDiv.innerHTML += "<h3>Top Repositories:</h3><ul>" + 
            repos.slice(0, 5).map(r => `<li><a href="${r.html_url}" target="_blank">${r.name}</a></li>`).join("") +
            "</ul>";
    } catch (err) {
        repoDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
}

const jsRepos = repos.filter(r => r.language === 'JavaScript');
