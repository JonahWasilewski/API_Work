async function getLaunches() {
    const launchDiv = document.getElementById('launches');
    const launchNum = document.getElementById('launchNum').value.trim();
  
    // Clear previous and show loader
    launchDiv.innerHTML = `
      <div class="d-flex justify-content-center my-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading…</span>
        </div>
      </div>`;
  
    try {
      // 1) fetch all launches
      const res = await fetch('https://api.spacexdata.com/v5/launches');
      if (!res.ok) throw new Error('Failed to fetch launches');
      const launches = await res.json();
  
      // 2) find the one the user wants
      const launch = launches.find(l => l.flight_number === Number(launchNum));
      if (!launch) {
        launchDiv.innerHTML = `<div class="alert alert-danger">No launch found for flight number <strong>${launchNum}</strong>.</div>`;
        return;
      }
  
      // 3) fetch rocket details
      const rocketRes = await fetch(`https://api.spacexdata.com/v4/rockets/${launch.rocket}`);
      const rocketData = rocketRes.ok ? await rocketRes.json() : { name: 'Unknown' };
  
      // 4) format date and success badge
      const dateStr = new Date(launch.date_utc).toLocaleString();
      const successBadge = launch.success
        ? '<span class="badge bg-success">Success</span>'
        : '<span class="badge bg-danger">Failure</span>';
  
      // 5) render a nice card
      launchDiv.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="card-title">${launch.name} ${successBadge}</h2>
            <p class="text-muted">Flight #${launch.flight_number}</p>
            <p><strong>Launch Date:</strong> ${dateStr}</p>
            <p><strong>Rocket:</strong> ${rocketData.name}</p>
            ${launch.links.webcast
              ? `<p><a href="${launch.links.webcast}" target="_blank" class="btn btn-outline-primary btn-sm">
                   ▶ Watch on YouTube
                 </a></p>`
              : ''}
          </div>
        </div>
      `;
    } catch (err) {
      launchDiv.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
      console.error(err);
    }
  }
  