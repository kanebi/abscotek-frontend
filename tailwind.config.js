/** @type {import('tailwindcss').Config} */
export default  {
    content: [
        "./src/**/*.{html,js,ts,jsx,tsx}",
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
    ],
    theme: {
    	extend: {
    		colors: {
    			'dangerd-100': 'var(--dangerd-100)',
    			'dangerd-200': 'var(--dangerd-200)',
    			'dangerd-300': 'var(--dangerd-300)',
    			'dangerd-400': 'var(--dangerd-400)',
    			'dangerd-50': 'var(--dangerd-50)',
    			'dangerd-500': 'var(--dangerd-500)',
    			'dangerd-75': 'var(--dangerd-75)',
    			defaultbody: 'var(--defaultbody)',
    			defaultgrey: 'var(--defaultgrey)',
    			'defaultgrey-2': 'var(--defaultgrey-2)',
    			'defaulttop-background': 'var(--defaulttop-background)',
    			defaultwhite: 'var(--defaultwhite)',
    			'infoi-100': 'var(--infoi-100)',
    			'infoi-200': 'var(--infoi-200)',
    			'infoi-300': 'var(--infoi-300)',
    			'infoi-400': 'var(--infoi-400)',
    			'infoi-50': 'var(--infoi-50)',
    			'infoi-500': 'var(--infoi-500)',
    			'infoi-75': 'var(--infoi-75)',
    			'neutralneutral-100': 'var(--neutralneutral-100)',
    			'neutralneutral-200': 'var(--neutralneutral-200)',
    			'neutralneutral-300': 'var(--neutralneutral-300)',
    			'neutralneutral-400': 'var(--neutralneutral-400)',
    			'neutralneutral-50': 'var(--neutralneutral-50)',
    			'neutralneutral-500': 'var(--neutralneutral-500)',
    			'neutralneutral-600': 'var(--neutralneutral-600)',
    			'neutralneutral-700': 'var(--neutralneutral-700)',
    			'neutralneutral-800': 'var(--neutralneutral-800)',
    			'neutralneutral-900': 'var(--neutralneutral-900)',
    			'primaryp-100': 'var(--primaryp-100)',
    			'primaryp-200': 'var(--primaryp-200)',
    			'primaryp-300': 'var(--primaryp-300)',
    			'primaryp-400': 'var(--primaryp-400)',
    			'primaryp-50': 'var(--primaryp-50)',
    			'primaryp-500': 'var(--primaryp-500)',
    			'primaryp-75': 'var(--primaryp-75)',
    			'secondarys-100': 'var(--secondarys-100)',
    			'secondarys-200': 'var(--secondarys-200)',
    			'secondarys-300': 'var(--secondarys-300)',
    			'secondarys-400': 'var(--secondarys-400)',
    			'secondarys-50': 'var(--secondarys-50)',
    			'secondarys-500': 'var(--secondarys-500)',
    			'secondarys-75': 'var(--secondarys-75)',
    			'successs-100': 'var(--successs-100)',
    			'successs-200': 'var(--successs-200)',
    			'successs-300': 'var(--successs-300)',
    			'successs-400': 'var(--successs-400)',
    			'successs-50': 'var(--successs-50)',
    			'successs-500': 'var(--successs-500)',
    			'successs-75': 'var(--successs-75)',
    			'warningw-100': 'var(--warningw-100)',
    			'warningw-200': 'var(--warningw-200)',
    			'warningw-300': 'var(--warningw-300)',
    			'warningw-400': 'var(--warningw-400)',
    			'warningw-50': 'var(--warningw-50)',
    			'warningw-500': 'var(--warningw-500)',
    			'warningw-75': 'var(--warningw-75)',
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		fontFamily: {
    			'body-base-base-bold': 'var(--body-base-base-bold-font-family)',
    			'body-base-base-medium': 'var(--body-base-base-medium-font-family)',
    			'body-base-base-regular': 'var(--body-base-base-regular-font-family)',
    			'body-base-base-semibold': 'var(--body-base-base-semibold-font-family)',
    			'body-large-large-bold': 'var(--body-large-large-bold-font-family)',
    			'body-large-large-medium': 'var(--body-large-large-medium-font-family)',
    			'body-large-large-regular': 'var(--body-large-large-regular-font-family)',
    			'body-large-large-semibold': 'var(--body-large-large-semibold-font-family)',
    			'body-small-small-bold': 'var(--body-small-small-bold-font-family)',
    			'body-small-small-medium': 'var(--body-small-small-medium-font-family)',
    			'body-small-small-regular': 'var(--body-small-small-regular-font-family)',
    			'body-small-small-semibold': 'var(--body-small-small-semibold-font-family)',
    			'body-xlarge-xlarge-bold': 'var(--body-xlarge-xlarge-bold-font-family)',
    			'body-xlarge-xlarge-medium': 'var(--body-xlarge-xlarge-medium-font-family)',
    			'body-xlarge-xlarge-regular': 'var(--body-xlarge-xlarge-regular-font-family)',
    			'body-xlarge-xlarge-semibold': 'var(--body-xlarge-xlarge-semibold-font-family)',
    			'body-xsmall-xsmall-bold': 'var(--body-xsmall-xsmall-bold-font-family)',
    			'body-xsmall-xsmall-medium': 'var(--body-xsmall-xsmall-medium-font-family)',
    			'body-xsmall-xsmall-regular': 'var(--body-xsmall-xsmall-regular-font-family)',
    			'body-xsmall-xsmall-semibold': 'var(--body-xsmall-xsmall-semibold-font-family)',
    			'body-xxsmall-xxsmall-bold': 'var(--body-xxsmall-xxsmall-bold-font-family)',
    			'body-xxsmall-xxsmall-medium': 'var(--body-xxsmall-xxsmall-medium-font-family)',
    			'body-xxsmall-xxsmall-regular': 'var(--body-xxsmall-xxsmall-regular-font-family)',
    			'body-xxsmall-xxsmall-semibold': 'var(--body-xxsmall-xxsmall-semibold-font-family)',
    			'heading-header-1-header-1-bold': 'var(--heading-header-1-header-1-bold-font-family)',
    			'heading-header-1-header-1-medium': 'var(--heading-header-1-header-1-medium-font-family)',
    			'heading-header-1-header-1-regular': 'var(--heading-header-1-header-1-regular-font-family)',
    			'heading-header-1-header-1-semibold': 'var(--heading-header-1-header-1-semibold-font-family)',
    			'heading-header-2-header-2-bold': 'var(--heading-header-2-header-2-bold-font-family)',
    			'heading-header-2-header-2-medium': 'var(--heading-header-2-header-2-medium-font-family)',
    			'heading-header-2-header-2-regular': 'var(--heading-header-2-header-2-regular-font-family)',
    			'heading-header-2-header-2-semibold': 'var(--heading-header-2-header-2-semibold-font-family)',
    			'heading-header-3-header-3-bold': 'var(--heading-header-3-header-3-bold-font-family)',
    			'heading-header-3-header-3-medium': 'var(--heading-header-3-header-3-medium-font-family)',
    			'heading-header-3-header-3-regular': 'var(--heading-header-3-header-3-regular-font-family)',
    			'heading-header-3-header-3-semibold': 'var(--heading-header-3-header-3-semibold-font-family)',
    			'heading-header-4-header-4-bold': 'var(--heading-header-4-header-4-bold-font-family)',
    			'heading-header-4-header-4-medium': 'var(--heading-header-4-header-4-medium-font-family)',
    			'heading-header-4-header-4-regular': 'var(--heading-header-4-header-4-regular-font-family)',
    			'heading-header-4-header-4-semibold': 'var(--heading-header-4-header-4-semibold-font-family)',
    			'heading-header-5-header-5-bold': 'var(--heading-header-5-header-5-bold-font-family)',
    			'heading-header-5-header-5-medium': 'var(--heading-header-5-header-5-medium-font-family)',
    			'heading-header-5-header-5-regular': 'var(--heading-header-5-header-5-regular-font-family)',
    			'heading-header-5-header-5-semibold': 'var(--heading-header-5-header-5-semibold-font-family)',
    			'heading-header-6-header-6-bold': 'var(--heading-header-6-header-6-bold-font-family)',
    			'heading-header-6-header-6-medium': 'var(--heading-header-6-header-6-medium-font-family)',
    			'heading-header-6-header-6-regular': 'var(--heading-header-6-header-6-regular-font-family)',
    			'heading-header-6-header-6-semibold': 'var(--heading-header-6-header-6-semibold-font-family)',
    			'heading-header-header-bold': 'var(--heading-header-header-bold-font-family)',
    			'heading-header-header-medium': 'var(--heading-header-header-medium-font-family)',
    			'heading-header-header-regular': 'var(--heading-header-header-regular-font-family)',
    			'heading-header-header-semibold': 'var(--heading-header-header-semibold-font-family)',
    			sans: [
    				'ui-sans-serif',
    				'system-ui',
    				'sans-serif',
    				'Apple Color Emoji"',
    				'Segoe UI Emoji"',
    				'Segoe UI Symbol"',
    				'Noto Color Emoji"'
    			]
    		},
    		boxShadow: {
    			'shadow-1': 'var(--shadow-1)'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	},
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
    darkMode: ["class"],
};
