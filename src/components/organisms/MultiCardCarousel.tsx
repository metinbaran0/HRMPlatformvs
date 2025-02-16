import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./MultiCardCarousel.css";

const MultiCardCarousel = () => {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".carousel .carousel-item");

    // Carousel öğelerini çoğaltmak
    items.forEach((el) => {
      const minPerSlide = 5;
      let next: HTMLElement | null = el.nextElementSibling as HTMLElement;
      for (let i = 1; i < minPerSlide; i++) {
        if (!next) {
          next = items[0] as HTMLElement;
        }
        let cloneChild = next.cloneNode(true) as HTMLElement;
        el.appendChild(cloneChild.firstElementChild as HTMLElement);
        next = next.nextElementSibling as HTMLElement;
      }
    });
  }, []);

  return (
    <div className="container text-center my-3">
      <div className="row mx-auto my-auto justify-content-center">
        <div id="multiCardCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner" role="listbox">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <div className="col-md-4">
                  <div className="card card-body">
                    <img className="img-fluid" src={`https://picsum.photos/200/150?random=${index}`} alt="Carousel Item" />
                  </div>
                </div>
              </div>
            ))}
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default MultiCardCarousel;
