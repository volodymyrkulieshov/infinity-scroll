const elements = {
  list: document.querySelector(".js-movie-list"),
  guard: document.querySelector(".js-guard"),
};

const options = {
  root: null,
  rootMargin: "300px",
};

const observer = new IntersectionObserver(handerLoadMore, options);

// console.log(observer);

let page = 498;

servisMovie(page)
  .then((data) => {
    // console.log(data);
    elements.list.insertAdjacentHTML("beforeend", createMarup(data.results));
    if (data.total_pages > data.page) {
      observer.observe(elements.guard);
    }
  })
  .catch((error) => console.log(error));

function servisMovie(page = 1) {
  const BASE_URL = "https://api.themoviedb.org/3";
  const END_POINT = "/trending/movie/week";
  const API_KYE = "55a48febb45b5475689763bd95744d57";
  const params = new URLSearchParams({
    api_key: API_KYE,
    page,
  });
  //   console.log(params.toString());
  return fetch(`${BASE_URL}${END_POINT}?${params}`).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}
// --------------FILMS---------------------------

function createMarup(arr) {
  return arr
    .map(
      ({ poster_path, original_title, release_date, vote_average }) => `
<li class= "movie-card">
<img src="https://image.tmdb.org/t/p/w300${poster_path}" alt="${original_title}">
<div class="movie-info">
<h2>${original_title}</h2>
<p>Release Date: ${release_date}</p>
<p>Vote Average: ${vote_average}</p>
</div>
</li>`
    )
    .join("");
}
// ------------ACTORS---------------------------
// function createMarup(arr) {
//   return arr
//     .map(
//       ({
//         profile_path,
//         original_name,
//         known_for: {
//           0: { title, vote_average },
//         },
//         popularity,
//       }) => `
// <li class= "movie-card">
// <img src="https://image.tmdb.org/t/p/w300${profile_path}" alt="${original_name}">
// <div class="movie-info">
// <h2>${original_name}</h2>
// <p>Film: ${title}</p>
// <p>Vote_Average: ${vote_average}</p>
// </div>
// </li>`
//     )
//     .join("");
// }

function handerLoadMore(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      page += 1;
      servisMovie(page)
        .then((data) => {
          // console.log(data);
          elements.list.insertAdjacentHTML(
            "beforeend",
            createMarup(data.results)
          );
          if (data.page >= 500) {
            observer.unobserve(elements.guard);
          }
        })
        .catch((error) => console.log(error));
    }
  });
}

// --------BASE_SCROLL-------------

// document.addEventListener("scroll", handlerScroll);

// let counterScroll = 0;
// function handlerScroll() {
//   counterScroll += 1;
//   console.log("counterScroll", counterScroll);
// }
