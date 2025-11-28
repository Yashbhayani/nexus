const apiRequest = async ({ url, method = "GET", body = null, params = {} }) => {
  try {
    // Build query string from params
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    // Make request
    console.log(fullUrl);
    const response = await fetch(fullUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        // if you still use token from localStorage
        "auth-token": localStorage.getItem("auth-token") || "",
      },
      body: body ? JSON.stringify(body) : null,
      //params: params ? params : null,
      //credentials: "include", // ✅ required for backend cookies
    });

    const data = await response.json();
    return data;
  } catch (e) {
    console.log("API Request Error:", e);
    throw e;
  }
};

export default apiRequest;  