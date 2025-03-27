document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json") 
    .then(response => response.json())
    .then(data => {
      const jobsContainer = document.querySelector(".jobs");
      jobsContainer.innerHTML = ""; 

      data.forEach(job => {
        const jobElement = document.createElement("div");
        jobElement.classList.add("job-items");

        jobElement.innerHTML = `
          <div class="jobs-column job-column-left">
            <img src="${job.logo}" alt="${job.company} logo" class="job-logo">
            <div class="job-info">
              <span class="jobs-company">${job.company}</span>
              <span class="jobs-title">${job.position}</span>
              
              <ul class="jobs-details">
                <li>${job.postedAt}</li>
                <li>${job.contract}</li>
                <li>${job.location}</li>
              </ul>
              
            </div>
          </div>
          <div class="jobs-column job-column-right">
            ${[...job.languages, ...job.tools].map(tag => `<span class="tags">${tag}</span>`).join('')}
          </div>
        `;

        jobsContainer.appendChild(jobElement);
      });

      applyStyles();
    })
    .catch(error => console.error("Error loading job listings:", error));
});
