const loginForm = document.querySelector("form#login-form");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailInputValue = document
    .querySelector("input#email-input")
    .value.trim();
  const passwordInputValue = document
    .querySelector("input#password-input")
    .value.trim();

  const accessToken = localStorage.getItem("token");

  // const accessToken = document.cookie
  //   .split("; ")
  //   .find((cookie) => cookie.startsWith("accessToken"))
  //   ?.split("=")[1];

  try {
    const response = await fetch("http://localhost:5000/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userName: emailInputValue,
        password: passwordInputValue,
      }),
    });

    if (response.ok) {
      document.body.querySelector("#login-form").reset();
      const userData = await response.json();

      localStorage.setItem("token", userData.token);

      document.cookie = `accessToken=${userData.token}; SameSite=None; Secure`;

      window.location.assign(`./index.html`);

      return alert("Succesufuly logged in");
    }

    if (!response.ok || response.status >= 400) {
      const message = await response.json();

      console.info({ message, response });

      return alert(message.error || response.statusText);
    }
  } catch (error) {
    alert(error.message);
  }
});
