const flowbite = require("flowbite-react/tailwind");

export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}", flowbite.content(),],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [flowbite.plugin(),],
};