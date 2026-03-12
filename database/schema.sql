CREATE TABLE IF NOT EXISTS owners (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'owner',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS store_profiles (
  id UUID PRIMARY KEY,
  owner_id UUID UNIQUE NOT NULL REFERENCES owners(id),
  shop_name VARCHAR(160) NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  phone VARCHAR(30) NOT NULL,
  whatsapp_number VARCHAR(30) NOT NULL,
  email VARCHAR(255),
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  city VARCHAR(120),
  state VARCHAR(120),
  postal_code VARCHAR(20),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  opening_hours_json JSONB NOT NULL,
  announcement_text TEXT,
  is_shop_open_override BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS catalog_items (
  id UUID PRIMARY KEY,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('mobile', 'accessory', 'service')),
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  short_description VARCHAR(320) NOT NULL,
  full_description TEXT NOT NULL,
  price NUMERIC(12, 2),
  discount_price NUMERIC(12, 2),
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  category_id UUID REFERENCES categories(id),
  subcategory_id UUID REFERENCES categories(id),
  stock_quantity INT NOT NULL DEFAULT 0,
  stock_status VARCHAR(20) NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  thumbnail_url TEXT,
  average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  total_reviews INT NOT NULL DEFAULT 0,
  specs_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  service_details_json JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS catalog_images (
  id UUID PRIMARY KEY,
  catalog_item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(180),
  sort_order INT NOT NULL DEFAULT 0,
  is_thumbnail BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS catalog_tags (
  id UUID PRIMARY KEY,
  catalog_item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  tag VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY,
  catalog_item_id UUID NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(120) NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(160),
  comment TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY,
  visitor_name VARCHAR(120) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  selected_catalog_item_id UUID REFERENCES catalog_items(id),
  selected_item_title_snapshot VARCHAR(180) NOT NULL,
  selected_item_type_snapshot VARCHAR(20) NOT NULL,
  message TEXT,
  preferred_callback_time VARCHAR(120),
  contact_method_preference VARCHAR(30) NOT NULL,
  consent_accepted BOOLEAN NOT NULL CHECK (consent_accepted = TRUE),
  consent_timestamp TIMESTAMPTZ NOT NULL,
  source_page VARCHAR(255) NOT NULL,
  device_type VARCHAR(30) NOT NULL,
  referral_source TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'new',
  owner_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY,
  session_id VARCHAR(120) NOT NULL,
  event_type VARCHAR(40) NOT NULL,
  viewed_catalog_item_id UUID REFERENCES catalog_items(id),
  page_path VARCHAR(255) NOT NULL,
  referrer TEXT,
  device_type VARCHAR(30) NOT NULL,
  cta_clicked VARCHAR(40),
  source_page VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES owners(id),
  type VARCHAR(40) NOT NULL,
  product_id UUID REFERENCES catalog_items(id),
  lead_id UUID REFERENCES leads(id),
  title VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_catalog_slug ON catalog_items(slug);
CREATE INDEX IF NOT EXISTS idx_catalog_category ON catalog_items(category_id, item_type, featured, pinned, is_active);
CREATE INDEX IF NOT EXISTS idx_leads_item_status ON leads(selected_catalog_item_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_item_event ON analytics_events(viewed_catalog_item_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_owner ON notifications(owner_id, is_read, created_at DESC);
