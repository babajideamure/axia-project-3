document.addEventListener("DOMContentLoaded", function () {
  let allJobs = []; 
  let selectedTags = new Set(); 

  const searchContainer = document.querySelector(".search");
  const searchContent = document.querySelector(".search-content");
  const clearButton = document.querySelector(".search-clear");

  searchContainer.style.display = "none";

  fetch("data.json") 
    .then(response => response.json())
    .then(data => {
      allJobs = data;
      renderJobs(allJobs);
    })
    .catch(error => console.error("Error loading job listings:", error));

  function renderJobs(jobs) {
    const jobsContainer = document.querySelector(".jobs");
    jobsContainer.innerHTML = ""; 

    jobs.forEach(job => {
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
  }

  function filterJobs() {
    if (selectedTags.size === 0) {
      searchContainer.style.display = "none";
      renderJobs(allJobs); 
      return;
    }

    const filteredJobs = allJobs.filter(job =>
      [...selectedTags].every(tag => job.languages.includes(tag) || job.tools.includes(tag))
    );

    renderJobs(filteredJobs);
  }

  function updateFilterUI() {
    searchContent.innerHTML = "";

    selectedTags.forEach(tag => {
      const tagElement = document.createElement("span");
      tagElement.classList.add("close-tag");
      tagElement.textContent = tag;

      tagElement.addEventListener("click", () => {
        selectedTags.delete(tag);
        updateFilterUI();
        filterJobs();
      });

      searchContent.appendChild(tagElement);
    });

    searchContainer.style.display = selectedTags.size > 0 ? "flex" : "none";
  }

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("tags")) {
      const tag = event.target.textContent.trim();

      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
      } else {
        selectedTags.add(tag);
      }

      updateFilterUI();
      filterJobs();
    }
  });

  clearButton.addEventListener("click", () => {
    selectedTags.clear();
    updateFilterUI();
    renderJobs(allJobs);
  });
});
