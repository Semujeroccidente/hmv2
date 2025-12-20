import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				// Brand Colors - HonduMarket
				azul: {
					50: '#e6f0fa',
					100: '#cce0f5',
					200: '#99c2eb',
					300: '#66a3e0',
					400: '#3385d6',
					500: '#0066cc',
					600: '#004d99',
					700: '#003366',
					800: '#002952',
					900: '#001a33',
				},
				verde: {
					50: '#e6fdfa',
					100: '#ccfaf5',
					200: '#99f5eb',
					300: '#66f0e0',
					400: '#33ebd6',
					500: '#00e6cc',
					600: '#00c9b3',
					700: '#00A896',
					800: '#007a6e',
					900: '#005548',
				},
				naranja: {
					50: '#fff7ec',
					100: '#fff0d9',
					200: '#ffe0b3',
					300: '#ffd199',
					400: '#ffc280',
					500: '#ffb366',
					600: '#ff9933',
					700: '#FF7F00',
					800: '#b35900',
					900: '#803f00',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [tailwindcssAnimate],
};
export default config;
