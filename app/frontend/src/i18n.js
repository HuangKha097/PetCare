import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      nav: { 
        home: "Home", shop: "Shop", blog: "Blog", our_story: "Our Story", faq: "FAQ", contact: "Contact",
        sign_in: "Sign In", welcome_back: "Welcome back"
      },
      category: { Food: "Food", Toys: "Toys", Accessories: "Accessories", Health: "Health", Grooming: "Grooming", Beds: "Beds" },
      product: { price: "Price", stock: "Stock", add_to_cart: "Add to Cart", out_of_stock: "Out of Stock", quick_add: "Quick Add", best_seller: "Best Seller", member_price: "Member Price", add_to_wishlist: "Add to Wishlist", in_stock: "In Stock", low_stock: "Low Stock", reviews: "Reviews", description: "Description", ingredients: "Ingredients", write_review: "Write a Review", post_review: "Post Review" },
      admin: {
        dashboard: "Dashboard Overview", dashboard_desc: "Your business performance at a glance.",
        revenue: "Total Revenue", orders: "Total Orders", customers: "New Customers", active_products: "Active Products",
        revenue_trend: "Revenue Trend", orders_volume: "Orders Volume", top_sellers: "Top Best Sellers",
        inventory: "Inventory Monitoring", inventory_description: "Track items that are running low and need restocking.", 
        out_of_stock: "Out of Stock", out_of_stock_count: "You have {{count}} products with 0 stock.",
        low_stock_warning: "Low Stock Warning", low_stock_threshold: "Products running below {{threshold}} items.",
        needs_restocking: "Needs Restocking", total_products: "Total Products", low_stock: "Low Stock Items", quick_restock: "Quick Restock",
        product: "Product", sku: "SKU", current_stock: "Current Stock", quick_action: "Quick Action",
        products: "Products", products_desc: "Manage your catalog, stock, and visibility.", add_product: "Add Product", edit_product: "Edit Product", save: "Save",
        search: "Search by Name, SKU, Category, Brand...", all_status: "All Status", active: "Active", hidden: "Hidden",
        image: "Image", details: "Product Details", actions: "Actions", total_sold: "Total Sold",
        add_new_product: "Add New Product", edit_existing_product: "Edit Product", form_desc: "Fill in the information below.",
        basic_info: "Basic Information", product_name: "Product Name", brand: "Brand", category: "Category",
        pricing_stock: "Pricing & Stock", stock_quantity: "Stock Quantity", publish_immediate: "Publish immediately",
        create_product: "Create Product", cancel: "Cancel", product_image: "Product Image",
        update_success: "Product updated successfully!", create_success: "Product created successfully!",
        invalid_password: "Invalid admin password", save_failed: "Failed to save product",
        admin_password: "Admin Password", verifying: "Verifying...", confirm_update: "Confirm Update",
        loading: "Loading...", pet_type: "Pet Type"
      }
    }
  },
  vi: {
    translation: {
      nav: { 
        home: "Trang Chủ", shop: "Cửa Hàng", blog: "Bài Viết", our_story: "Câu Chuyện", faq: "Hỏi Đáp", contact: "Liên Hệ",
        sign_in: "Đăng Nhập", welcome_back: "Chào mừng trở lại"
      },
      category: { Food: "Thức Ăn", Toys: "Đồ Chơi", Accessories: "Phụ Kiện", Health: "Sức Khỏe", Grooming: "Cắt Tỉa", Beds: "Giường Đệm" },
      product: { price: "Giá", stock: "Tồn Kho", add_to_cart: "Thêm vào giỏ", out_of_stock: "Hết Hàng", quick_add: "Thêm Nhanh", best_seller: "Bán Chạy", member_price: "Giá Thành Viên", add_to_wishlist: "Yêu Thích", in_stock: "Còn Hàng", low_stock: "Sắp Hết", reviews: "Đánh Giá", description: "Mô Tả", ingredients: "Thành Phần", write_review: "Viết Đánh Giá", post_review: "Gửi Đánh Giá" },
      admin: {
        dashboard: "Tổng Quan", dashboard_desc: "Hiệu suất kinh doanh của bạn.",
        revenue: "Tổng Doanh Thu", orders: "Tổng Đơn Hàng", customers: "Khách Hàng Mới", active_products: "Sản Phẩm Mở Bán",
        revenue_trend: "Xu Hướng Doanh Thu", orders_volume: "Số Lượng Đơn", top_sellers: "Sản Phẩm Bán Chạy Nhất",
        inventory: "Giám Sát Tồn Kho", inventory_description: "Theo dõi các sản phẩm sắp hết cần nhập hàng.",
        out_of_stock: "Hết Hàng", out_of_stock_count: "Bạn có {{count}} sản phẩm hết hàng.",
        low_stock_warning: "Cảnh Báo Sắp Hết", low_stock_threshold: "Các sản phẩm còn dưới {{threshold}} mục.",
        needs_restocking: "Cần Nhập Kho", total_products: "Tổng Sản Phẩm", low_stock: "Sắp Hết Hàng", quick_restock: "Nhập Kho Nhanh",
        product: "Sản Phẩm", sku: "Mã SKU", current_stock: "Tồn Kho Hiện Tại", quick_action: "Thao Tác Nhanh",
        products: "Sản Phẩm", products_desc: "Quản lý danh mục, kho hàng và hiển thị.", add_product: "Thêm Sản Phẩm", edit_product: "Sửa Sản Phẩm", save: "Lưu",
        search: "Tìm theo tên, SKU, Danh mục...", all_status: "Tất cả trạng thái", active: "Đang Bán", hidden: "Đã Ẩn",
        image: "Ảnh", details: "Chi Tiết", actions: "Hành Động", total_sold: "Đã Bán",
        add_new_product: "Thêm Sản Phẩm Mới", edit_existing_product: "Sửa Sản Phẩm", form_desc: "Điền thông tin bên dưới.",
        basic_info: "Thông Tin Cơ Bản", product_name: "Tên Sản Phẩm", brand: "Thương Hiệu", category: "Danh Mục",
        pricing_stock: "Giá & Tồn Kho", stock_quantity: "Số Lượng Tồn", publish_immediate: "Xuất bản ngay",
        create_product: "Tạo Sản Phẩm", cancel: "Hủy", product_image: "Hình Ảnh Sản Phẩm",
        update_success: "Cập nhật sản phẩm thành công!", create_success: "Tạo sản phẩm thành công!",
        invalid_password: "Mật khẩu Admin không chính xác", save_failed: "Không thể lưu sản phẩm",
        admin_password: "Mật khẩu Admin", verifying: "Đang xác thực...", confirm_update: "Xác Nhận Cập Nhật",
        loading: "Đang tải...", pet_type: "Loại Thú Cưng"
      }
    }
  },
  zh: {
    translation: {
      nav: { 
        home: "主页", shop: "商店", blog: "博客", our_story: "我们的故事", faq: "常见问题", contact: "联系我们",
        sign_in: "登录", welcome_back: "欢迎回来"
      },
      category: { Food: "食品", Toys: "玩具", Accessories: "配件", Health: "健康", Grooming: "美容", Beds: "床铺" },
      product: { price: "价格", stock: "库存", add_to_cart: "加入购物车", out_of_stock: "缺货", quick_add: "快速添加", best_seller: "畅销", member_price: "会员价", add_to_wishlist: "加入心愿单", in_stock: "有货", low_stock: "低库存", reviews: "评论", description: "描述", ingredients: "成分", write_review: "写评论", post_review: "提交评论" },
      admin: {
        dashboard: "仪表盘", dashboard_desc: "您的业务表现一览。",
        revenue: "总收入", orders: "总订单", customers: "新客户", active_products: "有效产品",
        revenue_trend: "收入趋势", orders_volume: "订单量", top_sellers: "最畅销产品",
        inventory: "库存监控", inventory_description: "跟踪库存不足且需要补货的物品。",
        out_of_stock: "缺货", out_of_stock_count: "您有 {{count}} 件产品库存为 0。",
        low_stock_warning: "低库存警告", low_stock_threshold: "产品低于 {{threshold}} 件。",
        needs_restocking: "需要补货", total_products: "总产品", low_stock: "低库存", quick_restock: "快速补货",
        product: "产品", sku: "库存单位 (SKU)", current_stock: "当前库存", quick_action: "快速操作",
        products: "产品", products_desc: "管理您的目录，库存和可见性。", add_product: "添加产品", edit_product: "编辑产品", save: "保存",
        search: "按名称，SKU，类别，品牌搜索...", all_status: "所有状态", active: "有效", hidden: "隐藏",
        image: "图片", details: "详情", actions: "操作", total_sold: "总销量",
        add_new_product: "添加新产品", edit_existing_product: "编辑产品", form_desc: "填写以下信息。",
        basic_info: "基本信息", product_name: "产品名称", brand: "品牌", category: "类别",
        pricing_stock: "定价与库存", stock_quantity: "库存数量", publish_immediate: "立即发布",
        create_product: "创建产品", cancel: "取消", product_image: "产品图片",
        update_success: "产品更新成功！", create_success: "产品创建成功！",
        invalid_password: "管理员密码无效", save_failed: "保存产品失败",
        admin_password: "管理员密码", verifying: "正在验证...", confirm_update: "确认更新",
        loading: "正在加载...", pet_type: "宠物类型"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safe from XSS
    }
  });

export default i18n;
