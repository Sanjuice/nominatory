import React from 'react';

export default function Movie(props)  {

  console.log(props);
    return (
        <div class="card">
        <div class="card-image">
          <figure class="image is-4by3">
            <img
              src="https://bulma.io/images/placeholders/1280x960.png"
              alt="Placeholder"
            />
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img
                  src="https://bulma.io/images/placeholders/96x96.png"
                  alt="Placeholder"
                />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">title goes here</p>
              <p class="subtitle is-6">@johnsmith</p>
            </div>
          </div>

          <div class="content"></div>
        </div>
      </div>
    );
}