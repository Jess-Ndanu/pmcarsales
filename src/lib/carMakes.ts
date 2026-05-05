// Comprehensive Make -> Models map for Kenyan/Japanese-import market
// Sourced from typical inventories (smartdreamcars.co.ke and similar dealers)

export const MAKE_MODELS: Record<string, string[]> = {
  Audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT"],
  BMW: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4"],
  Daihatsu: ["Hijet", "Mira", "Move", "Rocky", "Tanto", "Terios", "Thor"],
  Ford: ["Ecosport", "Edge", "Escape", "Everest", "Explorer", "F-150", "Fiesta", "Focus", "Mustang", "Ranger", "Raptor"],
  Honda: ["Accord", "Civic", "CR-V", "Fit", "Freed", "HR-V", "Insight", "Jazz", "Odyssey", "Pilot", "Stepwgn", "Stream", "Vezel"],
  Isuzu: ["D-Max", "MU-X", "NPR", "Trooper"],
  Jeep: ["Cherokee", "Compass", "Grand Cherokee", "Renegade", "Wrangler"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Freelander", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
  Lexus: ["CT", "ES", "GS", "GX", "IS", "LS", "LX", "NX", "RC", "RX", "UX"],
  Mazda: ["Atenza", "Axela", "Bongo", "BT-50", "CX-3", "CX-30", "CX-5", "CX-7", "CX-8", "CX-9", "Demio", "Mazda 2", "Mazda 3", "Mazda 6", "MX-5", "Premacy"],
  "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "CLA", "CLS", "E-Class", "G-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "S-Class", "SL", "Sprinter", "V-Class"],
  Mitsubishi: ["ASX", "Canter", "Eclipse Cross", "L200", "Lancer", "Mirage", "Outlander", "Outlander PHEV", "Pajero", "Pajero Sport", "Triton"],
  Nissan: ["Advan", "Almera", "Caravan", "Dayz", "Dualis", "Elgrand", "Fuga", "GT-R", "Juke", "Latio", "Leaf", "March", "Murano", "Navara", "Note", "NV200", "NV350", "Pathfinder", "Patrol", "Qashqai", "Serena", "Skyline", "Sylphy", "Teana", "Tiida", "Vanette", "Wingroad", "X-Trail"],
  Peugeot: ["208", "2008", "3008", "308", "5008", "508", "Partner"],
  Porsche: ["911", "Boxster", "Cayenne", "Cayman", "Macan", "Panamera", "Taycan"],
  Subaru: ["BRZ", "Exiga", "Forester", "Impreza", "Legacy", "Levorg", "Outback", "Sambar", "Trezia", "WRX", "XV"],
  Suzuki: ["Alto", "APV", "Baleno", "Carry", "Celerio", "Ertiga", "Escudo", "Every", "Hustler", "Ignis", "Jimny", "Solio", "Spacia", "Splash", "Swift", "SX4", "Vitara", "Wagon R"],
  Toyota: [
    "4Runner", "Allion", "Alphard", "Aqua", "Auris", "Avalon", "Avensis", "Axio", "BB", "Belta", "Blade",
    "Camry", "Coaster", "Corolla", "Corolla Cross", "Crown", "Dyna", "Esquire", "Estima", "Fielder", "Fortuner",
    "FJ Cruiser", "Harrier", "Hiace", "Highlander", "Hilux", "Innova", "Ist", "Land Cruiser", "Land Cruiser Prado",
    "Mark X", "Noah", "Passo", "Premio", "Prius", "Probox", "Rav4", "Rumion", "Rush", "Sequoia", "Sienta",
    "Spade", "Succeed", "Tacoma", "Tank", "Tundra", "Vanguard", "Vellfire", "Vitz", "Voxy", "Wish",
  ],
  Volkswagen: ["Amarok", "Beetle", "Caddy", "Golf", "Jetta", "Passat", "Polo", "Tiguan", "Touareg", "Touran", "Transporter"],
  Volvo: ["S60", "S90", "V40", "V60", "V90", "XC40", "XC60", "XC90"],
};

export const MAKES: string[] = ["All Makes", ...Object.keys(MAKE_MODELS).sort()];
