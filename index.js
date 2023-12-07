(() => {
  const devForm = document.querySelector("#wf-form-New-Dev-Applied");

  devForm.addEventListener("submit", function () {
    // Show Loader
    const successWrapper = devForm.parentElement.querySelector(".vet-wrapper");
    successWrapper.style.display = "none";
    const loader = devForm.parentElement.querySelector(".css-loader");
    loader.style.display = "inline-block";
    loader.classList.add("animate-loader");

    // Helper functions
    const encodeData = (data) => encodeURIComponent(data.trim());

    const name = encodeURIComponent(
      devForm.querySelector("#Dev-Full-Name").value
    );
    const email = devForm.querySelector("#Dev-Email-Address").value.trim();
    const phone = devForm.querySelector("#Dev-Phone").value.trim();
    const location = encodeData(
      document.querySelector("#Dev-Country").value.split(", ")[0]
    );
    const disableCoding = devForm.querySelector("#No").checked;

    // Generate test page URL
    const testDomain = `dev.dylwsfwnu43cf.amplifyapp.com`;
    const liveDomain = `www.gpt-vetting.micro1.ai`;

    const staging = document.location.href.includes("webflow");

    const testURL = `https://${
      staging ? testDomain : liveDomain
    }/start/?developer_name=${name}&developer_email=${email}&developer_phone=${phone}&location=${location}&${
      disableCoding ? "disable_coding=1" : ""
    }`;

    console.log(name, email, testURL, staging ? testDomain : liveDomain);

    // Add test page URL
    devForm.parentElement.querySelector("#btn-start-test").href = testURL;

    // Send data to webhook
    const raw = JSON.stringify({
      name: name,
      email_id: email,
      invite_url: testURL,
    });

    console.log(raw);

    fetch(
      staging
        ? "https://ctp33czl12.execute-api.us-west-1.amazonaws.com/dev/openai/invitation-email"
        : "https://api.micro1.io/openai/invitation-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: raw,
      }
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error))
      .finally((_) => {
        loader.style.display = "none";
        loader.classList.remove("animate-loader");
        successWrapper.style.display = "flex";
      });
  });
})();

console.log(1);
