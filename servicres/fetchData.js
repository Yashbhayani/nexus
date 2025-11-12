const sequelize = require('../db'); // your existing Sequelize instance
const { QueryTypes } = require('sequelize');

// Example encryption helper (replace with your real one)
const IdEncrypt = (value) => Buffer.from(String(value)).toString('base64');

// Fields that need encryption
const encryptedFields = ['userid', 'id'];

async function fetchData(Code, report) {
  const response = {};

  try {
    // Step 1️⃣ - Fetch stored procedure query string from your SP lookup table
    // Assuming you have a table or SP to get query using Code
    const spRecord = await SPtable.findOne({
      attributes: ['SPName'],
      where: { Code }
    });

    if (!spRecord) {
      return {
        Success: false,
        Message: 'Stored procedure not found for given code.'
      };
    }
    
    const SPName = spRecord.SPName;

    // Step 2️⃣ - Execute the stored procedure dynamically
    const [results] = await sequelize.query(`CALL ${SPName}(:report)`, {
      replacements: { report },
      type: QueryTypes.RAW
    });

    // Step 3️⃣ - Handle multiple result sets
    const data  = {};
      if (Array.isArray(results)) {
        results.forEach((resultSet, index) => {
          const tableName = tables[index] || `resultset_${index}`;
          data[tableName] = resultSet;
        });
      } else {
        const tableName = tables[0] || 'resultset_0';
        data[tableName] = results;
      }
 /*   if (Array.isArray(results)) {
      results.forEach((rs, index) => {
        const resultsetName = `resultset_${index}`;
        const formatted = rs.map((row) => {
          const details = {};
          for (const [key, value] of Object.entries(row)) {
            if (encryptedFields.includes(key.toLowerCase())) {
              details[key] = IdEncrypt(value);
            } else {
              details[key] = value;
            }
          }
          return details;
        });
        listdata[resultsetName] = formatted;
      });
    }*/



    // Step 4️⃣ - Build response
    if (Object.keys(data ).length > 0) {
      response.data = data ;
      response.Success = true;
      response.Code = 200;
    } else {
      response.Message = 'List not found for the specified report.';
      response.Success = false;
    }

  } catch (err) {
    response.Message = err.message;
    response.Success = false;
  }

  return response;
}

module.exports = { fetchData };
