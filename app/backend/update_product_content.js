require('dotenv').config();
const pool = require('./config/db');

// Rich ingredients per product id
const ingredientsMap = {
  1:  'Chicken Meal, Brown Rice, Oatmeal, Peas, Salmon Oil, Flaxseed, Dried Beet Pulp, Calcium Carbonate, Zinc Proteinate, Vitamin E Supplement, DHA',
  2:  'Organic Beef, Brown Rice Flour, Glycerin, Water, Vinegar, Sea Salt, Rosemary Extract',
  3:  'Lamb Meal, Brown Rice, Barley, Flaxseed, Glucosamine HCl (500mg/kg), Chondroitin Sulfate (400mg/kg), Fish Oil, Yucca Schidigera Extract, Vitamin C',
  4:  'Salmon, Salmon Meal, Sweet Potato, Lentils, Chickpeas, Pea Protein, Salmon Oil, Coconut Oil, Dried Blueberries, Turmeric',
  5:  'Chicken, Chicken Meal, Peas, Lentils, Tapioca, Egg, Chicken Fat, Taurine, Dried Cranberries, Vitamin B12 Supplement',
  6:  'Duck, Potato Starch, Glycerin, Canola Oil, Natural Duck Flavor, Rosemary Extract, Vitamin E',
  7:  'Turkey, Turkey Meal, Oatmeal, Brown Rice, Peas, Turkey Fat (preserved with Mixed Tocopherols), Organic Flaxseed, Dried Kelp',
  8:  'Chicken Meal, Oatmeal, Rice, Whole Egg, Chicken Fat, Fish Oil, Chicory Root, Dried Plain Beet Pulp, Taurine, L-Carnitine',
  9:  'Chicken, Chicken Meal, Peas, Lentils, Chicken Fat, Egg, Dried Spinach, Dried Blueberries, L-Carnitine, Glucosamine HCl',
  10: 'Lamb, Lamb Meal, Brown Rice, Barley, Oatmeal, Lamb Fat, Dried Plain Beet Pulp, Psyllium Husk, Lactobacillus Acidophilus',
  11: 'Wild Boar, Wild Boar Meal, Apples, Sweet Potato, Peas, Wild Boar Fat, Coconut Oil, Dried Rosemary, Vitamin D3',
  12: 'Chicken, Chicken Meal, Brown Rice, Oatmeal, Chicken Fat, Fish Oil, DHA, Calcium Carbonate, Folic Acid, Vitamin A',
  13: 'Chicken, Potato Starch, Glycerin, Powdered Cellulose, Sodium Hexametaphosphate, Natural Flavor, Parsley, Peppermint Oil',
  14: 'Venison, Venison Meal, Peas, Lentils, Canola Oil, Dried Blueberries, Dried Cranberries, Taurine, Vitamin E Supplement',
  15: 'Chicken Meal, Oatmeal, Brown Rice, Peas, Chicken Fat, L-Carnitine, Psyllium Seed Husk, Inulin, Chicory Root',
  16: 'Chicken, Chicken Meal, Peas, Lentils, Chicken Fat, Egg, Beef, Salmon Oil, Glucosamine HCl, Creatine Monohydrate',
  17: 'Organic Chicken, Organic Brown Rice, Organic Oats, Organic Peas, Organic Flaxseed, Sea Salt, Organic Turmeric, Organic Kelp',
  18: 'Chicken, Oat Flour, Glycerin, Potato Starch, Chamomile Extract, L-Theanine, Valerian Root, Vitamin E, Natural Chicken Flavor',
  19: 'Chicken Meal, Brown Rice, Oatmeal, Barley, Glucosamine HCl (600mg/kg), Chondroitin Sulfate (500mg/kg), Fish Oil, Vitamin C',
  20: 'Chicken, Oat Flour, Dried Blueberries, Dried Cranberries, Dried Pomegranate, Chia Seeds, Flaxseed, Coconut Oil, Vitamin E',
  21: 'Herring, Herring Meal, Sweet Potato, Peas, Herring Oil, Lentils, Dried Blueberries, Vitamin A, Vitamin D3, Zinc Proteinate',
  22: 'Chicken, Chicken Liver, Salmon, Taurine, DHA, Calcium Carbonate, Dried Egg Product, Folic Acid, Vitamin A, Vitamin D3',
  23: 'Salmon, Salmon Broth, Chicken, Salmon Oil, Taurine, Dried Egg, Vitamin E Supplement, Zinc Proteinate, Manganese Proteinate',
  24: 'Chicken Meal, Brown Rice, Peas, L-Carnitine, Oatmeal, Chicken Fat, Taurine, Chicory Root Extract, Vitamin E, Potassium Chloride',
};

// Richer descriptions per product id
const descriptionMap = {
  1:  'Specially formulated for puppies in their critical growth phase, this premium kibble delivers the perfect balance of protein, fat, and essential nutrients. DHA from fish oil supports brain and vision development, while calcium and phosphorus build strong bones and teeth. No artificial colors, flavors, or preservatives.',
  2:  'Handcrafted from 100% USDA organic grass-fed beef, these chewy jerky strips are a guilt-free indulgence for your dog. Slow-dried to preserve natural flavor and nutrients, with no added sugar, soy, wheat, or corn. Perfect as a training reward or daily treat.',
  3:  'Designed for the unique needs of dogs aged 7+, these soft bites combine glucosamine and chondroitin to support joint mobility and comfort. Enriched with antioxidants to combat cellular aging and fish oil for a healthy coat. Gentle on sensitive senior digestive systems.',
  4:  'A single-protein, grain-free formula built around wild-caught Atlantic salmon. Ideal for dogs with grain sensitivities or food allergies. Abundant omega-3 fatty acids nourish the skin and coat, while peas and lentils provide sustained energy and digestive fiber.',
  5:  'Packed with lean chicken as the #1 ingredient, this high-protein meal supports muscle development and lean body mass. Grain-free and rich in natural antioxidants from cranberries, this is the formula active, energetic dogs love.',
  6:  'These limited-ingredient treats use single-source duck for dogs with common protein sensitivities. The addition of potato provides a novel carbohydrate, making these an excellent option for elimination diets. No gluten, soy, or dairy.',
  7:  'A complete and balanced holistic dinner using real turkey as the primary protein. Crafted with whole superfoods including kelp and flaxseed for optimal wellness. Free from artificial additives and by-product meals.',
  8:  'Tailored for the metabolic rate and jaw size of small and toy breeds. Higher calorie density fuels their big energy, while smaller kibble size ensures easy chewing. L-Carnitine helps maintain healthy weight.',
  9:  'Engineered for working dogs, sporting breeds, and high-energy companions. Elevated protein and fat levels fuel sustained performance, while L-Carnitine promotes efficient fat metabolism. Glucosamine supports healthy joints under active stress.',
  10: 'A gentle, easily digestible formula featuring lamb as the sole protein. Psyllium husk adds prebiotic fiber to support a balanced gut microbiome. Ideal for dogs recovering from digestive upsets or prone to loose stools.',
  11: 'An exotic protein source for dogs who have developed sensitivities to common proteins like chicken or beef. Wild boar provides a lean, flavorful alternative, paired with naturally sweet apples for antioxidant support.',
  12: 'Fortified with DHA for brain and retinal development, this formula sets puppies up for a lifetime of health. Optimal calcium-to-phosphorus ratio ensures proper bone formation, and prebiotics establish a strong gut flora from day one.',
  13: 'Veterinarian-recommended for daily dental hygiene maintenance. The unique texture scrubs away plaque and tartar as your dog chews, while peppermint and parsley freshen breath. VOHC (Veterinary Oral Health Council) certified.',
  14: 'A true hypoallergenic formula with venison as the sole animal protein and peas/lentils as carbohydrate sources. Free of the eight most common allergens. Developed for dogs with severe food sensitivities confirmed by elimination diets.',
  15: 'Scientifically formulated to help overweight and low-activity dogs reach and maintain their ideal body weight. Reduced fat, increased L-Carnitine for fat metabolism, and a high-fiber profile make your dog feel full without excess calories.',
  16: 'A maximum-protein formula for dogs requiring serious muscle support — post-op recovery, working dogs, or canine athletes. The blend of chicken, beef, and salmon provides a complete amino acid profile for optimal muscle protein synthesis.',
  17: 'Every ingredient is certified organic, sourced from small ethical farms. No pesticides, synthetic fertilizers, or GMO crops. Turmeric and kelp provide powerful natural anti-inflammatory and thyroid support benefits.',
  18: 'Infused with chamomile extract, L-Theanine, and valerian root — clinically studied ingredients that promote calmness without sedation. Ideal for dogs that experience anxiety during thunderstorms, car rides, or fireworks.',
  19: 'Developed specifically for large and giant breeds prone to joint stress and arthritis. Industry-leading levels of glucosamine and chondroitin are clinically proven to support cartilage repair and joint lubrication over time.',
  20: 'Loaded with antioxidant-rich blueberries, cranberries, pomegranate, and chia seeds. These nutrient-dense bites support immune function, urinary tract health, and cellular protection. A functional treat that tastes as good as it does good.',
  21: 'Sourced from cold Arctic waters, the herring in this formula provides exceptional omega-3 fatty acid levels — critical for brain health, vision, and reducing inflammatory skin conditions in sensitive dogs.',
  22: 'A precisely balanced formula for kittens from weaning to 12 months. High taurine levels support feline cardiac function, while DHA promotes neural development. The pâté texture is easy for small kittens to eat.',
  23: 'Crafted with whole Atlantic salmon in a rich broth, this gourmet wet food satisfies even the pickiest feline palates. Naturally rich in omega-3 fatty acids and taurine to support coat gloss and heart health.',
  24: 'Designed for cats who live exclusively indoors and have lower calorie needs. L-Carnitine supports healthy weight management, while high fiber content helps reduce hairball formation from frequent self-grooming.',
};

async function updateProductContent() {
  let updated = 0;
  try {
    // Ensure ingredients column exists
    const [cols] = await pool.query(`
      SELECT COLUMN_NAME FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'ingredients'
    `);
    if (cols.length === 0) {
      await pool.query(`ALTER TABLE products ADD COLUMN ingredients TEXT DEFAULT NULL`);
      console.log('Added "ingredients" column.');
    }

    const [products] = await pool.query('SELECT id, name FROM products ORDER BY id');
    for (const p of products) {
      const desc = descriptionMap[p.id];
      const ingr = ingredientsMap[p.id];
      if (!desc || !ingr) { console.log(`  [SKIP] id=${p.id}`); continue; }
      await pool.query(
        'UPDATE products SET description = ?, ingredients = ? WHERE id = ?',
        [desc, ingr, p.id]
      );
      console.log(`  [OK] id=${p.id} "${p.name}"`);
      updated++;
    }
    console.log(`\nUpdated ${updated}/${products.length} products.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

updateProductContent();
