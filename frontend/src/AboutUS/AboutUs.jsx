import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto p-8 bg-gray-100">
      <h1 className="text-5xl font-extrabold text-center text-pink-700 mb-8">About Us</h1>
      <p className="text-lg text-center text-gray-700 mb-12 leading-relaxed">
        At Soft Toys Inc., we craft cuddly companions that bring joy to hearts of all ages. Our mission is to deliver high-quality, adorable soft toys that ignite imagination and offer comfort.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div className="bg-white rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Our Story</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Established in 2010, Soft Toys Inc. began as a small workshop fueled by a big dream. Our founder, a dedicated toy designer, envisioned creating soft toys that were not only charming but also safe and long-lasting. Today, we stand as a leading soft toy manufacturer with a global reach and a devoted customer base.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Our Values</h2>
          <ul className="list-disc text-lg text-gray-600 pl-6">
            <li className="mb-2">Quality: We use only the finest materials and craftsmanship to create soft toys that will be cherished for years.</li>
            <li className="mb-2">Safety: We prioritize our customers' safety, ensuring all products meet or exceed international safety standards.</li>
            <li className="mb-2">Innovation: We continuously seek new ways to innovate and enhance our products, staying at the forefront of the soft toy industry.</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 transition duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Our Team</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our team comprises passionate and skilled professionals who share our vision of creating the world’s best soft toys. From designers to manufacturers, each of us is dedicated to spreading joy and comfort through our products.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;