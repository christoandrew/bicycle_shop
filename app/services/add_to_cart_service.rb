module Services
  class AddToCartService
    def initialize(user:, product_id:, part_option_ids:)
      @user = user
      @product_id = product_id
      @part_option_ids = part_option_ids
    end

    def call
      product = Product.find(@product_id)
      part_options = PartOption.where(id: @part_option_ids)

      product_selection = ProductSelection.create!(product: product)
      product_selection.part_options << part_options

      cart = @user.cart
      cart.product_selections << product_selection

      cart
    end
  end
end