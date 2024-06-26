import React, { useState } from 'react';

const BlogPages = () => {
  const [showContent, setShowContent] = useState(false);

  return (
    <section
      data-section-id={1}
      data-share
      data-category="blog"
      data-component-id="2d4a0295_03_awz"
      className="relative py-20 overflow-hidden"
    >
      <img
        className="absolute top-0 right-0 xl:mt-10 -mr-24 lg:-mr-0"
        src="saturn-assets/images/blog/star-circle-right.svg"
        alt=""
        data-config-id="auto-img-1-3"
      />
      <img
        className="hidden sm:block absolute bottom-0 left-0 -mb-48 lg:mb-0"
        src="saturn-assets/images/blog/blue-light-left.png"
        alt=""
        data-config-id="auto-img-2-3"
      />
      <div className="relative container px-4 mx-auto">
        <div className="max-w-xl lg:max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto mb-15 text-center">
            <span
              className="inline-block py-1 px-3 mb-4 text-xs font-semibold text-orange-900 bg-orange-50 rounded-full"
              data-config-id="auto-txt-1-3"
            >
              OUR BLOG
            </span>
            {/* <h1 className="font-heading text-5xl xs:text-6xl md:text-7xl font-bold">
              <span data-config-id="auto-txt-2-3">News &amp;</span>
              <span className="font-serif italic" data-config-id="auto-txt-3-3">
                Articles
              </span>
            </h1> */}
          </div>
          <div className="flex flex-wrap -mx-4 mb-18 mt-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <a className="block group w-full" href="#">
                <img
                  className="block w-full mb-5"
                  src="https://static.shuffle.dev/components/preview/c6283f8f-6793-47ac-b2f0-908cc21b4d11/assets/public/saturn-assets/images/blog/article-big.png"
                  alt=""
                  data-config-id="auto-img-3-3"
                />
                <span className="block text-gray-500 mb-5" data-config-id="auto-txt-4-3">
                  Jul 20, 2022
                </span>
                <h4
                  className="text-3xl font-semibold text-gray-900 group-hover:text-orange-900 mb-5"
                  data-config-id="auto-txt-5-3"
                >
                  Consectures Dummy Content Velit officia consequat duis enim velit
                </h4>
                <p className="max-w-xl text-lg text-gray-500" data-config-id="auto-txt-6-3">
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
                  consequat duis enim velit mollit xercitation veniam consequat sunt nostrud amet.
                </p>
              </a>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              {[
                { src: "https://static.shuffle.dev/components/preview/c6283f8f-6793-47ac-b2f0-908cc21b4d11/assets/public/saturn-assets/images/blog/article-small-2.png", alt: "auto-img-4-3", txt1: "auto-txt-7-3", txt2: "auto-txt-8-3" },
                { src: "https://static.shuffle.dev/components/preview/c6283f8f-6793-47ac-b2f0-908cc21b4d11/assets/public/saturn-assets/images/blog/article-small-3.png", alt: "auto-img-5-3", txt1: "auto-txt-9-3", txt2: "auto-txt-10-3" },
                { src: "https://static.shuffle.dev/components/preview/c6283f8f-6793-47ac-b2f0-908cc21b4d11/assets/public/saturn-assets/images/blog/article-small-1.png", alt: "auto-img-6-3", txt1: "auto-txt-11-3", txt2: "auto-txt-12-3" }
              ].map((item, index) => (
                <a key={index} className="md:flex group mb-8" href="#">
                  <img className="w-48 h-40" src={`${item.src}`} alt={item.alt} />
                  <div className="mt-4 md:mt-0 md:ml-6 pt-2">
                    <span className="block text-gray-500 mb-2" data-config-id={item.txt1}>
                      Jul 20, 2022
                    </span>
                    <h4
                      className="text-xl font-semibold text-gray-900 group-hover:text-orange-900"
                      data-config-id={item.txt2}
                    >
                      Consectures Content Velitpato officia consequat duis enim velit mollit
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          </div>
          {showContent && (
            <div className="visibility-item flex flex-wrap -mx-4 mb-12 mt-7">
              {[
                { src: "https://static.shuffle.dev/components/preview/c6283f8f-6793-47ac-b2f0-908cc21b4d11/assets/public/saturn-assets/images/blog/image-sm-blog-2.png", alt: "auto-img-3-5", txt1: "auto-txt-4-5", txt2: "auto-txt-5-5", txt3: "auto-txt-6-5" },
                { src: "https://static.shuffle.dev/components/preview/c6283f8f-6793-47ac-b2f0-908cc21b4d11/assets/public/saturn-assets/images/blog/image-sm-blog-3.png", alt: "auto-img-4-5", txt1: "auto-txt-7-5", txt2: "auto-txt-8-5", txt3: "auto-txt-9-5" },
                { src: "https://static.shuffle.dev/components/preview/c6283f8f-6793-47ac-b2f0-908cc21b4d11/assets/public/saturn-assets/images/blog/image-sm-blog-4.png", alt: "auto-img-5-5", txt1: "auto-txt-10-5", txt2: "auto-txt-11-5", txt3: "auto-txt-12-5" },
                { src: "https://static.shuffle.dev/components/preview/c6283f8f-6793-47ac-b2f0-908cc21b4d11/assets/public/saturn-assets/images/blog/image-sm-blog-1.png", alt: "auto-img-6-5", txt1: "auto-txt-13-5", txt2: "auto-txt-14-5", txt3: "auto-txt-15-5" }
              ].map((item, index) => (
                <div key={index} className={`w-full md:w-1/2 xl:w-1/4 px-4 mb-12 ${index < 3 ? "border-r border-gray-100" : ""}`}>
                  <a className="block px-4 group" href="#">
                    <img className="block w-full h-40 mb-4 object-cover rounded-lg" src={`${item.src}`} alt={item.alt} />
                    <span className="block text-gray-500 mb-2" data-config-id={item.txt1}>
                      Jul 20, 2022
                    </span>
                    <h4
                      className="text-xl font-semibold text-gray-900 group-hover:text-orange-900 mb-4"
                      data-config-id={item.txt2}
                    >
                      Consectures Content Velit officia consequat duis enim velit mollit
                    </h4>
                    <p className="text-gray-500" data-config-id={item.txt3}>
                      Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit...
                    </p>
                  </a>
                </div>
              ))}
            </div>
          )}
          <div className="text-center">
            <a
              className="relative group inline-block py-4 px-7 font-semibold text-orange-900 hover:text-orange-50 rounded-full bg-orange-50 transition duration-300 overflow-hidden"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowContent(!showContent);
              }}
            >
              <div className="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500" />
              <span className="relative" data-config-id="auto-txt-13-3">
                See More Articles
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPages;
