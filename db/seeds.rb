# db/seeds.rb

# Clear existing data
puts "Clearing existing data..."
["bicycle", "ski", "surfboard"].each do |product_type|
  ProductType.create(code: product_type, name: product_type.capitalize, description: "#{product_type.capitalize} Package")
end

bicycle = ProductType.find_by(code: "bicycle")

# Create Mountain Bike
puts "Creating Mountain Bike..."
mountain_bike = Product.create!(
  name: "Custom Mountain Bike",
  description: "Build your perfect trail companion",
  base_price: 799.99,
  product_type: bicycle,
  active: true
)

# Frame Category
frame_category = bicycle.part_categories.create!(
  name: "Frame",
  required: true,
  position: 1
)

frame_options = [
  {
    name: "Hardtail Frame",
    price: 299.99,
    in_stock: true
  },
  {
    name: "Full Suspension Frame",
    price: 699.99,
    in_stock: true
  }
]

frame_options.each do |option|
  frame_category.part_options.create!(option)
end

# Wheels Category
wheels_category = bicycle.part_categories.create!(
  name: "Wheels",
  required: true,
  position: 2
)

wheel_options = [
  {
    name: "Trail Wheels",
    price: 199.99,
    in_stock: true
  },
  {
    name: "Enduro Wheels",
    price: 399.99,
    in_stock: true
  },
  {
    name: "Carbon Race Wheels",
    price: 899.99,
    in_stock: false
  }
]

wheel_options.each do |option|
  wheels_category.part_options.create!(option)
end

# Create Road Bike
puts "Creating Road Bike..."
road_bike = Product.create!(
  name: "Custom Road Bike",
  description: "Professional grade racing machine",
  base_price: 999.99,
  product_type: ProductType.where(code: "bicycle").first,
  active: true
)

# Frame Category
road_frame_category = bicycle.part_categories.create!(
  name: "Frame",
  required: true,
  position: 1
)

road_frame_options = [
  {
    name: "Aluminum Race Frame",
    price: 499.99,
    in_stock: true
  },
  {
    name: "Carbon Race Frame",
    price: 1299.99,
    in_stock: true
  },
  {
    name: "Pro Carbon Frame",
    price: 2499.99,
    in_stock: false
  }
]

road_frame_options.each do |option|
  road_frame_category.part_options.create!(option)
end

# Groupset Category
groupset_category = bicycle.part_categories.create!(
  name: "Groupset",
  required: true,
  position: 2
)

groupset_options = [
  {
    name: "Shimano 105",
    price: 399.99,
    in_stock: true
  },
  {
    name: "Shimano Ultegra",
    price: 799.99,
    in_stock: true
  },
  {
    name: "Shimano Dura-Ace",
    price: 1499.99,
    in_stock: true
  }
]

groupset_options.each do |option|
  groupset_category.part_options.create!(option)
end

# Create Ski Package
puts "Creating Ski Package..."
ski_package = Product.create!(
  name: "Custom Ski Package",
  description: "Your perfect setup for the slopes",
  base_price: 499.99,
  product_type: ProductType.where(code: "ski").first,
  active: true
)

# Skis Category
skis_category = ski_package.product_type.part_categories.create!(
  name: "Skis",
  required: true,
  position: 1
)

ski_options = [
  {
    name: "All-Mountain Skis",
    price: 399.99,
    in_stock: true
  },
  {
    name: "Powder Skis",
    price: 599.99,
    in_stock: true
  },
  {
    name: "Race Skis",
    price: 799.99,
    in_stock: true
  }
]

ski_options.each do |option|
  skis_category.part_options.create!(option)
end

# Bindings Category
bindings_category = ski_package.product_type.part_categories.create!(
  name: "Bindings",
  required: true,
  position: 2
)

binding_options = [
  {
    name: "Sport Bindings",
    price: 199.99,
    in_stock: true
  },
  {
    name: "Performance Bindings",
    price: 299.99,
    in_stock: true
  },
  {
    name: "Pro Race Bindings",
    price: 399.99,
    in_stock: true
  }
]

binding_options.each do |option|
  bindings_category.part_options.create!(option)
end

# Create some price rules
puts "Creating price rules..."

# Mountain Bike Combo Deal
full_suspension = frame_category.part_options.find_by(name: "Full Suspension Frame")
enduro_wheels = wheels_category.part_options.find_by(name: "Enduro Wheels")

if full_suspension && enduro_wheels
  PriceRule.create!(
    product_type: mountain_bike.product_type,
    price: 999.99,  # Special combo price
    description: "Enduro Package - Full Suspension with Enduro Wheels"
  ).tap do |rule|
    rule.part_options << full_suspension
    rule.part_options << enduro_wheels
  end
end

# Road Bike Pro Setup
carbon_frame = road_frame_category.part_options.find_by(name: "Carbon Race Frame")
dura_ace = groupset_category.part_options.find_by(name: "Shimano Dura-Ace")

if carbon_frame && dura_ace
  PriceRule.create!(
    product_type: road_bike.product_type,
    price: 2499.99,  # Pro package deal
    description: "Pro Road Package - Carbon Frame with Dura-Ace"
  ).tap do |rule|
    rule.part_options << carbon_frame
    rule.part_options << dura_ace
  end
end

# Ski Package Deal
powder_skis = skis_category.part_options.find_by(name: "Powder Skis")
perf_bindings = bindings_category.part_options.find_by(name: "Performance Bindings")

if powder_skis && perf_bindings
  PriceRule.create!(
    product_type: ski_package.product_type,
    price: 799.99,  # Package deal
    description: "Powder Package - Powder Skis with Performance Bindings"
  ).tap do |rule|
    rule.part_options << powder_skis
    rule.part_options << perf_bindings
  end
end

puts "Seed completed successfully!"
puts "Created products:"
puts "- #{mountain_bike.name}"
puts "- #{road_bike.name}"
puts "- #{ski_package.name}"
puts "Total price rules created: #{PriceRule.count}"

# db/seeds.rb

puts "Cleaning database..."
ProductType.destroy_all

def create_product_type(code:, name:, description:)
  ProductType.find_or_create_by(
    code: code,
    name: name,
  ).tap do |product_type|
    product_type.update(description: description)
    puts "Created product type: #{name}"
  end
end

def create_categories(product_type, categories_data)
  product_type.save(validate: false)
  categories_data.each do |category_data|
    category = product_type.part_categories.create!(
      name: category_data[:name],
      required: category_data[:required],
      position: category_data[:position]
    )

    category_data[:options].each_with_index do |option_data, index|
      category.part_options.create!(
        name: option_data[:name],
        price: option_data[:price],
        position: index + 1,
        stock_quantity: rand(5..50)
      )
    end
  end
end

def create_price_rules(product_type, rules_data)
  rules_data.each do |rule_data|
    rule = product_type.price_rules.create!(
      description: rule_data[:description],
      price: rule_data[:price]
    )

    # Find and associate options
    rule_data[:options].each do |category_name, option_name|
      category = product_type.part_categories.find_by!(name: category_name)
      option = category.part_options.find_by!(name: option_name)
      rule.price_rule_conditions.create!(part_option: option)
    end
  end
end

# Bicycle Product Type
bicycle_type = create_product_type(
  code: 'bicycle',
  name: 'Custom Bicycle',
  description: 'Build your perfect ride with custom components'
)

bicycle_categories = [
  {
    name: 'Frame',
    required: true,
    position: 1,
    options: [
      { name: 'Aluminum Frame', price: 299.99 },
      { name: 'Carbon Fiber Frame', price: 999.99 },
      { name: 'Steel Frame', price: 399.99 },
      { name: 'Titanium Frame', price: 1499.99 },
      { name: 'Full Suspension Frame', price: 1299.99 },
      { name: 'Hardtail Frame', price: 699.99 }
    ]
  },
  {
    name: 'Wheels',
    required: true,
    position: 2,
    options: [
      { name: 'Road Wheels', price: 199.99 },
      { name: 'Mountain Wheels', price: 249.99 },
      { name: 'Gravel Wheels', price: 299.99 },
      { name: 'Carbon Race Wheels', price: 899.99 },
      { name: 'Trail Wheels', price: 349.99 },
      { name: 'Enduro Wheels', price: 449.99 }
    ]
  },
  {
    name: 'Groupset',
    required: true,
    position: 3,
    options: [
      { name: 'Shimano 105', price: 599.99 },
      { name: 'Shimano Ultegra', price: 999.99 },
      { name: 'Shimano Dura-Ace', price: 1999.99 },
      { name: 'SRAM Rival', price: 699.99 },
      { name: 'SRAM Force', price: 1299.99 },
      { name: 'SRAM Red', price: 2499.99 }
    ]
  },
  {
    name: 'Handlebar',
    required: true,
    position: 4,
    options: [
      { name: 'Aluminum Drop Bar', price: 79.99 },
      { name: 'Carbon Drop Bar', price: 249.99 },
      { name: 'Flat Bar', price: 59.99 },
      { name: 'Riser Bar', price: 89.99 },
      { name: 'Aero Bar', price: 199.99 },
      { name: 'Gravel Bar', price: 129.99 }
    ]
  },
  {
    name: 'Saddle',
    required: true,
    position: 5,
    options: [
      { name: 'Sport Saddle', price: 49.99 },
      { name: 'Race Saddle', price: 129.99 },
      { name: 'Comfort Saddle', price: 79.99 },
      { name: 'Carbon Saddle', price: 199.99 },
      { name: 'Women-Specific Saddle', price: 89.99 },
      { name: 'MTB Saddle', price: 69.99 }
    ]
  }
]

create_categories(bicycle_type, bicycle_categories)

bicycle_rules = [
  {
    description: 'Pro Road Package',
    price: 4999.99,
    options: {
      'Frame' => 'Carbon Fiber Frame',
      'Wheels' => 'Carbon Race Wheels',
      'Groupset' => 'Shimano Dura-Ace'
    }
  },
  {
    description: 'Trail Ready Package',
    price: 2999.99,
    options: {
      'Frame' => 'Full Suspension Frame',
      'Wheels' => 'Trail Wheels',
      'Groupset' => 'SRAM Rival'
    }
  },
  {
    description: 'Gravel Adventure Package',
    price: 3499.99,
    options: {
      'Frame' => 'Titanium Frame',
      'Wheels' => 'Gravel Wheels',
      'Groupset' => 'SRAM Force'
    }
  }
]

create_price_rules(bicycle_type, bicycle_rules)

# Ski Product Type
ski_type = create_product_type(
  code: 'ski',
  name: 'Custom Ski Package',
  description: 'Build your perfect ski setup'
)

ski_categories = [
  {
    name: 'Skis',
    required: true,
    position: 1,
    options: [
      { name: 'All-Mountain Skis', price: 499.99 },
      { name: 'Powder Skis', price: 599.99 },
      { name: 'Race Skis', price: 799.99 },
      { name: 'Park Skis', price: 449.99 },
      { name: 'Touring Skis', price: 699.99 },
      { name: 'Carving Skis', price: 549.99 }
    ]
  },
  {
    name: 'Bindings',
    required: true,
    position: 2,
    options: [
      { name: 'All-Mountain Bindings', price: 199.99 },
      { name: 'Race Bindings', price: 299.99 },
      { name: 'Touring Bindings', price: 399.99 },
      { name: 'Park Bindings', price: 249.99 },
      { name: 'Junior Bindings', price: 149.99 },
      { name: 'Pro Bindings', price: 349.99 }
    ]
  },
  {
    name: 'Boots',
    required: true,
    position: 3,
    options: [
      { name: 'Beginner Boots', price: 199.99 },
      { name: 'Intermediate Boots', price: 299.99 },
      { name: 'Advanced Boots', price: 399.99 },
      { name: 'Racing Boots', price: 599.99 },
      { name: 'Touring Boots', price: 499.99 },
      { name: 'Freestyle Boots', price: 349.99 }
    ]
  },
  {
    name: 'Poles',
    required: true,
    position: 4,
    options: [
      { name: 'Aluminum Poles', price: 49.99 },
      { name: 'Carbon Poles', price: 149.99 },
      { name: 'Racing Poles', price: 199.99 },
      { name: 'Adjustable Poles', price: 79.99 },
      { name: 'Freestyle Poles', price: 69.99 },
      { name: 'Junior Poles', price: 39.99 }
    ]
  },
  {
    name: 'Extras',
    required: false,
    position: 5,
    options: [
      { name: 'Ski Bag', price: 79.99 },
      { name: 'Boot Bag', price: 49.99 },
      { name: 'Ski Lock', price: 29.99 },
      { name: 'Boot Dryer', price: 89.99 },
      { name: 'Boot Heaters', price: 199.99 },
      { name: 'Wax Kit', price: 39.99 }
    ]
  }
]

create_categories(ski_type, ski_categories)

ski_rules = [
  {
    description: 'Pro Race Package',
    price: 1499.99,
    options: {
      'Skis' => 'Race Skis',
      'Bindings' => 'Race Bindings',
      'Boots' => 'Racing Boots'
    }
  },
  {
    description: 'Powder Hunter Package',
    price: 1299.99,
    options: {
      'Skis' => 'Powder Skis',
      'Bindings' => 'All-Mountain Bindings',
      'Boots' => 'Advanced Boots'
    }
  },
  {
    description: 'Touring Adventure Package',
    price: 1599.99,
    options: {
      'Skis' => 'Touring Skis',
      'Bindings' => 'Touring Bindings',
      'Boots' => 'Touring Boots'
    }
  }
]

create_price_rules(ski_type, ski_rules)

# Surfboard Product Type
surfboard_type = create_product_type(
  code: 'surfboard',
  name: 'Custom Surfboard',
  description: 'Shape your perfect wave riding machine'
)

surfboard_categories = [
  {
    name: 'Board Type',
    required: true,
    position: 1,
    options: [
      { name: 'Shortboard', price: 599.99 },
      { name: 'Longboard', price: 799.99 },
      { name: 'Fish', price: 649.99 },
      { name: 'Funboard', price: 699.99 },
      { name: 'Gun', price: 899.99 },
      { name: 'SUP', price: 999.99 }
    ]
  },
  {
    name: 'Construction',
    required: true,
    position: 2,
    options: [
      { name: 'PU + Polyester', price: 199.99 },
      { name: 'Epoxy + EPS', price: 299.99 },
      { name: 'Carbon Fiber', price: 499.99 },
      { name: 'Bamboo', price: 399.99 },
      { name: 'Cork', price: 449.99 },
      { name: 'Soft Top', price: 149.99 }
    ]
  },
  {
    name: 'Fins',
    required: true,
    position: 3,
    options: [
      { name: 'Thruster Set', price: 99.99 },
      { name: 'Quad Set', price: 119.99 },
      { name: 'Single Fin', price: 59.99 },
      { name: 'Twin Set', price: 89.99 },
      { name: '5-Fin Set', price: 149.99 },
      { name: 'Performance Set', price: 199.99 }
    ]
  },
  {
    name: 'Fin Box',
    required: true,
    position: 4,
    options: [
      { name: 'FCS II', price: 79.99 },
      { name: 'Futures', price: 79.99 },
      { name: 'Single Box', price: 49.99 },
      { name: 'Glass-On', price: 99.99 },
      { name: 'FCS X-2', price: 89.99 },
      { name: 'Longboard Box', price: 69.99 }
    ]
  },
  {
    name: 'Traction',
    required: true,
    position: 5,
    options: [
      { name: 'Full Deck Pad', price: 89.99 },
      { name: 'Tail Pad', price: 49.99 },
      { name: 'Wax Only', price: 9.99 },
      { name: 'Cork Deck', price: 119.99 },
      { name: 'Front Pad', price: 39.99 },
      { name: 'Arch Bar', price: 29.99 }
    ]
  }
]

create_categories(surfboard_type, surfboard_categories)

surfboard_rules = [
  {
    description: 'Pro Performance Package',
    price: 1299.99,
    options: {
      'Board Type' => 'Shortboard',
      'Construction' => 'Carbon Fiber',
      'Fins' => 'Performance Set'
    }
  },
  {
    description: 'Classic Longboard Setup',
    price: 999.99,
    options: {
      'Board Type' => 'Longboard',
      'Construction' => 'PU + Polyester',
      'Fins' => 'Single Fin'
    }
  },
  {
    description: 'Fish Performance Package',
    price: 899.99,
    options: {
      'Board Type' => 'Fish',
      'Construction' => 'Epoxy + EPS',
      'Fins' => 'Quad Set'
    }
  }
]

create_price_rules(surfboard_type, surfboard_rules)

# Golf Set Product Type
golf_type = create_product_type(
  code: 'golf',
  name: 'Custom Golf Set',
  description: 'Build your perfect set of golf clubs'
)

golf_categories = [
  {
    name: 'Driver',
    required: true,
    position: 1,
    options: [
      { name: 'TaylorMade Stealth', price: 549.99 },
      { name: 'Callaway Rogue', price: 499.99 },
      { name: 'Ping G425', price: 499.99 },
      { name: 'Titleist TSi', price: 549.99 },
      { name: 'Cobra LTDx', price: 499.99 },
      { name: 'Mizuno ST-Z', price: 549.99 }
    ]
  },
  {
    name: 'Irons',
    required: true,
    position: 2,
    options: [
      { name: 'TaylorMade P790', price: 999.99 },
      { name: 'Callaway Apex', price: 1099.99 },
      { name: 'Ping i210', price: 899.99 },
      { name: 'Titleist T100', price: 1199.99 },
      { name: 'Cobra King Tour', price: 1099.99 },
      { name: 'Mizuno JPX921', price: 999.99 }
    ]
  },
  {
    name: 'Wedges',
    required: true,
    position: 3,
    options: [
      { name: 'TaylorMade Hi-Toe', price: 149.99 },
      { name: 'Callaway Jaws', price: 159.99 },
      { name: 'Ping Glide', price: 139.99 },
      { name: 'Titleist Vokey', price: 169.99 },
      { name: 'Cobra King MIM', price: 159.99 },
      { name: 'Mizuno T22', price: 149.99 }
    ]
  },
  {
    name: 'Putter',
    required: true,
    position: 4,
    options: [
      { name: 'TaylorMade Spider', price: 249.99 },
      { name: 'Odyssey White Hot', price: 199.99 },
      { name: 'Ping Sigma 2', price: 199.99 },
      { name: 'Scotty Cameron Special Select', price: 399.99 },
      { name: 'Cobra King Vintage', price: 179.99 },
      { name: 'Mizuno M-Craft', price: 199.99 }
    ]
  }]

create_categories(golf_type, golf_categories)


golf_rules = [
  {
    description: 'Pro Performance Set',
    price: 2999.99,
    options: {
      'Driver' => 'TaylorMade Stealth',
      'Irons' => 'TaylorMade P790',
      'Wedges' => 'TaylorMade Hi-Toe',
      'Putter' => 'TaylorMade Spider'
    }
  },
  {
    description: 'Classic Player Set',
    price: 1999.99,
    options: {
      'Driver' => 'Ping G425',
      'Irons' => 'Ping i210',
      'Wedges' => 'Ping Glide',
      'Putter' => 'Ping Sigma 2'
    }
  },
  {
    description: 'Distance King Set',
    price: 2499.99,
    options: {
      'Driver' => 'Cobra LTDx',
      'Irons' => 'Cobra King Tour',
      'Wedges' => 'Cobra King MIM',
      'Putter' => 'Cobra King Vintage'
    }
  }
]

create_price_rules(golf_type, golf_rules)

puts "Seed completed successfully!"

