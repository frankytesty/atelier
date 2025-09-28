-- Kategorien einfügen
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('Einladungen', 'invitations', 'Elegante Hochzeitseinladungen und Save-the-Dates', 1),
('Tischdekorationen', 'table-decorations', 'Exquisite Tischdekorationen für den perfekten Empfang', 2),
('Zeremonie', 'ceremony', 'Dekorationen für die Trauzeremonie', 3),
('Papeterie', 'stationery', 'Hochzeitspapeterie und Drucksachen', 4),
('Beleuchtung', 'lighting', 'Stimmungsvolle Beleuchtung für jeden Anlass', 5),
('Blumenarrangements', 'florals', 'Kunstvolle Blumenarrangements und Gestecke', 6);

-- Beispielprodukte einfügen
INSERT INTO public.products (name, slug, description, short_description, base_price, category_id, images, materials, colors, personalization_options, is_featured) VALUES
(
  'Elegante Goldfolie Einladung',
  'elegant-gold-foil-invitation',
  'Luxuriöse Hochzeitseinladung mit echter Goldfolie und handgeschöpftem Papier. Jede Einladung wird individuell mit Ihren Namen und Hochzeitsdaten personalisiert.',
  'Luxuriöse Einladung mit Goldfolie',
  15.50,
  (SELECT id FROM public.categories WHERE slug = 'invitations'),
  ARRAY['/placeholder.svg?height=400&width=300'],
  ARRAY['Handgeschöpftes Papier', 'Goldfolie', 'Seidenpapier'],
  ARRAY['Ivory', 'Champagner', 'Blush', 'Sage'],
  '{"text_personalization": true, "font_options": ["Playfair Display", "Cormorant", "Montserrat"], "envelope_colors": ["Ivory", "Gold", "Sage"], "wax_seal": true}',
  true
),
(
  'Kristall Kerzenhalter Set',
  'crystal-candle-holder-set',
  'Handgeschliffene Kristall-Kerzenhalter in verschiedenen Höhen. Perfekt für romantische Tischdekorationen mit warmem Kerzenschein.',
  'Handgeschliffene Kristall-Kerzenhalter',
  89.00,
  (SELECT id FROM public.categories WHERE slug = 'table-decorations'),
  ARRAY['/placeholder.svg?height=400&width=300'],
  ARRAY['Bleikristall', 'Messing'],
  ARRAY['Klar', 'Champagner', 'Rauchgrau'],
  '{"engraving": true, "height_options": ["10cm", "15cm", "20cm"], "quantity_sets": [3, 5, 7]}',
  true
),
(
  'Vintage Spitze Tischläufer',
  'vintage-lace-table-runner',
  'Handgefertigter Tischläufer aus französischer Vintage-Spitze. Verleiht jeder Tafel einen Hauch von Romantik und Eleganz.',
  'Handgefertigter Vintage-Spitze Tischläufer',
  45.00,
  (SELECT id FROM public.categories WHERE slug = 'table-decorations'),
  ARRAY['/placeholder.svg?height=400&width=300'],
  ARRAY['Französische Spitze', 'Leinen', 'Seide'],
  ARRAY['Ivory', 'Champagner', 'Antik-Weiß'],
  '{"length_options": ["2m", "3m", "4m"], "edge_finish": ["Scalloped", "Straight"], "custom_length": true}',
  false
),
(
  'Personalisierte Menükarten',
  'personalized-menu-cards',
  'Elegante Menükarten mit individueller Kalligrafie und Ihrem persönlichen Design. Gedruckt auf hochwertigem Papier.',
  'Elegante personalisierte Menükarten',
  8.50,
  (SELECT id FROM public.categories WHERE slug = 'stationery'),
  ARRAY['/placeholder.svg?height=400&width=300'],
  ARRAY['Baumwollpapier', 'Goldfolie', 'Transparentpapier'],
  ARRAY['Ivory', 'Weiß', 'Champagner', 'Sage'],
  '{"menu_text": true, "calligraphy_style": ["Modern", "Classic", "Rustic"], "foil_accents": true, "custom_logo": true}',
  true
);

-- Produktvarianten einfügen
INSERT INTO public.product_variants (product_id, name, sku, price, color, size, additional_options) VALUES
(
  (SELECT id FROM public.products WHERE slug = 'elegant-gold-foil-invitation'),
  'Ivory mit Gold',
  'EGI-IV-STD',
  15.50,
  'Ivory',
  'Standard',
  '{"envelope_included": true, "wax_seal_color": "gold"}'
),
(
  (SELECT id FROM public.products WHERE slug = 'elegant-gold-foil-invitation'),
  'Champagner mit Gold',
  'EGI-CH-STD',
  15.50,
  'Champagner',
  'Standard',
  '{"envelope_included": true, "wax_seal_color": "champagne"}'
),
(
  (SELECT id FROM public.products WHERE slug = 'crystal-candle-holder-set'),
  '3er Set - Klar',
  'CCH-CL-3SET',
  89.00,
  'Klar',
  '3er Set',
  '{"heights": ["10cm", "15cm", "20cm"], "gift_box": true}'
),
(
  (SELECT id FROM public.products WHERE slug = 'crystal-candle-holder-set'),
  '5er Set - Klar',
  'CCH-CL-5SET',
  145.00,
  'Klar',
  '5er Set',
  '{"heights": ["8cm", "12cm", "16cm", "20cm", "24cm"], "gift_box": true}'
);
