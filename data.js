/* ============================================================
   data.js: Danh mục lựa chọn + bảng mapping vật liệu/phong cách
   Mỗi mục có:
     - value : khoá nội bộ
     - en    : cụm mô tả tiếng Anh dùng để GHÉP VÀO PROMPT
               (luôn tiếng Anh vì AI tạo ảnh hiểu tiếng Anh tốt nhất,
               bất kể giao diện đang ở ngôn ngữ nào)
     - label : tên hiển thị trên UI, dịch theo 7 ngôn ngữ
   ============================================================ */

// ---------- 1. LOẠI HÌNH KINH DOANH ----------
const BUSINESS_TYPES = [
  { value: "bakery", en: "bakery storefront", label: { en: "Bakery", vi: "Tiệm bánh", ar: "مخبز", zh: "面包店", fr: "Boulangerie", ru: "Пекарня", es: "Panadería" } },
  { value: "bank", en: "bank branch storefront", label: { en: "Bank Branch", vi: "Chi nhánh ngân hàng", ar: "فرع بنك", zh: "银行网点", fr: "Agence bancaire", ru: "Отделение банка", es: "Sucursal bancaria" } },
  { value: "bar-pub", en: "bar / pub storefront", label: { en: "Bar / Pub", vi: "Quán bar / pub", ar: "حانة / بار", zh: "酒吧", fr: "Bar / Pub", ru: "Бар / паб", es: "Bar / Pub" } },
  { value: "barbershop", en: "barbershop storefront", label: { en: "Barbershop", vi: "Tiệm cắt tóc nam", ar: "صالون حلاقة رجالي", zh: "理发店", fr: "Salon de barbier", ru: "Барбершоп", es: "Barbería" } },
  { value: "bookstore", en: "bookstore storefront", label: { en: "Bookstore", vi: "Nhà sách", ar: "مكتبة لبيع الكتب", zh: "书店", fr: "Librairie", ru: "Книжный магазин", es: "Librería" } },
  { value: "bubble-tea", en: "bubble tea shop storefront", label: { en: "Bubble Tea Shop", vi: "Quán trà sữa", ar: "محل مشروبات الفقاعات", zh: "奶茶店", fr: "Salon de bubble tea", ru: "Магазин бабл-ти", es: "Tienda de té de burbujas" } },
  { value: "car-dealership", en: "car dealership showroom storefront", label: { en: "Car Dealership", vi: "Đại lý ô tô", ar: "معرض سيارات", zh: "汽车经销商", fr: "Concession automobile", ru: "Автосалон", es: "Concesionario de autos" } },
  { value: "car-wash", en: "car wash storefront", label: { en: "Car Wash", vi: "Tiệm rửa xe", ar: "مغسلة سيارات", zh: "洗车店", fr: "Station de lavage auto", ru: "Автомойка", es: "Autolavado" } },
  { value: "clothing-store", en: "clothing / fashion store storefront", label: { en: "Clothing Store", vi: "Cửa hàng thời trang", ar: "محل ملابس", zh: "服装店", fr: "Boutique de vêtements", ru: "Магазин одежды", es: "Tienda de ropa" } },
  { value: "coffee-shop", en: "coffee shop storefront", label: { en: "Coffee Shop", vi: "Quán cafe", ar: "مقهى", zh: "咖啡店", fr: "Café", ru: "Кофейня", es: "Cafetería" } },
  { value: "convenience-store", en: "convenience store storefront", label: { en: "Convenience Store", vi: "Cửa hàng tiện lợi", ar: "متجر صغير", zh: "便利店", fr: "Supérette", ru: "Магазин у дома", es: "Tienda de conveniencia" } },
  { value: "dental-clinic", en: "dental clinic storefront", label: { en: "Dental Clinic", vi: "Phòng khám nha khoa", ar: "عيادة أسنان", zh: "牙科诊所", fr: "Cabinet dentaire", ru: "Стоматология", es: "Clínica dental" } },
  { value: "electronics-store", en: "electronics store storefront", label: { en: "Electronics Store", vi: "Cửa hàng điện tử", ar: "متجر إلكترونيات", zh: "电子产品店", fr: "Magasin d'électronique", ru: "Магазин электроники", es: "Tienda de electrónica" } },
  { value: "flower-shop", en: "flower shop storefront", label: { en: "Flower Shop", vi: "Cửa hàng hoa", ar: "محل زهور", zh: "花店", fr: "Fleuriste", ru: "Цветочный магазин", es: "Floristería" } },
  { value: "furniture-store", en: "furniture store storefront", label: { en: "Furniture Store", vi: "Cửa hàng nội thất", ar: "متجر أثاث", zh: "家具店", fr: "Magasin de meubles", ru: "Мебельный магазин", es: "Tienda de muebles" } },
  { value: "gym-fitness", en: "gym / fitness center storefront", label: { en: "Gym / Fitness Center", vi: "Phòng gym / fitness", ar: "نادي رياضي", zh: "健身房", fr: "Salle de sport", ru: "Фитнес-центр", es: "Gimnasio" } },
  { value: "hair-salon", en: "hair salon storefront", label: { en: "Hair Salon", vi: "Tiệm tóc / salon", ar: "صالون تصفيف شعر", zh: "美发沙龙", fr: "Salon de coiffure", ru: "Парикмахерская", es: "Salón de belleza" } },
  { value: "hardware-store", en: "hardware store storefront", label: { en: "Hardware Store", vi: "Cửa hàng vật liệu xây dựng", ar: "محل مواد بناء", zh: "五金店", fr: "Quincaillerie", ru: "Хозяйственный магазин", es: "Ferretería" } },
  { value: "hotel", en: "hotel entrance facade", label: { en: "Hotel", vi: "Khách sạn", ar: "فندق", zh: "酒店", fr: "Hôtel", ru: "Отель", es: "Hotel" } },
  { value: "ice-cream-shop", en: "ice cream shop storefront", label: { en: "Ice Cream Shop", vi: "Cửa hàng kem", ar: "محل آيس كريم", zh: "冰淇淋店", fr: "Glacier", ru: "Магазин мороженого", es: "Heladería" } },
  { value: "jewelry-store", en: "jewelry store storefront", label: { en: "Jewelry Store", vi: "Cửa hàng trang sức", ar: "محل مجوهرات", zh: "珠宝店", fr: "Bijouterie", ru: "Ювелирный магазин", es: "Joyería" } },
  { value: "karaoke-lounge", en: "karaoke lounge storefront", label: { en: "Karaoke Lounge", vi: "Quán karaoke", ar: "صالة كاريوكي", zh: "KTV", fr: "Bar karaoké", ru: "Караоке-бар", es: "Karaoke" } },
  { value: "laundry", en: "laundry service storefront", label: { en: "Laundry Service", vi: "Tiệm giặt là", ar: "مغسلة ملابس", zh: "洗衣店", fr: "Blanchisserie", ru: "Прачечная", es: "Lavandería" } },
  { value: "law-firm", en: "law firm office facade", label: { en: "Law Firm", vi: "Văn phòng luật", ar: "مكتب محاماة", zh: "律师事务所", fr: "Cabinet d'avocats", ru: "Юридическая фирма", es: "Bufete de abogados" } },
  { value: "massage-spa", en: "massage / spa storefront", label: { en: "Massage / Spa", vi: "Spa / massage", ar: "منتجع سبا / تدليك", zh: "按摩水疗馆", fr: "Spa / massage", ru: "Спа / массаж", es: "Spa / masajes" } },
  { value: "medical-clinic", en: "medical clinic storefront", label: { en: "Medical Clinic", vi: "Phòng khám y tế", ar: "عيادة طبية", zh: "医疗诊所", fr: "Clinique médicale", ru: "Медицинская клиника", es: "Clínica médica" } },
  { value: "nail-salon", en: "nail salon storefront", label: { en: "Nail Salon", vi: "Tiệm nail", ar: "صالون أظافر", zh: "美甲店", fr: "Salon de manucure", ru: "Ногтевой салон", es: "Salón de uñas" } },
  { value: "noodle-shop", en: "noodle shop (pho/ramen style) storefront", label: { en: "Noodle Shop", vi: "Quán phở / mì", ar: "محل نودلز", zh: "面馆", fr: "Restaurant de nouilles", ru: "Лапшичная", es: "Fideos / pho" } },
  { value: "optical-store", en: "optical / eyewear store storefront", label: { en: "Optical Store", vi: "Cửa hàng kính mắt", ar: "محل نظارات", zh: "眼镜店", fr: "Opticien", ru: "Оптика", es: "Óptica" } },
  { value: "pet-shop", en: "pet shop storefront", label: { en: "Pet Shop", vi: "Cửa hàng thú cưng", ar: "متجر حيوانات أليفة", zh: "宠物店", fr: "Animalerie", ru: "Зоомагазин", es: "Tienda de mascotas" } },
  { value: "pharmacy", en: "pharmacy storefront", label: { en: "Pharmacy", vi: "Nhà thuốc", ar: "صيدلية", zh: "药店", fr: "Pharmacie", ru: "Аптека", es: "Farmacia" } },
  { value: "phone-laptop-store", en: "phone and laptop store storefront", label: { en: "Phone & Laptop Store", vi: "Cửa hàng điện thoại, laptop", ar: "متجر هواتف وأجهزة كمبيوتر", zh: "手机电脑店", fr: "Magasin de téléphones/ordinateurs", ru: "Магазин телефонов и ноутбуков", es: "Tienda de móviles y laptops" } },
  { value: "photo-studio", en: "photography studio storefront", label: { en: "Photography Studio", vi: "Studio chụp ảnh", ar: "استوديو تصوير", zh: "摄影工作室", fr: "Studio photo", ru: "Фотостудия", es: "Estudio fotográfico" } },
  { value: "real-estate", en: "real estate agency office facade", label: { en: "Real Estate Agency", vi: "Văn phòng bất động sản", ar: "مكتب عقارات", zh: "房地产中介", fr: "Agence immobilière", ru: "Агентство недвижимости", es: "Agencia inmobiliaria" } },
  { value: "restaurant", en: "restaurant storefront", label: { en: "Restaurant", vi: "Nhà hàng", ar: "مطعم", zh: "餐厅", fr: "Restaurant", ru: "Ресторан", es: "Restaurante" } },
  { value: "retail-shop", en: "general retail shop storefront", label: { en: "Retail Shop (General)", vi: "Cửa hàng bán lẻ (chung)", ar: "متجر تجزئة عام", zh: "零售店（通用）", fr: "Commerce de détail (général)", ru: "Розничный магазин (общий)", es: "Tienda minorista (general)" } },
  { value: "supermarket", en: "supermarket storefront", label: { en: "Supermarket", vi: "Siêu thị", ar: "سوبر ماركت", zh: "超市", fr: "Supermarché", ru: "Супермаркет", es: "Supermercado" } },
  { value: "tailor-shop", en: "tailor shop storefront", label: { en: "Tailor Shop", vi: "Tiệm may đo", ar: "محل خياطة", zh: "裁缝店", fr: "Atelier de couture", ru: "Ателье", es: "Sastrería" } },
  { value: "tattoo-studio", en: "tattoo studio storefront", label: { en: "Tattoo Studio", vi: "Tiệm xăm hình", ar: "استوديو وشم", zh: "纹身店", fr: "Studio de tatouage", ru: "Тату-салон", es: "Estudio de tatuajes" } },
  { value: "tea-house", en: "tea house storefront", label: { en: "Tea House", vi: "Trà quán", ar: "بيت شاي", zh: "茶馆", fr: "Maison de thé", ru: "Чайный дом", es: "Casa de té" } },
  { value: "travel-agency", en: "travel agency office facade", label: { en: "Travel Agency", vi: "Công ty du lịch", ar: "وكالة سفر", zh: "旅行社", fr: "Agence de voyage", ru: "Туристическое агентство", es: "Agencia de viajes" } },
  { value: "veterinary-clinic", en: "veterinary clinic storefront", label: { en: "Veterinary Clinic", vi: "Phòng khám thú y", ar: "عيادة بيطرية", zh: "宠物医院", fr: "Clinique vétérinaire", ru: "Ветеринарная клиника", es: "Clínica veterinaria" } },
  { value: "wine-shop", en: "wine and spirits shop storefront", label: { en: "Wine & Spirits Shop", vi: "Cửa hàng rượu", ar: "محل بيع الخمور", zh: "酒类专卖店", fr: "Caviste", ru: "Винный магазин", es: "Tienda de vinos y licores" } },
  { value: "other-business", en: "small shop storefront", label: { en: "Other", vi: "Khác", ar: "أخرى", zh: "其他", fr: "Autre", ru: "Другое", es: "Otro" } },
];

// ---------- 2. LOẠI BIỂN ----------
const SIGN_TYPES = [
  { value: "aframe-sandwich", en: "A-frame sandwich board sign standing on the sidewalk", label: { en: "A-Frame Sandwich Board", vi: "Biển chân chữ A (vỉa hè)", ar: "لافتة على شكل حرف A على الرصيف", zh: "A字形立牌", fr: "Panneau chevalet trottoir", ru: "Штендер A-образный", es: "Letrero tipo caballete" } },
  { value: "alu", en: "aluminum composite panel (ACP) signboard, clean matte finish, precision-cut edges", label: { en: "Aluminum Composite Panel (Alu)", vi: "Biển Alu", ar: "لافتة ألواح ألمنيوم مركبة", zh: "铝塑板招牌", fr: "Panneau composite aluminium", ru: "Вывеска из алюкомпозита", es: "Panel compuesto de aluminio" } },
  { value: "awning-sign", en: "printed fabric awning sign above the entrance", label: { en: "Awning Sign", vi: "Biển mái hiên bạt", ar: "لافتة مظلة قماشية", zh: "遮阳篷招牌", fr: "Enseigne sur auvent", ru: "Вывеска на маркизе", es: "Letrero en toldo" } },
  { value: "billboard", en: "large outdoor billboard sign", label: { en: "Billboard", vi: "Biển quảng cáo ngoài trời cỡ lớn", ar: "لوحة إعلانية كبيرة", zh: "户外广告牌", fr: "Panneau publicitaire", ru: "Билборд", es: "Valla publicitaria" } },
  { value: "blade-sign", en: "projecting blade sign mounted perpendicular to the wall", label: { en: "Blade / Projecting Sign", vi: "Biển vẫy nhô vuông góc", ar: "لافتة بارزة عمودية على الجدار", zh: "垂直突出招牌", fr: "Enseigne perpendiculaire", ru: "Консольная вывеска", es: "Letrero perpendicular" } },
  { value: "bien-vay", en: "perpendicular hanging flag sign mounted on a wall bracket, double-sided print", label: { en: "Hanging Flag Sign (Biển Vẫy)", vi: "Biển vẫy quảng cáo", ar: "لافتة معلقة على قوس جداري", zh: "悬挂式旗形招牌", fr: "Enseigne drapeau suspendue", ru: "Настенная флаговая вывеска", es: "Letrero bandera colgante" } },
  { value: "chu-noi", en: "3D raised acrylic and stainless-steel letters mounted on the facade, subtle drop shadow, backlit edge glow", label: { en: "3D Raised Letters", vi: "Biển chữ nổi", ar: "حروف بارزة ثلاثية الأبعاد", zh: "立体发光字", fr: "Lettres 3D en relief", ru: "Объёмные буквы", es: "Letras 3D en relieve" } },
  { value: "digital-led-display", en: "digital full-color LED display screen sign", label: { en: "Digital LED Display", vi: "Màn hình LED quảng cáo", ar: "شاشة عرض LED رقمية", zh: "LED电子显示屏", fr: "Écran LED numérique", ru: "Цифровой LED-экран", es: "Pantalla LED digital" } },
  { value: "directory-sign", en: "wayfinding / directory sign panel", label: { en: "Directory / Wayfinding Sign", vi: "Biển chỉ dẫn", ar: "لافتة إرشادية / دليل", zh: "导视指示牌", fr: "Panneau de signalétique", ru: "Указательная вывеска", es: "Letrero de directorio" } },
  { value: "engraved-plaque", en: "engraved stone or metal plaque sign", label: { en: "Engraved Plaque", vi: "Biển khắc đá / kim loại", ar: "لوحة منقوشة حجرية أو معدنية", zh: "石材/金属雕刻铭牌", fr: "Plaque gravée", ru: "Гравированная табличка", es: "Placa grabada" } },
  { value: "hop-den", en: "illuminated lightbox sign, diffused even LED glow through the acrylic face, aluminum frame", label: { en: "Lightbox Sign", vi: "Biển hộp đèn", ar: "لافتة صندوق إضاءة", zh: "灯箱招牌", fr: "Enseigne caisson lumineux", ru: "Световой короб", es: "Letrero de caja de luz" } },
  { value: "chu-led", en: "LED channel letters with halo backlight glow, night storefront photography", label: { en: "LED Channel Letters", vi: "Chữ nổi đèn LED", ar: "حروف قناة LED مضيئة", zh: "LED槽字发光招牌", fr: "Lettres boîtières LED", ru: "LED объёмные буквы", es: "Letras canal LED" } },
  { value: "menu-board", en: "illuminated menu board sign", label: { en: "Menu Board", vi: "Biển thực đơn", ar: "لوحة قائمة الطعام المضيئة", zh: "菜单灯箱", fr: "Panneau menu lumineux", ru: "Меню-борд", es: "Letrero de menú" } },
  { value: "monument-sign", en: "ground-mounted monument sign at the entrance", label: { en: "Monument Sign", vi: "Biển trụ đứng (monument)", ar: "لافتة تذكارية أرضية", zh: "落地式标识牌", fr: "Enseigne monument au sol", ru: "Стела при входе", es: "Letrero monumento" } },
  { value: "neon-sign", en: "custom neon light sign with glowing glass tube letters", label: { en: "Neon Sign", vi: "Biển đèn neon", ar: "لافتة نيون مضيئة", zh: "霓虹灯招牌", fr: "Enseigne néon", ru: "Неоновая вывеска", es: "Letrero de neón" } },
  { value: "in-bat", en: "printed vinyl flex banner sign, vivid full-color print, tensioned frame", label: { en: "Printed Vinyl Banner", vi: "Biển in bạt / in decal", ar: "لافتة فينيل مطبوعة", zh: "写真喷绘布招牌", fr: "Bâche publicitaire imprimée", ru: "Виниловый баннер", es: "Lona de vinilo impresa" } },
  { value: "pylon-sign", en: "tall pylon sign near the road", label: { en: "Pylon Sign", vi: "Biển trụ cao ngoài đường", ar: "لافتة عمود مرتفعة", zh: "路边立柱式招牌", fr: "Totem enseigne", ru: "Пилонная вывеска", es: "Letrero pilón" } },
  { value: "vehicle-wrap", en: "vehicle wrap advertising graphics", label: { en: "Vehicle Wrap", vi: "Decal quảng cáo xe", ar: "غلاف إعلاني للمركبة", zh: "车身广告贴膜", fr: "Covering publicitaire véhicule", ru: "Реклама на транспорте", es: "Rotulación vehicular" } },
  { value: "window-vinyl", en: "window vinyl lettering / storefront glass graphics", label: { en: "Window Decal / Vinyl Lettering", vi: "Decal chữ dán kính", ar: "ملصقات فينيل على الزجاج", zh: "橱窗贴字", fr: "Lettrage vitrine adhésif", ru: "Виниловая наклейка на окно", es: "Vinilo para vitrina" } },
  { value: "wooden-carved", en: "hand-carved wooden sign with painted or gilded lettering", label: { en: "Wooden Carved Sign", vi: "Biển gỗ chạm khắc", ar: "لافتة خشبية منحوتة يدويًا", zh: "木质雕刻招牌", fr: "Enseigne en bois sculpté", ru: "Резная деревянная вывеска", es: "Letrero de madera tallada" } },
];

// ---------- 3. PHONG CÁCH ----------
const STYLES = [
  { value: "american-diner", en: "American diner retro style", label: { en: "American Diner", vi: "Kiểu quán ăn Mỹ cổ điển", ar: "أسلوب المطعم الأمريكي الكلاسيكي", zh: "美式复古餐厅风格", fr: "Style diner américain", ru: "Американский ретро-дайнер", es: "Estilo diner americano" } },
  { value: "art-deco", en: "Art Deco style, geometric ornamentation, metallic accents", label: { en: "Art Deco", vi: "Art Deco", ar: "آرت ديكو", zh: "装饰艺术风格", fr: "Art déco", ru: "Ар-деко", es: "Art Déco" } },
  { value: "bauhaus", en: "Bauhaus style, geometric forms, primary colors, functional design", label: { en: "Bauhaus", vi: "Bauhaus", ar: "باوهاوس", zh: "包豪斯风格", fr: "Bauhaus", ru: "Баухаус", es: "Bauhaus" } },
  { value: "bohemian", en: "bohemian eclectic style, textured and relaxed", label: { en: "Bohemian", vi: "Bohemian phóng khoáng", ar: "أسلوب بوهيمي", zh: "波西米亚风格", fr: "Style bohème", ru: "Богемный стиль", es: "Estilo bohemio" } },
  { value: "coastal-nautical", en: "coastal nautical style, light woods and blue accents", label: { en: "Coastal / Nautical", vi: "Phong cách biển / hàng hải", ar: "أسلوب ساحلي بحري", zh: "海岸航海风格", fr: "Style côtier / marin", ru: "Морской стиль", es: "Estilo costero / náutico" } },
  { value: "classic-vietnamese", en: "classic Vietnamese shopfront style, traditional details", label: { en: "Classic Vietnamese", vi: "Cổ điển Việt Nam", ar: "الطراز الفيتنامي الكلاسيكي", zh: "越南传统风格", fr: "Style vietnamien classique", ru: "Классический вьетнамский стиль", es: "Estilo vietnamita clásico" } },
  { value: "contemporary", en: "contemporary style, sleek and current", label: { en: "Contemporary", vi: "Đương đại", ar: "أسلوب معاصر", zh: "当代风格", fr: "Style contemporain", ru: "Современный стиль", es: "Estilo contemporáneo" } },
  { value: "cyberpunk", en: "cyberpunk style, glowing neon accents, futuristic urban mood", label: { en: "Cyberpunk", vi: "Cyberpunk", ar: "سايبربانك", zh: "赛博朋克风格", fr: "Style cyberpunk", ru: "Киберпанк", es: "Estilo cyberpunk" } },
  { value: "eclectic", en: "eclectic mixed style, playful combination of elements", label: { en: "Eclectic", vi: "Kết hợp đa phong cách", ar: "أسلوب انتقائي متنوع", zh: "折衷混搭风格", fr: "Style éclectique", ru: "Эклектичный стиль", es: "Estilo ecléctico" } },
  { value: "farmhouse-rustic", en: "farmhouse rustic style, reclaimed wood and warm textures", label: { en: "Farmhouse Rustic", vi: "Mộc mạc kiểu nông trại", ar: "أسلوب ريفي دافئ", zh: "乡村农舍风格", fr: "Style rustique campagnard", ru: "Деревенский стиль", es: "Estilo rústico de granja" } },
  { value: "futuristic", en: "futuristic style, sleek metallic surfaces, glowing accents", label: { en: "Futuristic", vi: "Tương lai / Futuristic", ar: "أسلوب مستقبلي", zh: "未来风格", fr: "Style futuriste", ru: "Футуристический стиль", es: "Estilo futurista" } },
  { value: "glassmorphism", en: "glassmorphism style, frosted translucent glass panels", label: { en: "Glassmorphism", vi: "Glassmorphism (kính mờ)", ar: "أسلوب زجاجي شفاف", zh: "玻璃拟态风格", fr: "Style verre dépoli (glassmorphism)", ru: "Стеклянный стиль (glassmorphism)", es: "Estilo glassmorphism" } },
  { value: "gothic", en: "gothic style, dark ornate detailing", label: { en: "Gothic", vi: "Gothic", ar: "قوطي", zh: "哥特风格", fr: "Style gothique", ru: "Готический стиль", es: "Estilo gótico" } },
  { value: "industrial", en: "industrial style, exposed metal and concrete textures", label: { en: "Industrial", vi: "Industrial (công nghiệp)", ar: "أسلوب صناعي", zh: "工业风格", fr: "Style industriel", ru: "Индустриальный стиль", es: "Estilo industrial" } },
  { value: "japanese-minimal", en: "minimal Japanese style, clean lines, natural materials", label: { en: "Japanese Minimal", vi: "Tối giản Nhật", ar: "الطراز الياباني البسيط", zh: "日式极简风格", fr: "Minimalisme japonais", ru: "Японский минимализм", es: "Minimalismo japonés" } },
  { value: "korean-minimal", en: "Korean minimal style, soft neutral tones, clean typography", label: { en: "Korean Minimal", vi: "Tối giản Hàn Quốc", ar: "الطراز الكوري البسيط", zh: "韩式极简风格", fr: "Minimalisme coréen", ru: "Корейский минимализм", es: "Minimalismo coreano" } },
  { value: "luxury", en: "luxury upscale style, premium materials, elegant proportions", label: { en: "Luxury", vi: "Sang trọng / Luxury", ar: "أسلوب فاخر", zh: "奢华风格", fr: "Style luxe", ru: "Роскошный стиль", es: "Estilo lujoso" } },
  { value: "mediterranean", en: "Mediterranean style, warm stucco and terracotta details", label: { en: "Mediterranean", vi: "Địa Trung Hải", ar: "الطراز المتوسطي", zh: "地中海风格", fr: "Style méditerranéen", ru: "Средиземноморский стиль", es: "Estilo mediterráneo" } },
  { value: "mid-century-modern", en: "mid-century modern style, warm wood and clean geometry", label: { en: "Mid-Century Modern", vi: "Mid-Century Modern", ar: "الحداثة في منتصف القرن", zh: "中世纪现代风格", fr: "Style mid-century moderne", ru: "Стиль середины века", es: "Estilo mid-century moderno" } },
  { value: "toi-gian", en: "modern minimalist style, uncluttered composition", label: { en: "Modern Minimalist", vi: "Tối giản hiện đại", ar: "الحداثة البسيطة", zh: "现代极简风格", fr: "Minimalisme moderne", ru: "Современный минимализм", es: "Minimalismo moderno" } },
  { value: "neon", en: "modern neon-accented style, bold contemporary look", label: { en: "Modern Neon", vi: "Neon hiện đại", ar: "أسلوب النيون الحديث", zh: "现代霓虹风格", fr: "Style néon moderne", ru: "Современный неоновый стиль", es: "Estilo neón moderno" } },
  { value: "nordic-scandinavian", en: "Nordic Scandinavian style, light wood, muted tones", label: { en: "Nordic / Scandinavian", vi: "Bắc Âu / Scandinavian", ar: "الطراز الاسكندنافي", zh: "北欧斯堪的纳维亚风格", fr: "Style scandinave", ru: "Скандинавский стиль", es: "Estilo nórdico / escandinavo" } },
  { value: "parisian-chic", en: "Parisian chic style, elegant black and gold details", label: { en: "Parisian Chic", vi: "Sang trọng kiểu Paris", ar: "الأسلوب الباريسي الأنيق", zh: "巴黎优雅风格", fr: "Style chic parisien", ru: "Парижский шик", es: "Estilo chic parisino" } },
  { value: "steampunk", en: "steampunk style, brass fittings and vintage machinery details", label: { en: "Steampunk", vi: "Steampunk", ar: "ستيم بانك", zh: "蒸汽朋克风格", fr: "Style steampunk", ru: "Стимпанк", es: "Estilo steampunk" } },
  { value: "tropical", en: "tropical style, lush greenery and natural rattan textures", label: { en: "Tropical", vi: "Nhiệt đới", ar: "أسلوب استوائي", zh: "热带风格", fr: "Style tropical", ru: "Тропический стиль", es: "Estilo tropical" } },
  { value: "urban-street", en: "urban street art style, bold graffiti-inspired graphics", label: { en: "Urban Street", vi: "Đường phố / Graffiti", ar: "أسلوب الشارع الحضري", zh: "都市街头风格", fr: "Style urbain street art", ru: "Уличный стиль (граффити)", es: "Estilo urbano callejero" } },
  { value: "victorian", en: "Victorian style, ornate period detailing", label: { en: "Victorian", vi: "Victorian", ar: "الطراز الفيكتوري", zh: "维多利亚风格", fr: "Style victorien", ru: "Викторианский стиль", es: "Estilo victoriano" } },
  { value: "vintage-retro", en: "vintage retro style, warm nostalgic details", label: { en: "Vintage / Retro", vi: "Vintage / Retro", ar: "أسلوب عتيق / ريترو", zh: "复古风格", fr: "Style vintage / rétro", ru: "Винтажный / ретро стиль", es: "Estilo vintage / retro" } },
  { value: "zen-wabisabi", en: "Zen wabi-sabi style, understated natural imperfection", label: { en: "Zen / Wabi-Sabi", vi: "Zen / Wabi-Sabi", ar: "أسلوب زن / وابي-سابي", zh: "禅意 / 侘寂风格", fr: "Style zen / wabi-sabi", ru: "Дзен / ваби-саби", es: "Estilo zen / wabi-sabi" } },
];

// ---------- 4. TÔNG MÀU ----------
const COLOR_TONES = [
  { value: "autumn-earth", en: "autumn earth tone palette", label: { en: "Autumn Earth Tones", vi: "Tông đất mùa thu", ar: "درجات ألوان خريفية ترابية", zh: "秋季大地色调", fr: "Tons terreux d'automne", ru: "Осенние земляные тона", es: "Tonos terrosos otoñales" } },
  { value: "beige-brown", en: "beige and brown palette", label: { en: "Beige & Brown", vi: "Be và nâu", ar: "بيج وبني", zh: "米色与棕色", fr: "Beige et marron", ru: "Бежевый и коричневый", es: "Beige y marrón" } },
  { value: "black-gold", en: "black and gold palette", label: { en: "Black & Gold", vi: "Đen và vàng gold", ar: "أسود وذهبي", zh: "黑金配色", fr: "Noir et or", ru: "Чёрный и золотой", es: "Negro y dorado" } },
  { value: "blue-white", en: "blue and white palette", label: { en: "Blue & White", vi: "Xanh dương và trắng", ar: "أزرق وأبيض", zh: "蓝白配色", fr: "Bleu et blanc", ru: "Синий и белый", es: "Azul y blanco" } },
  { value: "burgundy-cream", en: "burgundy and cream palette", label: { en: "Burgundy & Cream", vi: "Đỏ burgundy và kem", ar: "عنابي وكريمي", zh: "酒红与米白", fr: "Bordeaux et crème", ru: "Бордовый и кремовый", es: "Burdeos y crema" } },
  { value: "charcoal-copper", en: "charcoal and copper palette", label: { en: "Charcoal & Copper", vi: "Xám than và đồng", ar: "رمادي فحمي ونحاسي", zh: "炭灰与铜色", fr: "Anthracite et cuivre", ru: "Угольный и медный", es: "Carbón y cobre" } },
  { value: "elegant-black", en: "elegant black palette with metallic accents", label: { en: "Elegant Black", vi: "Đen sang trọng", ar: "أسود أنيق", zh: "优雅黑色系", fr: "Noir élégant", ru: "Элегантный чёрный", es: "Negro elegante" } },
  { value: "emerald-green", en: "emerald green palette", label: { en: "Emerald Green", vi: "Xanh ngọc lục bảo", ar: "أخضر زمردي", zh: "祖母绿色调", fr: "Vert émeraude", ru: "Изумрудно-зелёный", es: "Verde esmeralda" } },
  { value: "forest-green", en: "forest green palette", label: { en: "Forest Green", vi: "Xanh rêu rừng", ar: "أخضر غابي", zh: "森林绿", fr: "Vert forêt", ru: "Тёмно-зелёный (лесной)", es: "Verde bosque" } },
  { value: "jewel-tones", en: "rich jewel tone palette", label: { en: "Jewel Tones", vi: "Tông màu đá quý", ar: "درجات ألوان الأحجار الكريمة", zh: "宝石色调", fr: "Tons pierres précieuses", ru: "Насыщенные драгоценные тона", es: "Tonos joya" } },
  { value: "monochrome", en: "monochrome grayscale palette", label: { en: "Monochrome", vi: "Đơn sắc (trắng đen)", ar: "أحادي اللون", zh: "单色（黑白灰）", fr: "Monochrome", ru: "Монохромная гамма", es: "Monocromático" } },
  { value: "navy-gold", en: "navy blue and gold palette", label: { en: "Navy & Gold", vi: "Xanh navy và vàng gold", ar: "كحلي وذهبي", zh: "藏青与金色", fr: "Bleu marine et or", ru: "Тёмно-синий и золотой", es: "Azul marino y dorado" } },
  { value: "neon-multicolor", en: "neon multicolor palette", label: { en: "Neon Multicolor", vi: "Neon đa sắc", ar: "ألوان نيون متعددة", zh: "霓虹多彩配色", fr: "Multicolore néon", ru: "Неоновая многоцветная гамма", es: "Multicolor neón" } },
  { value: "ocean-blue", en: "ocean blue palette", label: { en: "Ocean Blue", vi: "Xanh đại dương", ar: "أزرق محيطي", zh: "海洋蓝", fr: "Bleu océan", ru: "Океанический синий", es: "Azul océano" } },
  { value: "pastel", en: "soft pastel color palette", label: { en: "Pastel", vi: "Pastel", ar: "ألوان الباستيل", zh: "马卡龙粉彩色", fr: "Pastel", ru: "Пастельная гамма", es: "Pastel" } },
  { value: "rose-gold", en: "rose gold palette", label: { en: "Rose Gold", vi: "Vàng hồng (rose gold)", ar: "ذهبي وردي", zh: "玫瑰金", fr: "Or rose", ru: "Розовое золото", es: "Oro rosa" } },
  { value: "sage-green", en: "sage green palette", label: { en: "Sage Green", vi: "Xanh lá xô thơm (sage)", ar: "أخضر مريمية", zh: "鼠尾草绿", fr: "Vert sauge", ru: "Шалфейно-зелёный", es: "Verde salvia" } },
  { value: "silver-white", en: "silver and white palette", label: { en: "Silver & White", vi: "Bạc và trắng", ar: "فضي وأبيض", zh: "银白配色", fr: "Argent et blanc", ru: "Серебристый и белый", es: "Plateado y blanco" } },
  { value: "sunset-gradient", en: "warm sunset gradient palette", label: { en: "Sunset Gradient", vi: "Gradient hoàng hôn", ar: "تدرج ألوان الغروب", zh: "日落渐变色", fr: "Dégradé coucher de soleil", ru: "Градиент заката", es: "Degradado atardecer" } },
  { value: "terracotta", en: "terracotta palette", label: { en: "Terracotta", vi: "Đất nung (terracotta)", ar: "تراكوتا", zh: "赤陶色", fr: "Terre cuite", ru: "Терракотовый", es: "Terracota" } },
  { value: "vibrant-bold", en: "bold vibrant eye-catching color palette", label: { en: "Vibrant / Bold", vi: "Rực rỡ / nổi bật", ar: "ألوان جريئة زاهية", zh: "鲜艳大胆配色", fr: "Vif et audacieux", ru: "Яркая насыщенная гамма", es: "Vibrante y audaz" } },
  { value: "warm-wood", en: "warm wood tone palette", label: { en: "Warm Wood", vi: "Gỗ ấm", ar: "درجات الخشب الدافئة", zh: "暖木色调", fr: "Bois chaud", ru: "Тёплые древесные тона", es: "Madera cálida" } },
  { value: "white-minimal", en: "clean white minimalist palette", label: { en: "White Minimal", vi: "Trắng tối giản", ar: "أبيض بسيط", zh: "极简白色", fr: "Blanc minimaliste", ru: "Минималистичный белый", es: "Blanco minimalista" } },
];

// ---------- 5. THỜI ĐIỂM ----------
const TIME_OF_DAY = [
  { value: "ngay", en: "daytime, natural sunlight", label: { en: "Daytime", vi: "Ban ngày", ar: "نهارًا", zh: "白天", fr: "Journée", ru: "Днём", es: "Día" } },
  { value: "u-am", en: "overcast cloudy day, soft diffused light", label: { en: "Overcast Day", vi: "Trời nhiều mây", ar: "يوم غائم", zh: "阴天", fr: "Journée nuageuse", ru: "Пасмурный день", es: "Día nublado" } },
  { value: "hoang-hon", en: "golden hour dusk lighting, sign lights just turning on", label: { en: "Golden Hour / Dusk", vi: "Hoàng hôn", ar: "وقت الغسق الذهبي", zh: "黄昏时刻", fr: "Heure dorée / crépuscule", ru: "Золотой час / сумерки", es: "Hora dorada / atardecer" } },
  { value: "dem", en: "night time, signage lights turned on, glowing", label: { en: "Night (Lights On)", vi: "Ban đêm (đèn sáng)", ar: "ليلاً (الإضاءة مُشغّلة)", zh: "夜晚（灯光亮起）", fr: "Nuit (enseigne allumée)", ru: "Ночь (вывеска светится)", es: "Noche (letrero encendido)" } },
];

// ---------- 6. GÓC NHÌN ----------
const ANGLES = [
  { value: "chinh-dien", en: "front-facing view, straight-on architectural photography", label: { en: "Front View", vi: "Chính diện", ar: "منظر أمامي مباشر", zh: "正面视角", fr: "Vue de face", ru: "Вид спереди", es: "Vista frontal" } },
  { value: "ba-phan-tu", en: "three-quarter angle view", label: { en: "Three-Quarter Angle", vi: "Góc 3/4", ar: "زاوية ثلاثة أرباع", zh: "四分之三角度", fr: "Vue trois quarts", ru: "Ракурс три четверти", es: "Ángulo de tres cuartos" } },
  { value: "can-canh", en: "close-up shot on the signboard lettering, shallow depth of field", label: { en: "Close-Up on Lettering", vi: "Cận cảnh chữ/biển", ar: "لقطة مقربة لحروف اللافتة", zh: "招牌文字特写", fr: "Gros plan sur les lettres", ru: "Крупный план букв", es: "Primer plano de las letras" } },
  { value: "flycam", en: "aerial drone view of the storefront", label: { en: "Aerial / Drone View", vi: "Góc flycam / trên cao", ar: "منظر جوي بطائرة درون", zh: "航拍视角", fr: "Vue aérienne (drone)", ru: "Вид с дрона (сверху)", es: "Vista aérea (dron)" } },
];

// ---------- 7. NỀN TẢNG AI TẠO ẢNH ----------
// format quy định cách ghép câu cho từng "họ" nền tảng
const PLATFORMS = [
  { value: "chatgpt", format: "sentence", label: { en: "ChatGPT / DALL·E", vi: "ChatGPT / DALL·E", ar: "ChatGPT / DALL·E", zh: "ChatGPT / DALL·E", fr: "ChatGPT / DALL·E", ru: "ChatGPT / DALL·E", es: "ChatGPT / DALL·E" } },
  { value: "gemini", format: "sentence", label: { en: "Google Gemini", vi: "Google Gemini", ar: "Google Gemini", zh: "Google Gemini", fr: "Google Gemini", ru: "Google Gemini", es: "Google Gemini" } },
  { value: "claude", format: "brief", label: { en: "Claude", vi: "Claude", ar: "Claude", zh: "Claude", fr: "Claude", ru: "Claude", es: "Claude" } },
  { value: "midjourney", format: "mj-params", label: { en: "Midjourney", vi: "Midjourney", ar: "Midjourney", zh: "Midjourney", fr: "Midjourney", ru: "Midjourney", es: "Midjourney" } },
  { value: "grok", format: "tags-simple", label: { en: "Grok Imagine", vi: "Grok Imagine", ar: "Grok Imagine", zh: "Grok Imagine", fr: "Grok Imagine", ru: "Grok Imagine", es: "Grok Imagine" } },
  { value: "copilot", format: "sentence", label: { en: "Microsoft Copilot Designer", vi: "Microsoft Copilot Designer", ar: "Microsoft Copilot Designer", zh: "Microsoft Copilot Designer", fr: "Microsoft Copilot Designer", ru: "Microsoft Copilot Designer", es: "Microsoft Copilot Designer" } },
  { value: "firefly", format: "structured", label: { en: "Adobe Firefly", vi: "Adobe Firefly", ar: "Adobe Firefly", zh: "Adobe Firefly", fr: "Adobe Firefly", ru: "Adobe Firefly", es: "Adobe Firefly" } },
  { value: "ideogram", format: "structured", label: { en: "Ideogram", vi: "Ideogram", ar: "Ideogram", zh: "Ideogram", fr: "Ideogram", ru: "Ideogram", es: "Ideogram" } },
  { value: "leonardo", format: "tags-detailed", label: { en: "Leonardo AI", vi: "Leonardo AI", ar: "Leonardo AI", zh: "Leonardo AI", fr: "Leonardo AI", ru: "Leonardo AI", es: "Leonardo AI" } },
  { value: "stablediffusion", format: "tags-detailed", label: { en: "Stable Diffusion", vi: "Stable Diffusion", ar: "Stable Diffusion", zh: "Stable Diffusion", fr: "Stable Diffusion", ru: "Stable Diffusion", es: "Stable Diffusion" } },
  { value: "flux", format: "tags-detailed", label: { en: "Flux", vi: "Flux", ar: "Flux", zh: "Flux", fr: "Flux", ru: "Flux", es: "Flux" } },
  { value: "canva", format: "sentence", label: { en: "Canva AI", vi: "Canva AI", ar: "Canva AI", zh: "Canva AI", fr: "Canva AI", ru: "Canva AI", es: "Canva AI" } },
];

const NEGATIVE_PROMPT_EN =
  "blurry, distorted text, unreadable letters, misspelled text, warped logo, watermark, low quality, extra letters, duplicate sign";

// ---------- 8. GỢI Ý TỰ ĐỘNG THEO LOẠI HÌNH KINH DOANH ----------
// Khi người dùng chọn "Business type", extension tự động chọn Sign type,
// Style, Color tone, Time of day (và Camera angle nếu không có ảnh thật)
// sao cho phù hợp nhất với ngành nghề đó. Người dùng vẫn có thể tự đổi
// lại bất kỳ trường nào sau khi đã tự động chọn.
//
// photoSignType: chỉ khai báo khi loại biển mặc định (signType) không phù
// hợp để "thêm vào ảnh thật phía trên lối vào" (ví dụ biển trụ, màn hình
// LED lớn) thì ở chế độ ảnh thật sẽ dùng loại biển thay thế này.
// Nếu không khai báo, chế độ ảnh thật dùng chung signType với chế độ thường.
//
// timeOfDay: chỉ áp dụng ở chế độ KHÔNG có ảnh thật (tạo ảnh mới hoàn toàn).
// Ở chế độ ảnh thật, thời điểm luôn mặc định là "Ban ngày" vì phần lớn ảnh
// mặt tiền người dùng chụp là ảnh ban ngày, người dùng có thể tự đổi lại.
//
// angle: chỉ áp dụng ở chế độ KHÔNG có ảnh thật, vì ở chế độ ảnh thật góc
// nhìn đã được quyết định bởi chính ảnh thật (trường Camera angle bị khoá).
const BUSINESS_TYPE_DEFAULTS = {
  "bakery":              { signType: "awning-sign",         style: "farmhouse-rustic",   colorTone: "warm-wood",      timeOfDay: "ngay",     angle: "chinh-dien" },
  "bank":                { signType: "chu-noi",              style: "contemporary",       colorTone: "navy-gold",      timeOfDay: "ngay",     angle: "chinh-dien" },
  "bar-pub":              { signType: "neon-sign",            style: "urban-street",       colorTone: "black-gold",     timeOfDay: "dem",      angle: "ba-phan-tu" },
  "barbershop":          { signType: "chu-noi",              style: "vintage-retro",      colorTone: "black-gold",     timeOfDay: "ngay",     angle: "chinh-dien" },
  "bookstore":           { signType: "wooden-carved",        style: "classic-vietnamese", colorTone: "warm-wood",      timeOfDay: "ngay",     angle: "chinh-dien" },
  "bubble-tea":          { signType: "hop-den",              style: "korean-minimal",     colorTone: "pastel",         timeOfDay: "ngay",     angle: "chinh-dien" },
  "car-dealership":      { signType: "pylon-sign",           style: "contemporary",       colorTone: "silver-white",   timeOfDay: "ngay",     angle: "flycam",     photoSignType: "alu" },
  "car-wash":            { signType: "chu-led",              style: "futuristic",         colorTone: "ocean-blue",     timeOfDay: "ngay",     angle: "ba-phan-tu" },
  "clothing-store":      { signType: "alu",                  style: "luxury",             colorTone: "black-gold",     timeOfDay: "ngay",     angle: "chinh-dien" },
  "coffee-shop":         { signType: "hop-den",              style: "mediterranean",      colorTone: "warm-wood",      timeOfDay: "ngay",     angle: "chinh-dien" },
  "convenience-store":   { signType: "hop-den",              style: "contemporary",       colorTone: "vibrant-bold",   timeOfDay: "dem",      angle: "chinh-dien" },
  "dental-clinic":       { signType: "alu",                  style: "korean-minimal",     colorTone: "blue-white",     timeOfDay: "ngay",     angle: "chinh-dien" },
  "electronics-store":   { signType: "digital-led-display",  style: "futuristic",         colorTone: "neon-multicolor", timeOfDay: "dem",     angle: "chinh-dien", photoSignType: "hop-den" },
  "flower-shop":         { signType: "window-vinyl",         style: "bohemian",           colorTone: "pastel",         timeOfDay: "ngay",     angle: "chinh-dien" },
  "furniture-store":     { signType: "chu-noi",              style: "mid-century-modern", colorTone: "warm-wood",      timeOfDay: "ngay",     angle: "chinh-dien" },
  "gym-fitness":         { signType: "chu-led",              style: "urban-street",       colorTone: "black-gold",     timeOfDay: "dem",      angle: "ba-phan-tu" },
  "hair-salon":          { signType: "neon-sign",            style: "parisian-chic",      colorTone: "rose-gold",      timeOfDay: "ngay",     angle: "chinh-dien" },
  "hardware-store":      { signType: "alu",                  style: "industrial",         colorTone: "charcoal-copper", timeOfDay: "ngay",    angle: "chinh-dien" },
  "hotel":               { signType: "engraved-plaque",      style: "luxury",             colorTone: "black-gold",     timeOfDay: "hoang-hon", angle: "flycam" },
  "ice-cream-shop":      { signType: "hop-den",              style: "eclectic",           colorTone: "pastel",         timeOfDay: "ngay",     angle: "chinh-dien" },
  "jewelry-store":       { signType: "chu-noi",              style: "luxury",             colorTone: "black-gold",     timeOfDay: "ngay",     angle: "can-canh" },
  "karaoke-lounge":      { signType: "neon-sign",            style: "cyberpunk",          colorTone: "neon-multicolor", timeOfDay: "dem",     angle: "ba-phan-tu" },
  "laundry":             { signType: "window-vinyl",         style: "contemporary",       colorTone: "blue-white",     timeOfDay: "ngay",     angle: "chinh-dien" },
  "law-firm":            { signType: "engraved-plaque",      style: "contemporary",       colorTone: "navy-gold",      timeOfDay: "ngay",     angle: "chinh-dien" },
  "massage-spa":         { signType: "wooden-carved",        style: "zen-wabisabi",       colorTone: "sage-green",     timeOfDay: "ngay",     angle: "chinh-dien" },
  "medical-clinic":      { signType: "alu",                  style: "korean-minimal",     colorTone: "blue-white",     timeOfDay: "ngay",     angle: "chinh-dien" },
  "nail-salon":          { signType: "hop-den",              style: "parisian-chic",      colorTone: "rose-gold",      timeOfDay: "ngay",     angle: "chinh-dien" },
  "noodle-shop":         { signType: "chu-led",              style: "classic-vietnamese", colorTone: "burgundy-cream", timeOfDay: "dem",      angle: "chinh-dien" },
  "optical-store":       { signType: "alu",                  style: "korean-minimal",     colorTone: "silver-white",   timeOfDay: "ngay",     angle: "chinh-dien" },
  "pet-shop":            { signType: "window-vinyl",         style: "eclectic",           colorTone: "vibrant-bold",   timeOfDay: "ngay",     angle: "chinh-dien" },
  "pharmacy":            { signType: "hop-den",              style: "contemporary",       colorTone: "emerald-green",  timeOfDay: "ngay",     angle: "chinh-dien" },
  "phone-laptop-store":  { signType: "digital-led-display",  style: "futuristic",         colorTone: "neon-multicolor", timeOfDay: "dem",     angle: "chinh-dien", photoSignType: "hop-den" },
  "photo-studio":        { signType: "chu-noi",              style: "industrial",         colorTone: "monochrome",     timeOfDay: "ngay",     angle: "chinh-dien" },
  "real-estate":         { signType: "alu",                  style: "contemporary",       colorTone: "navy-gold",      timeOfDay: "ngay",     angle: "chinh-dien" },
  "restaurant":          { signType: "chu-noi",              style: "mediterranean",      colorTone: "terracotta",     timeOfDay: "hoang-hon", angle: "chinh-dien" },
  "retail-shop":         { signType: "alu",                  style: "contemporary",       colorTone: "vibrant-bold",   timeOfDay: "ngay",     angle: "chinh-dien" },
  "supermarket":         { signType: "digital-led-display",  style: "contemporary",       colorTone: "vibrant-bold",   timeOfDay: "ngay",     angle: "flycam",     photoSignType: "alu" },
  "tailor-shop":         { signType: "wooden-carved",        style: "classic-vietnamese", colorTone: "warm-wood",      timeOfDay: "ngay",     angle: "chinh-dien" },
  "tattoo-studio":       { signType: "neon-sign",            style: "urban-street",       colorTone: "black-gold",     timeOfDay: "dem",      angle: "ba-phan-tu" },
  "tea-house":           { signType: "wooden-carved",        style: "zen-wabisabi",       colorTone: "sage-green",     timeOfDay: "ngay",     angle: "chinh-dien" },
  "travel-agency":       { signType: "alu",                  style: "contemporary",       colorTone: "ocean-blue",     timeOfDay: "ngay",     angle: "chinh-dien" },
  "veterinary-clinic":   { signType: "alu",                  style: "korean-minimal",     colorTone: "emerald-green",  timeOfDay: "ngay",     angle: "chinh-dien" },
  "wine-shop":           { signType: "engraved-plaque",      style: "luxury",             colorTone: "burgundy-cream", timeOfDay: "hoang-hon", angle: "chinh-dien" },
  "other-business":      { signType: "alu",                  style: "contemporary",       colorTone: "vibrant-bold",   timeOfDay: "ngay",     angle: "chinh-dien" },
};

// Negative prompt bổ sung khi dùng chế độ "ảnh thật" (photo mode), nhấn mạnh
// việc không được thay đổi phần còn lại của ảnh gốc.
const NEGATIVE_PROMPT_PHOTO_EN =
  NEGATIVE_PROMPT_EN +
  ", altered building structure, changed background, different storefront, mismatched lighting, floating or disconnected sign, unrelated changes to the photo, changed camera angle, changed perspective";

/* ============================================================
   LOCALIZED PROMPT TEMPLATES
   Dùng khi người dùng chọn "Nhập tùy chỉnh" ở bất kỳ trường nào
   (Loại hình kinh doanh / Loại biển / Phong cách / Tông màu),
   khi đó toàn bộ prompt được sinh bằng đúng ngôn ngữ giao diện
   đang chọn, thay vì mặc định tiếng Anh.
   p = { business, sign, style, color, time, angle, width, brand }
   (các chuỗi con đã được localize sẵn trước khi truyền vào đây)
   ============================================================ */

const QUALITY_TAGS = {
  photorealistic:        { en: "photorealistic", vi: "chân thực như ảnh thật", ar: "واقعي فوتوغرافيًا", zh: "照片级真实感", fr: "photoréaliste", ru: "фотореалистично", es: "fotorrealista" },
  architecturalPhotography: { en: "architectural photography", vi: "ảnh chụp kiến trúc", ar: "تصوير معماري", zh: "建筑摄影", fr: "photographie d'architecture", ru: "архитектурная фотография", es: "fotografía de arquitectura" },
  sharpFocus:             { en: "sharp focus", vi: "nét sắc", ar: "تركيز حاد", zh: "清晰对焦", fr: "mise au point nette", ru: "чёткий фокус", es: "enfoque nítido" },
  highlyDetailed:         { en: "highly detailed", vi: "chi tiết cao", ar: "تفاصيل عالية الدقة", zh: "高细节", fr: "très détaillé", ru: "высокая детализация", es: "muy detallado" },
  naturalMaterials:       { en: "natural materials", vi: "vật liệu tự nhiên", ar: "مواد طبيعية", zh: "天然材质", fr: "matériaux naturels", ru: "натуральные материалы", es: "materiales naturales" },
  professionalLighting:   { en: "professional photography lighting", vi: "ánh sáng chụp ảnh chuyên nghiệp", ar: "إضاءة تصوير احترافية", zh: "专业摄影灯光", fr: "éclairage photographique professionnel", ru: "профессиональное фотоосвещение", es: "iluminación fotográfica profesional" },
  ultraRealistic:         { en: "ultra realistic architectural photo", vi: "ảnh kiến trúc siêu thực", ar: "صورة معمارية فائقة الواقعية", zh: "超写实建筑照片", fr: "photo architecturale ultra réaliste", ru: "сверхреалистичное архитектурное фото", es: "foto arquitectónica ultrarrealista" },
};

function buildTagList(p, lang, frag) {
  const frags = [p.business, p.sign, p.style, p.color, p.time, p.angle];
  if (p.width) frags.push(frag.width(p.width));
  if (p.brand) frags.push(frag.brand(p.brand));
  return frags.join(", ");
}

const LOCALIZED_TEMPLATES = {
  en: {
    sentence(p) { return `Create a photorealistic image of a ${p.business} with a ${p.sign}. Design style: ${p.style}. Color palette: ${p.color}. Show it during ${p.time}, shot as a ${p.angle}.${p.width ? ` The storefront is about ${p.width} meters wide.` : ""}${p.brand ? ` The sign clearly displays the brand name "${p.brand}", spelled exactly and fully legible.` : ""} Make the signboard lettering clean and fully legible, 4K, professional architectural photography.`; },
    brief(p) { return `Write a vivid, detailed creative brief describing a ${p.business} with a ${p.sign}${p.brand ? ` displaying the brand name "${p.brand}"` : ""}. Style: ${p.style}. Color palette: ${p.color}. Setting: ${p.time}, described from a ${p.angle}.${p.width ? ` Storefront width: about ${p.width} meters.` : ""} Describe the materials, lighting, and mood in enough detail that a designer could sketch it from your description.`; },
    structured(p) { return `A photorealistic ${p.business} featuring a ${p.sign}${p.brand ? ` with the brand name "${p.brand}" clearly lettered` : ""}. Style: ${p.style}. Color palette: ${p.color}. ${p.time}, ${p.angle}. Clear, legible signboard text.`; },
    tags(p, extra) { return buildTagList(p, "en", { width: (w) => `storefront width approximately ${w} meters`, brand: (b) => `brand name "${b}" displayed clearly and spelled exactly` }) + (extra ? `, ${extra}` : ""); },
    photoEdit(p) { return `Using the uploaded photo of the real storefront, edit the image by adding a ${p.sign} above the entrance (or in the empty space intended for a sign)${p.brand ? `, clearly displaying the brand name "${p.brand}", spelled exactly and fully legible` : ""}. Design style: ${p.style}. Color palette: ${p.color}.${p.time ? ` Adjust the lighting so the scene reads as ${p.time}.` : ""}${p.width ? ` Size the sign proportionally for a storefront about ${p.width} meters wide.` : ""} Keep everything else in the photo unchanged: same building, same background, same camera angle and perspective, same surroundings. The new sign must look physically mounted on the wall, with realistic shadows, reflections, and perspective matching the original photo, not pasted on or floating.`; },
  },
  vi: {
    sentence(p) { return `Tạo một hình ảnh chân thực về ${p.business} với ${p.sign}. Phong cách thiết kế: ${p.style}. Tông màu: ${p.color}. Thể hiện vào ${p.time}, góc chụp ${p.angle}.${p.width ? ` Mặt tiền rộng khoảng ${p.width} mét.` : ""}${p.brand ? ` Biển hiển thị rõ tên thương hiệu "${p.brand}", viết chính xác và dễ đọc.` : ""} Chữ trên biển phải rõ ràng, dễ đọc, ảnh chụp kiến trúc chuyên nghiệp, độ phân giải 4K.`; },
    brief(p) { return `Viết một bản mô tả sáng tạo chi tiết, sống động về ${p.business} với ${p.sign}${p.brand ? ` có tên thương hiệu "${p.brand}"` : ""}. Phong cách: ${p.style}. Tông màu: ${p.color}. Bối cảnh: ${p.time}, góc nhìn ${p.angle}.${p.width ? ` Mặt tiền rộng khoảng ${p.width} mét.` : ""} Mô tả chi tiết vật liệu, ánh sáng và không khí đủ để một designer có thể phác thảo lại từ mô tả của bạn.`; },
    structured(p) { return `Một hình ảnh chân thực về ${p.business} với ${p.sign}${p.brand ? ` có tên thương hiệu "${p.brand}" được viết rõ ràng` : ""}. Phong cách: ${p.style}. Tông màu: ${p.color}. ${p.time}, ${p.angle}. Chữ trên biển rõ ràng, dễ đọc.`; },
    tags(p, extra) { return buildTagList(p, "vi", { width: (w) => `mặt tiền rộng khoảng ${w} mét`, brand: (b) => `tên thương hiệu "${b}" hiển thị rõ ràng, chính xác` }) + (extra ? `, ${extra}` : ""); },
    photoEdit(p) { return `Sử dụng ảnh mặt tiền thực tế đã tải lên, chỉnh sửa ảnh bằng cách thêm ${p.sign} phía trên lối vào (hoặc vào vị trí trống dành để lắp biển)${p.brand ? `, hiển thị rõ tên thương hiệu "${p.brand}", viết chính xác và dễ đọc` : ""}. Phong cách thiết kế: ${p.style}. Tông màu: ${p.color}.${p.time ? ` Điều chỉnh ánh sáng để thể hiện đúng khung cảnh ${p.time}.` : ""}${p.width ? ` Kích thước biển cần cân đối với mặt tiền rộng khoảng ${p.width} mét.` : ""} Giữ nguyên toàn bộ phần còn lại của ảnh: cùng tòa nhà, cùng background, cùng góc chụp và phối cảnh, cùng khung cảnh xung quanh. Biển mới phải trông như được lắp đặt thật trên tường, có bóng đổ, phản chiếu và phối cảnh khớp với ảnh gốc, không bị dán đè hay lơ lửng.`; },
  },
  ar: {
    sentence(p) { return `أنشئ صورة واقعية لـ ${p.business} مع ${p.sign}. أسلوب التصميم: ${p.style}. درجة اللون: ${p.color}. أظهرها ${p.time}، من ${p.angle}.${p.width ? ` عرض الواجهة حوالي ${p.width} متر.` : ""}${p.brand ? ` تعرض اللافتة بوضوح اسم العلامة التجارية "${p.brand}"، مكتوبًا بدقة وبخط واضح للقراءة.` : ""} اجعل الكتابة على اللافتة نظيفة وواضحة تمامًا للقراءة، بدقة 4K وتصوير معماري احترافي.`; },
    brief(p) { return `اكتب موجزًا إبداعيًا حيًا ومفصلاً يصف ${p.business} مع ${p.sign}${p.brand ? ` يعرض اسم العلامة التجارية "${p.brand}"` : ""}. الأسلوب: ${p.style}. درجة اللون: ${p.color}. البيئة: ${p.time}، موصوفة من ${p.angle}.${p.width ? ` عرض الواجهة: حوالي ${p.width} متر.` : ""} صف المواد والإضاءة والأجواء بتفصيل كافٍ يتيح لمصمم رسمها اعتمادًا على وصفك.`; },
    structured(p) { return `صورة واقعية لـ ${p.business} تحتوي على ${p.sign}${p.brand ? ` مع اسم العلامة التجارية "${p.brand}" مكتوبًا بوضوح` : ""}. الأسلوب: ${p.style}. درجة اللون: ${p.color}. ${p.time}، ${p.angle}. نص اللافتة واضح وسهل القراءة.`; },
    tags(p, extra) { return buildTagList(p, "ar", { width: (w) => `عرض الواجهة حوالي ${w} متر`, brand: (b) => `اسم العلامة التجارية "${b}" معروض بوضوح وبدقة` }) + (extra ? `, ${extra}` : ""); },
    photoEdit(p) { return `باستخدام الصورة الفعلية التي تم تحميلها للواجهة، عدّل الصورة بإضافة ${p.sign} أعلى المدخل (أو في المساحة الفارغة المخصصة للافتة)${p.brand ? `، بحيث تعرض بوضوح اسم العلامة التجارية "${p.brand}"، مكتوبًا بدقة وسهل القراءة` : ""}. أسلوب التصميم: ${p.style}. درجة اللون: ${p.color}.${p.time ? ` عدّل الإضاءة لتعكس ${p.time}.` : ""}${p.width ? ` يجب أن يتناسب حجم اللافتة مع واجهة يبلغ عرضها حوالي ${p.width} متر.` : ""} حافظ على بقية الصورة دون أي تغيير: نفس المبنى، نفس الخلفية، نفس زاوية التصوير والمنظور، ونفس المحيط. يجب أن تبدو اللافتة الجديدة مركبة فعليًا على الجدار، بظلال وانعكاسات ومنظور واقعي يطابق الصورة الأصلية، وليست ملصقة أو معلقة في الهواء.`; },
  },
  zh: {
    sentence(p) { return `创建一张照片级真实感的图像，展示${p.business}，配有${p.sign}。设计风格：${p.style}。色调：${p.color}。呈现${p.time}，拍摄角度为${p.angle}。${p.width ? `店面宽度约为${p.width}米。` : ""}${p.brand ? `招牌上清晰显示品牌名称"${p.brand}"，拼写准确、清晰可读。` : ""} 招牌文字要干净清晰、完全可读，4K分辨率，专业建筑摄影风格。`; },
    brief(p) { return `写一段生动详细的创意简报，描述${p.business}配有${p.sign}${p.brand ? `，展示品牌名称"${p.brand}"` : ""}。风格：${p.style}。色调：${p.color}。场景：${p.time}，从${p.angle}描述。${p.width ? `店面宽度：约${p.width}米。` : ""} 请详细描述材质、灯光和氛围，使设计师能够根据你的描述进行草图绘制。`; },
    structured(p) { return `一张照片级真实感的${p.business}图像，配有${p.sign}${p.brand ? `，清晰标注品牌名称"${p.brand}"` : ""}。风格：${p.style}。色调：${p.color}。${p.time}，${p.angle}。招牌文字清晰易读。`; },
    tags(p, extra) { return buildTagList(p, "zh", { width: (w) => `店面宽度约为${w}米`, brand: (b) => `品牌名称"${b}"清晰显示且拼写准确` }) + (extra ? `, ${extra}` : ""); },
    photoEdit(p) { return `使用上传的实际店面照片，在入口上方（或预留的招牌空位）添加${p.sign}进行编辑${p.brand ? `，清晰显示品牌名称"${p.brand}"，拼写准确、清晰可读` : ""}。设计风格：${p.style}。色调：${p.color}。${p.time ? `调整光线，使画面呈现${p.time}的效果。` : ""}${p.width ? `招牌尺寸应与约${p.width}米宽的店面成比例。` : ""} 保持照片其余部分完全不变：同一栋建筑、同一背景、同一拍摄角度和透视、同一周围环境。新招牌必须看起来像真实安装在墙上一样，具有与原照片相符的逼真阴影、反光和透视效果，而不是贴上去或悬浮的。`; },
  },
  fr: {
    sentence(p) { return `Créez une image photoréaliste d'un(e) ${p.business} avec ${p.sign}. Style de design : ${p.style}. Palette de couleurs : ${p.color}. Montrez-la ${p.time}, avec un cadrage ${p.angle}.${p.width ? ` La façade fait environ ${p.width} mètres de large.` : ""}${p.brand ? ` L'enseigne affiche clairement le nom de la marque « ${p.brand} », orthographié exactement et parfaitement lisible.` : ""} Les lettres de l'enseigne doivent être nettes et parfaitement lisibles, en 4K, style photographie d'architecture professionnelle.`; },
    brief(p) { return `Rédigez un brief créatif vivant et détaillé décrivant un(e) ${p.business} avec ${p.sign}${p.brand ? ` affichant le nom de la marque « ${p.brand} »` : ""}. Style : ${p.style}. Palette de couleurs : ${p.color}. Contexte : ${p.time}, décrit depuis un ${p.angle}.${p.width ? ` Largeur de la façade : environ ${p.width} mètres.` : ""} Décrivez les matériaux, l'éclairage et l'ambiance avec assez de détails pour qu'un designer puisse en faire un croquis.`; },
    structured(p) { return `Une image photoréaliste d'un(e) ${p.business} avec ${p.sign}${p.brand ? ` affichant clairement le nom de la marque « ${p.brand} »` : ""}. Style : ${p.style}. Palette de couleurs : ${p.color}. ${p.time}, ${p.angle}. Texte de l'enseigne clair et lisible.`; },
    tags(p, extra) { return buildTagList(p, "fr", { width: (w) => `façade d'environ ${w} mètres de large`, brand: (b) => `nom de marque « ${b} » affiché clairement et orthographié exactement` }) + (extra ? `, ${extra}` : ""); },
    photoEdit(p) { return `À partir de la photo réelle de la façade téléchargée, modifiez l'image en ajoutant ${p.sign} au-dessus de l'entrée (ou à l'emplacement prévu pour l'enseigne)${p.brand ? `, affichant clairement le nom de la marque « ${p.brand} », orthographié exactement et parfaitement lisible` : ""}. Style de design : ${p.style}. Palette de couleurs : ${p.color}.${p.time ? ` Ajustez l'éclairage pour représenter ${p.time}.` : ""}${p.width ? ` L'enseigne doit être proportionnée à une façade d'environ ${p.width} mètres de large.` : ""} Conservez le reste de la photo inchangé : même bâtiment, même arrière-plan, même angle de prise de vue et perspective, même environnement. La nouvelle enseigne doit sembler réellement fixée au mur, avec des ombres, reflets et une perspective réalistes correspondant à la photo d'origine, sans effet collé ou flottant.`; },
  },
  ru: {
    sentence(p) { return `Создай фотореалистичное изображение ${p.business} с ${p.sign}. Стиль дизайна: ${p.style}. Цветовая палитра: ${p.color}. Покажи ${p.time}, ракурс: ${p.angle}.${p.width ? ` Ширина фасада около ${p.width} метров.` : ""}${p.brand ? ` На вывеске чётко отображается название бренда «${p.brand}», написанное точно и хорошо читаемое.` : ""} Буквы на вывеске должны быть чёткими и полностью читаемыми, 4K, профессиональная архитектурная фотография.`; },
    brief(p) { return `Напиши яркое, подробное творческое описание ${p.business} с ${p.sign}${p.brand ? `, на которой отображается название бренда «${p.brand}»` : ""}. Стиль: ${p.style}. Цветовая палитра: ${p.color}. Обстановка: ${p.time}, ракурс: ${p.angle}.${p.width ? ` Ширина фасада: около ${p.width} метров.` : ""} Опиши материалы, освещение и настроение достаточно подробно, чтобы дизайнер мог сделать набросок по твоему описанию.`; },
    structured(p) { return `Фотореалистичное изображение ${p.business} с ${p.sign}${p.brand ? `, на которой чётко написано название бренда «${p.brand}»` : ""}. Стиль: ${p.style}. Цветовая палитра: ${p.color}. ${p.time}, ${p.angle}. Текст на вывеске чёткий и разборчивый.`; },
    tags(p, extra) { return buildTagList(p, "ru", { width: (w) => `ширина фасада примерно ${w} метров`, brand: (b) => `название бренда «${b}» отображено чётко и написано точно` }) + (extra ? `, ${extra}` : ""); },
    photoEdit(p) { return `Используя реальную загруженную фотографию фасада, отредактируй изображение, добавив ${p.sign} над входом (или на свободном месте, предназначенном для вывески)${p.brand ? `, на которой чётко отображается название бренда «${p.brand}», написанное точно и хорошо читаемое` : ""}. Стиль дизайна: ${p.style}. Цветовая палитра: ${p.color}.${p.time ? ` Настрой освещение так, чтобы сцена соответствовала ${p.time}.` : ""}${p.width ? ` Размер вывески должен быть пропорционален фасаду шириной около ${p.width} метров.` : ""} Остальная часть фотографии должна остаться без изменений: то же здание, тот же фон, тот же ракурс и перспектива, то же окружение. Новая вывеска должна выглядеть реально установленной на стене, с реалистичными тенями, отражениями и перспективой, соответствующими исходному фото, а не наклеенной или парящей в воздухе.`; },
  },
  es: {
    sentence(p) { return `Crea una imagen fotorrealista de un(a) ${p.business} con ${p.sign}. Estilo de diseño: ${p.style}. Paleta de colores: ${p.color}. Muéstralo durante ${p.time}, con un encuadre ${p.angle}.${p.width ? ` La fachada mide unos ${p.width} metros de ancho.` : ""}${p.brand ? ` El letrero muestra claramente el nombre de la marca "${p.brand}", escrito exactamente y totalmente legible.` : ""} Las letras del letrero deben ser limpias y totalmente legibles, en 4K, fotografía de arquitectura profesional.`; },
    brief(p) { return `Escribe un brief creativo vívido y detallado que describa un(a) ${p.business} con ${p.sign}${p.brand ? ` que muestra el nombre de la marca "${p.brand}"` : ""}. Estilo: ${p.style}. Paleta de colores: ${p.color}. Ambiente: ${p.time}, descrito desde un ${p.angle}.${p.width ? ` Ancho de la fachada: unos ${p.width} metros.` : ""} Describe los materiales, la iluminación y el ambiente con suficiente detalle para que un diseñador pueda dibujarlo a partir de tu descripción.`; },
    structured(p) { return `Una imagen fotorrealista de un(a) ${p.business} con ${p.sign}${p.brand ? ` mostrando claramente el nombre de la marca "${p.brand}"` : ""}. Estilo: ${p.style}. Paleta de colores: ${p.color}. ${p.time}, ${p.angle}. Texto del letrero claro y legible.`; },
    tags(p, extra) { return buildTagList(p, "es", { width: (w) => `fachada de unos ${w} metros de ancho`, brand: (b) => `nombre de marca "${b}" mostrado claramente y escrito con exactitud` }) + (extra ? `, ${extra}` : ""); },
    photoEdit(p) { return `Usando la foto real de la fachada subida, edita la imagen añadiendo ${p.sign} sobre la entrada (o en el espacio vacío destinado al letrero)${p.brand ? `, que muestre claramente el nombre de la marca "${p.brand}", escrito exactamente y totalmente legible` : ""}. Estilo de diseño: ${p.style}. Paleta de colores: ${p.color}.${p.time ? ` Ajusta la iluminación para reflejar ${p.time}.` : ""}${p.width ? ` El letrero debe ser proporcional a una fachada de unos ${p.width} metros de ancho.` : ""} Mantén el resto de la foto sin cambios: mismo edificio, mismo fondo, mismo ángulo de cámara y perspectiva, mismo entorno. El nuevo letrero debe verse realmente instalado en la pared, con sombras, reflejos y perspectiva realistas que coincidan con la foto original, sin parecer pegado o flotando.`; },
  },
};

// Ghép câu theo "họ" format của nền tảng (giống FORMATTERS trước đây), nay dùng chung
// cho cả chế độ mặc định (tiếng Anh) và chế độ tùy chỉnh (theo ngôn ngữ UI)
function buildPromptForLang(formatKey, p, lang) {
  const T = LOCALIZED_TEMPLATES[lang] || LOCALIZED_TEMPLATES.en;
  const Q = (key) => (QUALITY_TAGS[key][lang] || QUALITY_TAGS[key].en);
  switch (formatKey) {
    case "sentence":
      return T.sentence(p);
    case "brief":
      return T.brief(p);
    case "structured":
      return T.structured(p);
    case "mj-params":
      return `${T.tags(p, `${Q("photorealistic")}, ${Q("architecturalPhotography")}, ${Q("sharpFocus")}, 4K`)} --ar 16:9 --v 6 --style raw`;
    case "tags-simple":
      return `${T.tags(p, `${Q("photorealistic")}, ${Q("sharpFocus")}, 4K`)} --ar 16:9`;
    case "tags-detailed":
      return T.tags(p, `${Q("ultraRealistic")}, 4K, ${Q("sharpFocus")}, ${Q("naturalMaterials")}, ${Q("professionalLighting")}, ${Q("highlyDetailed")}`);
    default:
      return T.sentence(p);
  }
}

// Ghép prompt cho chế độ "ảnh thật" (photo mode), người dùng đã upload ảnh
// mặt tiền, prompt sẽ hướng dẫn AI CHỈNH SỬA ảnh đó (thêm biển vào ảnh thật)
// thay vì tạo ảnh mới từ đầu như buildPromptForLang().
function buildPhotoPromptForLang(formatKey, p, lang) {
  const T = LOCALIZED_TEMPLATES[lang] || LOCALIZED_TEMPLATES.en;
  const Q = (key) => (QUALITY_TAGS[key][lang] || QUALITY_TAGS[key].en);
  const base = T.photoEdit(p);
  switch (formatKey) {
    case "mj-params":
      return `${base} ${Q("photorealistic")}, ${Q("sharpFocus")}, 4K. --ar 16:9 --v 6 --style raw`;
    case "tags-simple":
      return `${base} ${Q("photorealistic")}, 4K. --ar 16:9`;
    case "tags-detailed":
      return `${base} ${Q("ultraRealistic")}, 4K, ${Q("sharpFocus")}, ${Q("naturalMaterials")}, ${Q("professionalLighting")}.`;
    default:
      return base;
  }
}

const CUSTOM_VALUE = "__custom__";
