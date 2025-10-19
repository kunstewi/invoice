- Create a frontend folder and run `npm create vite@latest` and create a new directory named invoice-generator where react+vite file structure is present

- Delete everything in the App.jsx and write rafce to create a boilerplate code for App.jsx

- delete App.css as we will use tailwind, then delete everything in the index.css file

- follow the steps on vite website to link tailwind css with vite. first npm install tailwindcss @tailwindcss/vite in the vite.config.js file add `import tailwindcss from "@tailwindcss/vite"` then add `tailwindcss()` in the plugins section of vite.config.js and then add `@import "tailwindcss";` in index.css

- go to google fonts and search urbanist to add it in the index.css file at the top.

- then we start coding

- start with the index.css file, add some root variable colors breakpoint and font, then use base layer to give the html the font and body a background color.

- create a componenets folder then create auth, landing, layout and ui folder inside

- create a context folder and inside create a AuthContext.jsx file

- create a pages folder and create Auth folder inside and inside the Auth folder make SignUp.jsx and Login.jsx file then create a Dashboard folder and inside that make Dashboard.jsx then create a Invoices folder and inside that create AllInvoices.jsx, CreateInvoices.jsx, InvoiceDetail.jsx then create a LandingPage folder and inside create LandingPage.jsx then create a Profile folder and inside that create ProfilePage.jsx ( all of these folders and files are created in the pages folder )

- create a utils folder and create apiPaths.js, axiosInstance.js, data.js, helper.js, pdf.js

- `npm install react-router-dom react-hot-toast axios lucide-react moment`

- then start coding from the App.jsx file

- import react-router-dom (BrowserRouter as Router, Routes, Route, Navigate) and react-hot-toast in the app.jsx file.

- start by defining routes with the help of react router dom - first write the public routes then write the protected routes which are to be protected by authentication and at the end write a logic to handle fallback route to catch all wrong route

- give toastOptions prop of Toaster a default class name and the default css styling it's gonna use for the toasts.

- add all the pages as imports in the App.jsx (landing page, sign up page, login page) make sure every page has jsx exports, then check if every route gives you the name of the route on your page

-
