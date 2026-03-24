import { Code, Palette, TrendingUp, Megaphone, Users, Calculator, Wrench, Heart } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Công nghệ thông tin",
    icon: Code,
    count: 2547,
    color: "from-[#f26b38] to-[#e05a27]",
  },
  {
    id: 2,
    name: "Thiết kế - Đồ họa",
    icon: Palette,
    count: 1234,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Kinh doanh - Bán hàng",
    icon: TrendingUp,
    count: 1876,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    name: "Marketing - PR",
    icon: Megaphone,
    count: 987,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    name: "Nhân sự",
    icon: Users,
    count: 654,
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: 6,
    name: "Kế toán - Tài chính",
    icon: Calculator,
    count: 823,
    color: "from-teal-500 to-green-500",
  },
  {
    id: 7,
    name: "Kỹ thuật - Công nghệ",
    icon: Wrench,
    count: 1432,
    color: "from-gray-500 to-slate-500",
  },
  {
    id: 8,
    name: "Y tế - Chăm sóc sức khỏe",
    icon: Heart,
    count: 765,
    color: "from-pink-500 to-rose-500",
  },
];

export function JobCategories() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4">
            Khám phá theo ngành nghề
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm cơ hội việc làm phù hợp với chuyên môn và đam mê của bạn
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                
                <div className="relative space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-left">
                    <h3 className="text-sm mb-1 group-hover:text-[#f26b38] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.count.toLocaleString()} việc làm
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
