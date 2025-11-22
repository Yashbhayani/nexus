const Levenshtein = require("levenshtein");
const Status = require("../models/status"); // <-- ADD THIS

module.exports.findSimilarStatus = async (inputName, STID) => {
  const allStatuses = await Status.findAll({
    where: { STID: STID },
    attributes: ["ID", "Name"],
  });

  let bestMatch = null;
  let bestDistance = Infinity;

  for (let s of allStatuses) {
    let dist = new Levenshtein(inputName.toLowerCase(), s.Name.toLowerCase())
      .distance;

    if (dist < bestDistance) {
      bestDistance = dist;
      bestMatch = s;
    }
  }

  // If similarity is good (distance <= 2), treat as same
  if (bestDistance <= 2) {
    return bestMatch;
  }

  return null;
};
