import React from 'react';
import './UygulamaSlider.css'

const UygulamaSlider: React.FC = () => {
  return (
    <div className="container text-center my-3">
      <h2 className="font-weight-light">Bootstrap Multi Slide Carousel</h2>
      <div className="row mx-auto my-auto justify-content-center">
        <div id="recipeCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner" role="listbox">
            {['Card title', 'Example foo', 'Biz Baz', 'Foo Bar', 'Bar Foo', 'Biz Biz'].map((title, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <div className="col-md-3 col-xs-12">
                  <div className="card" style={{ width: '18rem' }}>
                    <img
                      src="https://placehold.co/286x286"
                      className="card-img-top"
                      alt={title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{title}</h5>
                      <p className="card-text">
                        Some quick example text to build on the card title and make up the bulk of the card's content.
                      </p>
                      <a href="#" className="btn btn-primary">
                        Go somewhere
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#recipeCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#recipeCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <button
            className="w-auto"
            data-bs-target="#recipeCarousel"
            data-bs-slide="prev"
            role="button"
          >
            <span className="carousel-control-prev-icon bg-dark border border-dark rounded-circle" aria-hidden="true"></span>
            <span className="visually-hidden-focusable">Previous</span>
          </button>
          <button
            className="w-auto"
            data-bs-target="#recipeCarousel"
            data-bs-slide="next"
            role="button"
          >
            <span className="carousel-control-next-icon bg-dark border border-dark rounded-circle" aria-hidden="true"></span>
            <span className="visually-hidden-focusable">Next</span>
          </button>
          <h5 className="mt-2 fw-light">Advances one slide at a time</h5>
        </div>
      </div>
    </div>
  );
};

export default UygulamaSlider;
