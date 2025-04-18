export default function TestimonialSection() {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by Millions Worldwide
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              See what our users are saying about Fotorx    
            </p>
          </div>
  
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                    <img 
                      src={`/api/placeholder/100/100`} 
                      alt={`User ${index + 1}`} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">User {index + 1}</h4>
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Fotor has completely transformed how I edit my photos. The tools are intuitive and the results are professional quality. I use it for all my social media content now!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }