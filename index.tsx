import { ReasonCodes } from "../responses/responseCodes";

/*
  Desc - To set the session in session storage 
  Params -
    {string} session_id;
    {string} req_id;
  Return - null
*/
export const setSession = (
  session_id: string | undefined,
  req_id: string | undefined
) => {
  return sessionStorage.setItem(
    "session_data",
    JSON.stringify({
      session_id,
      req_id,
    })
  );
};

/*
  Desc - To get the session from session storage
  Params - NA
  Return - Object | Null
*/
export const getSession = () => {
  let data: string | null = sessionStorage.getItem("session_data");
  if (data) return JSON.parse(data);
  return null;
};

/*
  Desc - To clear the session from session storage
  Params - NA
  Return - Null
*/
export const clearSession = () => {
  sessionStorage.clear();
};

/*
  Desc - To generate random object id
  Params - NA
  Return - Random Object id string {625h559de249230e5c050d2b}
*/
export const ObjectId = (
  m = Math,
  d = Date,
  h = 24,
  s = (s: any) => m.floor(s).toString(h)
) => s(d.now() / 1000) + " ".repeat(h).replace(/./g, () => s(m.random() * h));

function isEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}

/*
  Desc - To redirect to the client
  Params -
    {string} url;
    {object} payloads;
  Return - Redirect to client's url with post method
*/
export const redirectToClient = (url: string, payloads: any) => {
  try {
    if (window) window.onbeforeunload = null;

    if (!isValidHttpUrl(url)) {
      url = "https://" + url;
    }

    const form = document.createElement("form");

    form.action = url;
    form.method = "post";
    form.enctype = "application/x-www-form-urlencoded";

    if (isEmpty(payloads)) {
      let errMsg: string = ReasonCodes["IE"];
      const inputElement = document.createElement("input");
      inputElement.type = "hidden";
      inputElement.name = "message";
      inputElement.value = errMsg;

      form.appendChild(inputElement);
    } else {
      for (let [key, value] of Object.entries(payloads)) {
        const inputElement = document.createElement("input");
        inputElement.type = "hidden";
        inputElement.name = key;
        inputElement.value = String(value || "");

        form.appendChild(inputElement);
      }
    }

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    alert("Something went wrong. Please redirect manually.");
  }
};

/*
  Desc - To check if url is valid
  Params -
    {string} string;
  Return - boolean
*/
function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

/*
  Desc - To load & get image
  Params -
    {Base64String} file;
  Return - File
*/
export const loadImage = (file: string) => {
  return new Promise(function (resolved, rejected) {
    try {
      var i = new Image();
      i.onload = function () {
        resolved(i);
      };
      i.src = file;
    } catch (error) {
      rejected({ height: 0, width: 0 });
    }
  });
};
