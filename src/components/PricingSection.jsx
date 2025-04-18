export default function PricingSection() {
    const plans = [
      {
        name: "Free",
        price: "$0",
        period: "forever",
        features: [
          "Basic photo editing",
          "Limited templates",
          "Standard effects & filters",
          "Watermarked exports"
        ],
        cta: "Start Free",
        popular: false
      },
      {
        name: "Pro",
        price: "$8.99",
        period: "per month",
        features: [
          "Advanced photo editing",
          "Premium templates",
          "All effects & filters",
          "No watermarks",
          "Cloud storage",
          "Priority support"
        ],
        cta: "Go Pro",
        popular: true
      },
      {
        name: "Team",
        price: "$19.99",
        period: "per month",
        features: [
          "Everything in Pro",
          "Team collaboration",
          "Brand assets management",
          "Advanced permissions",
          "Analytics",
          "Dedicated support"
        ],
        cta: "Contact Sales",
        popular: false
      }
    ]
  
    return (
      <section id="pricing" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>
  
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-lg shadow-md overflow-hidden ${
                  plan.popular ? 'border-2 border-primary ring-2 ring-primary ring-opacity-20' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary py-1 text-center text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="ml-1 text-base text-gray-500">/{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <a
                      href="#"
                      className={`block w-full py-3 px-4 rounded-md text-center font-medium ${
                        plan.popular
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }