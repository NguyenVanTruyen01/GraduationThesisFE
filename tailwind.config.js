/** @type {import('tailwindcss').Config} */
export default {
  // content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // primary: ['Poppins', 'sans-serif;'],
      },
      colors: {
        primaryColor: '#0e4bf1',
        panelColor: '#fff',
        textColor: '#000',
        blackLightColor: '#707070',
        borderColor: '#e6e5e5',
        toggleColor: '#ddd',
        box1Color: '#4da3ff',
        box2Color: '#ffe6ac',
        box3Color: '#e7d1fc',
        titleIconColor: '#fff',
        primary: '#6C7EE1',
        secondary: '#92B9E3',
        third: '#FFC4A4',
        fourth: '#FBA2D0',
        fifth: '#C688EB',
        text1: '#171725',
        text2: '#4B5264',
        text3: '#808191',
        text4: '#B2B3BD',
        'icon-color': '#A2A2A8',
        white: '#FFFFFF',
        whiteSoft: '#FCFBFF',
        graySoft: '#FCFCFC',
        grayf3: '#f3f3f3',
        strock: '#F1F1F3',
        lite: '#FCFCFD',
        error: '#EB5757',
        darkbg: '#13131A',
        darkSecondary: '#1C1C24',
        softDark: '#22222C',
        darkSoft: '#24242C',
        darkStroke: '#3A3A43',
        darkRed: '#422C32',
        bgColor: '#F5F2EB',
        bgBtn: "#6366F1"
      },
      boxShadow: {
        sdprimary: '10px 10px 20px rgba(211, 211, 211, 0.25);',
      },
      transition: {
        tran05: 'all 0.5s ease',
        tran03: 'all 0.3s ease',
        tran02: 'all 0.2s ease',
      }
    },
  },
  plugins: [],
};
