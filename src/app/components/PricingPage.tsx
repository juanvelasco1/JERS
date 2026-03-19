import { motion } from "motion/react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$20",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    highlighted: true,
  },
  {
    name: "Team",
    price: "$40",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    highlighted: false,
  },
];

export function PricingPage() {
  return (
    <div className="pb-20">
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl text-gray-900 mb-1"
          style={{ fontWeight: 700 }}
        >
          Precios
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl text-blue-600"
          style={{ fontWeight: 600 }}
        >
          soluciones rápidas
        </motion.p>
      </section>

      <section className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? "bg-[#FCFAF5] border-2 border-blue-600 shadow-lg"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <span className="text-[12px] text-gray-500 mb-3" style={{ fontWeight: 500 }}>{plan.name}</span>
              <h2 className="text-4xl text-gray-900 mb-6" style={{ fontWeight: 700 }}>{plan.price}</h2>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span className="text-[13px] text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2.5 rounded-lg text-[14px] transition-colors ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-[#FCFAF5] border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
                style={{ fontWeight: 500 }}
              >
                Sign Up
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}