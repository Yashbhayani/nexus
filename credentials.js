module.exports.HostData = {
  Part1: "mysql-",
  Part2: "7e0e00f-",
  Part3: "coderecherche07-",
  Part4: "45e2.",
  Part5: "c.",
  Part6: "aiven",
  Part7: "cloud",
  Part8: ".com",
};

module.exports.Pass = {
  Pass1: "AV",
  Pass2: "NS_2xRP-",
  Pass3: "mQBoQQ14Vp3xIi",
};
// Build the full host
const fullHost =
  module.exports.HostData.Part1 +
  module.exports.HostData.Part2 +
  module.exports.HostData.Part3 +
  module.exports.HostData.Part4 +
  module.exports.HostData.Part5 +
  module.exports.HostData.Part6 +
  module.exports.HostData.Part7 +
  module.exports.HostData.Part8;

// Build the full password
const fullPass =
  module.exports.Pass.Pass1 +
  module.exports.Pass.Pass2 +
  module.exports.Pass.Pass3;

module.exports.credentials = {
  DB_NAME: "nexus",
  DB_USER: "avnadmin",
  DB_PASSWORD: fullPass,
  DB_HOST: fullHost,
  DB_PORT: 16133,
};

// module.exports.credentials = {
//   DB_NAME: "nexus",
//   DB_USER: "root",
//   DB_PASSWORD: "9974143053",
//   DB_HOST: "localhost",
//   DB_PORT: 3308,
// };

module.exports.WebPort = {
  PORT: 5000,
};

module.exports.Cloudnary = {
  CLOUDINARY_CLOUD_NAME: "dgv63uond",
  CLOUDINARY_API_KEY: "918276615367186",
  CLOUDINARY_API_SECRET: "1TL-XYuR0P7iiwrDH0vzhs2ddYU",
};

module.exports.Jwt = {
  JWT_SCERET: "NexusCampus",
};


module.exports.Gemini = {
  API_KEY_1: 'AIzaSyAoB',
  API_KEY_2: '-_2sl1wp',
  API_KEY_3:'ciaRxsG',
  API_KEY_4: '3LC-CPihV',
  API_KEY_5: 'XPEoHk',
}

const fullGeminiKey = 
  module.exports.Gemini.API_KEY_1 +
  module.exports.Gemini.API_KEY_2 +
  module.exports.Gemini.API_KEY_3 +
  module.exports.Gemini.API_KEY_4 +
  module.exports.Gemini.API_KEY_5;

module.exports.Gemini_full = {
  API_KEY: fullGeminiKey,
}
