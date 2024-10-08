import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-us-container min-h-screen bg-gradient-to-b from-pink-100 to-white">
      <div className="container mx-auto py-12 px-6 lg:px-20 rounded-xl shadow-2xl bg-white">
        <h1 className="text-4xl lg:text-5xl font-bold text-center text-purple-500 mb-12">
          About Us
        </h1>

        <section className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-800 mb-6 text-center">
            Welcome to Bear Works Lanka!
          </h2>
          <p className="text-gray-600 text-lg lg:text-xl leading-relaxed text-center">
            At Bear Works Lanka, we believe in the magic of imagination and the power of play. Established in 1992,
            we are a family-run business dedicated to crafting high-quality, safe, and lovable soft toys that bring comfort and joy to both children and adults.
          </p>
        </section>

        <section className="mb-12 bg-pink-50 rounded-lg p-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-pink-600 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg lg:text-xl leading-relaxed">
            Our mission is simple: to create soft toys that inspire joy, spark creativity, and offer comfort. Each of our toys is lovingly designed and crafted to become a cherished companion for years to come.
          </p>
        </section>

        <section className="mb-12 bg-yellow-50 rounded-lg p-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-yellow-600 mb-4">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-700 text-lg lg:text-xl leading-relaxed space-y-3">
            <li><strong>Handcrafted Love:</strong> Each toy is handcrafted with love, ensuring unique details and a personal touch.</li>
            <li><strong>Safety First:</strong> Our toys meet the highest safety standards, making them suitable for children of all ages.</li>
            <li><strong>Sustainability:</strong> We are committed to sustainability, using eco-friendly materials and packaging.</li>
          </ul>
        </section>

        <section className="mb-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-blue-600 mb-4">Our Story</h2>
          <p className="text-gray-700 text-lg lg:text-xl leading-relaxed">
            Bear Works Lanka began with a passion for creativity and a love for toys. Our founder, Oshera K.A.T., created the first soft toy for their child in Kaduwela. The heartfelt design quickly turned into a business after friends and family admired the hand-crafted toys.
          </p>
        </section>

        <section className="mb-12 bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl lg:text-3xl font-semibold text-green-600 mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-gray-700 text-lg lg:text-xl leading-relaxed space-y-3">
            <li><strong>Quality:</strong> We uphold the highest quality standards, ensuring each toy is carefully crafted.</li>
            <li><strong>Creativity:</strong> We foster creativity, reflected in both our toy designs and the imaginative play they inspire.</li>
            <li><strong>Customer Satisfaction:</strong> We prioritize our customers, listening to feedback to enhance every experience.</li>
          </ul>
        </section>

        <section className="bg-purple-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold text-purple-600 mb-4">Join the Bear Works Lanka Family</h2>
          <p className="text-gray-700 text-lg lg:text-xl leading-relaxed">
            We’re so grateful to have you with us! Whether you’re buying for yourself, gifting to a loved one, or growing your collection, we’re thrilled to share our toys with you. Let’s spread joy, one soft toy at a time.
          </p>
          <p className="text-gray-700 text-lg lg:text-xl mt-6">
            Discover our newest collections and meet your next cuddly friend today!
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
